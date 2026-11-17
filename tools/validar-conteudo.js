#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

// ── CLI ──────────────────────────────────────────────────────────────────────
const args  = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
  console.log([
    'Uso: node tools/validar-conteudo.js [--quiet]',
    '',
    'Valida o banco de questões dos módulos 2, 3 e 4.',
    '',
    'Verificações (ERROR → exit 1):',
    '  • id: inteiro positivo, único por módulo',
    '  • tp, ty, text, why: obrigatórios e não-vazios',
    '  • ty: single | multi | match',
    '  • single: opts >= 2, cor inteiro em [0, opts.length)',
    '  • multi:  cor array >= 1, índices em range, sem duplicados',
    '  • match:  pairs >= 2, todo par com l e r não-vazios',
    '  • fig: se presente, o arquivo deve existir em img/',
    '',
    'Avisos (WARN, não falha):',
    '  • texto de questão duplicado no mesmo módulo',
    '  • tp com espaços na borda',
    '  • opts com texto duplicado',
    '  • cor apontando para opção vazia',
    '  • .webp em img/ sem referência em nenhum módulo (órfãos)',
    '  • fig referenciada por mais de uma questão',
    '',
    'Flags:',
    '  --quiet   imprime apenas erros, suprime avisos',
    '  -h/--help este texto',
  ].join('\n'));
  process.exit(0);
}
const QUIET = args.includes('--quiet');

// ── Configuração ─────────────────────────────────────────────────────────────
const ROOT    = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'img');
const MODULES = [
  { file: 'data/modulo2.js', global: 'QUESTIONS_M2', label: 'M2' },
  { file: 'data/modulo3.js', global: 'QUESTIONS_M3', label: 'M3' },
  { file: 'data/modulo4.js', global: 'QUESTIONS_M4', label: 'M4' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
let totalErrors = 0;
let totalWarns  = 0;

function emit(level, filePath, lineHint, id, msg) {
  if (level === 'WARN') totalWarns++;
  if (level === 'ERROR') totalErrors++;
  if (level === 'WARN' && QUIET) return;
  const idPart   = id != null ? `  id=${id}` : '';
  const linePart = lineHint != null ? `:${lineHint}` : '';
  console.log(`${filePath}${linePart}${idPart}  ${level}  ${msg}`);
}

function findLine(src, id) {
  // Search for the id as a JSON value near the start of its object block.
  const re = new RegExp(`"id"\\s*:\\s*${id}\\b`);
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) return i + 1;
  }
  return null;
}

function isEmpty(v) {
  return v == null || (typeof v === 'string' && v.trim() === '');
}

// ── Load all img files ────────────────────────────────────────────────────────
let imgFiles;
try {
  imgFiles = new Set(
    fs.readdirSync(IMG_DIR)
      .filter(f => f.endsWith('.webp'))
      .map(f => `img/${f}`)
  );
} catch {
  imgFiles = new Set();
}

// Imagens também são referenciadas por index.html, CSS, manifest, service worker e
// app.js (logo, ícone, favicon). Sem isso o relatório acusa logo/ícone como órfãos.
const usedElsewhere = new Set();
for (const extra of ['index.html', 'manifest.json', 'sw.js', 'js/app.js', 'css/styles.css']) {
  if (!fs.existsSync(path.join(ROOT, extra))) continue;
  const txt = fs.readFileSync(path.join(ROOT, extra), 'utf8');
  for (const m of txt.matchAll(/([A-Za-z0-9_.-]+\.webp)/g)) usedElsewhere.add(m[1]);
}

const figRefCount = new Map(); // fig path → count of references
const figRefByMod = new Map(); // `${mod}|${fig}` → count, para separar reuso entre módulos de duplicata no mesmo módulo

// ── Validate one module ───────────────────────────────────────────────────────
function validateModule(mod) {
  const { file, global, label } = mod;
  const filePath = path.join(ROOT, file);
  let src;
  try {
    src = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.log(`${file}  ERROR  não foi possível ler o arquivo: ${e.message}`);
    totalErrors++;
    return { label, total: 0, figs: 0, errors: 1, warns: 0 };
  }

  let arr;
  try {
    const win = {};
    new Function('window', src)(win);
    arr = win[global];
    if (!Array.isArray(arr)) throw new Error(`window.${global} não é array`);
  } catch (e) {
    console.log(`${file}  ERROR  falha ao carregar: ${e.message}`);
    totalErrors++;
    return { label, total: 0, figs: 0, errors: 1, warns: 0 };
  }

  const seenIds   = new Map(); // id → line
  const seenTexts = new Map(); // text → id
  let modErrors = 0;
  let modWarns  = 0;
  let modFigs   = 0;

  const prevErrors = totalErrors;
  const prevWarns  = totalWarns;

  for (const q of arr) {
    const line = findLine(src, q.id);

    // ── id ──────────────────────────────────────────────────────────────────
    if (!Number.isInteger(q.id) || q.id <= 0) {
      emit('ERROR', file, line, q.id, `id inválido: deve ser inteiro positivo (encontrado: ${JSON.stringify(q.id)})`);
    } else if (seenIds.has(q.id)) {
      emit('ERROR', file, line, q.id, `id duplicado (visto anteriormente na linha ${seenIds.get(q.id)})`);
    } else {
      seenIds.set(q.id, line);
    }

    // ── campos obrigatórios ──────────────────────────────────────────────────
    for (const field of ['tp', 'ty', 'text', 'why']) {
      if (isEmpty(q[field])) {
        emit('ERROR', file, line, q.id, `campo obrigatório ausente ou vazio: "${field}"`);
      }
    }

    // ── ty válido ─────────────────────────────────────────────────────────────
    const VALID_TY = new Set(['single', 'multi', 'match']);
    if (!VALID_TY.has(q.ty)) {
      emit('ERROR', file, line, q.id, `ty desconhecido: "${q.ty}" (esperado single | multi | match)`);
      continue; // sem ty válido não dá para validar o restante
    }

    // ── single ────────────────────────────────────────────────────────────────
    if (q.ty === 'single') {
      if (!Array.isArray(q.opts) || q.opts.length < 2) {
        emit('ERROR', file, line, q.id, `single: opts deve ter >= 2 itens (tem ${Array.isArray(q.opts) ? q.opts.length : 'ausente'})`);
      } else {
        if (!Number.isInteger(q.cor) || q.cor < 0 || q.cor >= q.opts.length) {
          emit('ERROR', file, line, q.id, `single: cor=${JSON.stringify(q.cor)} fora do intervalo [0, ${q.opts.length - 1}]`);
        } else if (isEmpty(q.opts[q.cor])) {
          emit('WARN', file, line, q.id, `cor aponta para opção vazia (índice ${q.cor})`);
        }
        // opts duplicados
        const optSeen = new Map();
        for (let i = 0; i < q.opts.length; i++) {
          const t = q.opts[i];
          if (optSeen.has(t)) {
            emit('WARN', file, line, q.id, `opts: texto duplicado na posição ${i} (igual à posição ${optSeen.get(t)}): "${t}"`);
          } else {
            optSeen.set(t, i);
          }
        }
      }
    }

    // ── multi ─────────────────────────────────────────────────────────────────
    if (q.ty === 'multi') {
      if (!Array.isArray(q.opts) || q.opts.length < 2) {
        emit('ERROR', file, line, q.id, `multi: opts deve ter >= 2 itens`);
      }
      if (!Array.isArray(q.cor) || q.cor.length < 1) {
        emit('ERROR', file, line, q.id, `multi: cor deve ser array com >= 1 índice`);
      } else {
        const opts = Array.isArray(q.opts) ? q.opts : [];
        const corSeen = new Set();
        for (const idx of q.cor) {
          if (!Number.isInteger(idx) || idx < 0 || idx >= opts.length) {
            emit('ERROR', file, line, q.id, `multi: cor contém índice ${JSON.stringify(idx)} fora do intervalo [0, ${opts.length - 1}]`);
          } else if (corSeen.has(idx)) {
            emit('ERROR', file, line, q.id, `multi: cor contém índice duplicado: ${idx}`);
          } else {
            corSeen.add(idx);
            if (isEmpty(opts[idx])) {
              emit('WARN', file, line, q.id, `cor aponta para opção vazia (índice ${idx})`);
            }
          }
        }
        // opts duplicados
        const optSeen = new Map();
        for (let i = 0; i < opts.length; i++) {
          const t = opts[i];
          if (optSeen.has(t)) {
            emit('WARN', file, line, q.id, `opts: texto duplicado na posição ${i} (igual à posição ${optSeen.get(t)})`);
          } else {
            optSeen.set(t, i);
          }
        }
      }
    }

    // ── match ─────────────────────────────────────────────────────────────────
    if (q.ty === 'match') {
      if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
        emit('ERROR', file, line, q.id, `match: pairs deve ter >= 2 pares (tem ${Array.isArray(q.pairs) ? q.pairs.length : 'ausente'})`);
      } else {
        for (let i = 0; i < q.pairs.length; i++) {
          const p = q.pairs[i];
          if (isEmpty(p && p.l)) emit('ERROR', file, line, q.id, `match: pairs[${i}].l está vazio`);
          if (isEmpty(p && p.r)) emit('ERROR', file, line, q.id, `match: pairs[${i}].r está vazio`);
        }
      }
    }

    // ── fig ──────────────────────────────────────────────────────────────────
    if (q.fig != null && q.fig !== '') {
      modFigs++;
      figRefCount.set(q.fig, (figRefCount.get(q.fig) || 0) + 1);
      const chaveMod = `${q.mod}|${q.fig}`;
      figRefByMod.set(chaveMod, (figRefByMod.get(chaveMod) || 0) + 1);
      if (!imgFiles.has(q.fig)) {
        emit('ERROR', file, line, q.id, `fig "${q.fig}" não existe em img/`);
      }
    }

    // ── WARN: tp com espaços na borda ─────────────────────────────────────────
    if (typeof q.tp === 'string' && q.tp !== q.tp.trim()) {
      emit('WARN', file, line, q.id, `tp com espaço na borda: "${q.tp}"`);
    }

    // ── WARN: texto duplicado no módulo ──────────────────────────────────────
    if (typeof q.text === 'string' && q.text.trim() !== '') {
      const key = q.text.trim();
      if (seenTexts.has(key)) {
        emit('WARN', file, line, q.id, `texto duplicado (igual ao id=${seenTexts.get(key)})`);
      } else {
        seenTexts.set(key, q.id);
      }
    }
  }

  modErrors = totalErrors - prevErrors;
  modWarns  = totalWarns  - prevWarns;

  const status = modErrors > 0 ? `${modErrors} erro(s)` : modWarns > 0 ? `${modWarns} aviso(s)` : 'OK';
  console.log(`${label}: ${arr.length} questões, ${modFigs} figuras — ${status}`);

  return { label, total: arr.length, figs: modFigs, errors: modErrors, warns: modWarns };
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('');
const results = MODULES.map(validateModule);
console.log('');

// ── Órfãos ────────────────────────────────────────────────────────────────────
for (const imgPath of imgFiles) {
  const base = path.basename(imgPath);
  if (!figRefCount.has(imgPath) && !figRefCount.has(base) && !usedElsewhere.has(base)) {
    emit('WARN', imgPath, null, null, `imagem em img/ sem referência em nenhum módulo (órfã)`);
  }
}

// ── fig compartilhada por mais de uma questão ─────────────────────────────────
for (const [chave, count] of figRefByMod.entries()) {
  if (count > 1) {
    const [mod, fig] = chave.split('|');
    emit('WARN', fig, null, null, `mesma figura em ${count} questões do módulo ${mod}`);
  }
}

// ── Resumo ────────────────────────────────────────────────────────────────────
console.log('');
console.log(`TOTAL: ${totalErrors} erro(s), ${totalWarns} aviso(s)`);
if (totalErrors > 0) process.exit(1);
