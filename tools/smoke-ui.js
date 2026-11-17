#!/usr/bin/env node
/**
 * SubnetLab — smoke test de UI (sem dependências).
 *
 * Sobe um servidor estático da raiz do repo, abre o Chromium headless e percorre
 * o caminho que mais quebrou nas últimas mudanças: login → escolher módulo →
 * responder → encerrar → Gabarito → conferir que consultar NÃO escreve progresso.
 *
 * Uso:
 *   node tools/smoke-ui.js                 # roda
 *   node tools/smoke-ui.js --headed        # com janela, para olhar
 *   node tools/smoke-ui.js --keep          # não apaga o perfil temporário
 *   node tools/smoke-ui.js --port 8124     # porta do servidor estático
 *
 * Requisitos: Node >= 21 (usa WebSocket global) e um Chromium/Chrome instalado.
 * O binário é procurado em CHROME_PATH, no Chromium do Hermes e nos caminhos
 * padrão do Windows/Linux. Sai com código 1 quando algum passo falha.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ARGS = process.argv.slice(2);
const HEADED = ARGS.includes('--headed');
const KEEP = ARGS.includes('--keep');
const PORT_IDX = ARGS.indexOf('--port');
const HTTP_PORT = PORT_IDX >= 0 ? Number(ARGS[PORT_IDX + 1]) : 8123;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

// ── utilidades ────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0;
const failures = [];

function ok(name, extra = '') {
  pass++;
  console.log(`  ✓ ${name}${extra ? ' — ' + extra : ''}`);
}
function fail(name, detail) {
  failures.push(`${name}: ${detail}`);
  console.log(`  ✗ ${name} — ${detail}`);
}
function check(name, cond, detail = '') {
  cond ? ok(name, detail) : fail(name, detail || 'condição falsa');
}

// ── servidor estático ─────────────────────────────────────────────────────────
function startServer() {
  const server = http.createServer((req, res) => {
    const clean = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(ROOT, clean === '/' ? 'index.html' : clean);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Service-Worker-Allowed': '/',
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(HTTP_PORT, '127.0.0.1', () => resolve(server));
  });
}

// ── achando o navegador ───────────────────────────────────────────────────────
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    path.join(os.homedir(), 'AppData', 'Local', 'hermes', 'tools', 'chromium-1248', 'chrome-win64', 'chrome.exe'),
    path.join(os.homedir(), 'AppData', 'Local', 'hermes', 'tools', 'chromium-1208', 'chrome-win64', 'chrome.exe'),
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  return candidates.find(p => fs.existsSync(p)) || null;
}

// ── CDP mínimo (WebSocket nativo do Node) ─────────────────────────────────────
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        (this.listeners.get(msg.method) || []).forEach(fn => fn(msg.params, msg.sessionId));
      }
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  send(method, params = {}, sessionId = undefined) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error(`timeout em ${method}`)); }
      }, 20000);
    });
  }
}

async function waitForDevtoolsUrl(proc, ms = 20000) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => reject(new Error('Chromium não anunciou a porta de debug')), ms);
    const onData = d => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); proc.stderr.off('data', onData); resolve(m[1]); }
    };
    proc.stderr.on('data', onData);
    setTimeout(() => { if (!buf.match(/DevTools listening/)) { clearTimeout(timer); reject(new Error('sem DevTools em 20s')); } }, ms - 100);
  });
}

// ── main ──────────────────────────────────────────────────────────────────────
(async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.error('Chromium/Chrome não encontrado. Defina CHROME_PATH.');
    process.exit(2);
  }
  if (typeof WebSocket !== 'function') {
    console.error('Node 21+ é necessário (WebSocket global). Versão atual: ' + process.version);
    process.exit(2);
  }

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'subnetlab-smoke-'));
  let server, proc, cdp, session;
  const jsErrors = [];

  try {
    console.log('\nSubnetLab — smoke test de UI');
    console.log(`  navegador: ${chrome}`);
    server = await startServer();
    console.log(`  servidor:  http://127.0.0.1:${HTTP_PORT}\n`);

    proc = spawn(chrome, [
      HEADED ? '--new-window' : '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run', '--no-default-browser-check', '--disable-gpu',
      '--disable-extensions', '--disable-background-timer-throttling',
      '--window-size=430,932', 'about:blank',
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    const wsUrl = await waitForDevtoolsUrl(proc);
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
    cdp = new CDP(ws);

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    ({ sessionId: session } = await cdp.send('Target.attachToTarget', { targetId, flatten: true }));

    cdp.on('Runtime.exceptionThrown', p => {
      const d = p.exceptionDetails || {};
      jsErrors.push((d.exception && (d.exception.description || d.exception.value)) || d.text || 'erro desconhecido');
    });
    cdp.on('Runtime.consoleAPICalled', p => {
      if (p.type === 'error') jsErrors.push('console.error: ' + (p.args || []).map(a => a.value || a.description).join(' '));
    });

    await cdp.send('Runtime.enable', {}, session);
    await cdp.send('Page.enable', {}, session);
    await cdp.send('Emulation.setDeviceMetricsOverride',
      { width: 430, height: 932, deviceScaleFactor: 2, mobile: true }, session);

    const evaluate = async (expression) => {
      const r = await cdp.send('Runtime.evaluate',
        { expression, returnByValue: true, awaitPromise: true }, session);
      if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      return r.result.value;
    };
    const goto = async (url) => {
      await cdp.send('Page.navigate', { url }, session);
      await sleep(2500);
    };
    // Espera a condição virar verdadeira em vez de chutar um sleep — foi o que
    // deixou o teste instável na primeira execução (clicava antes de renderizar).
    const waitFor = async (expr, label, ms = 8000) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        try { if (await evaluate(expr)) return true; } catch { /* página no meio da troca */ }
        await sleep(120);
      }
      throw new Error(`timeout esperando: ${label}`);
    };

    // ── 1. carga inicial ────────────────────────────────────────────────
    await goto(`http://127.0.0.1:${HTTP_PORT}/`);
    const title = await evaluate('document.title');
    check('app carrega', /SubnetLab/i.test(title || ''), `title="${title}"`);
    check('tela de login presente', await evaluate("!!document.querySelector('#nameInput')"));

    // ── 2. login ────────────────────────────────────────────────────────
    await evaluate(`(() => { const i = document.querySelector('#nameInput');
      i.value = 'Smoke Bot'; document.querySelector('#loginBtn').click(); return 1; })()`);
    await sleep(1500);
    await evaluate("document.querySelector('#code-seen')?.click(); 1");
    await waitFor("!!document.querySelector('.mod-trail-card')", 'trilha aparecer');
    check('entrou na trilha', await evaluate("!!document.querySelector('.mod-trail-card')"));

    // ── 3. selecionar módulo ≠ entrar ───────────────────────────────────
    await evaluate("document.querySelector('.mod-trail-card[data-mod=\"2\"]')?.click(); 1");
    await waitFor("!!document.querySelector('.mod-trail-card--current .mod-trail-cta')", 'CTA do módulo');
    const entrouSozinho = await evaluate("S.screen === 'quiz'");
    check('selecionar módulo não entra no quiz', entrouSozinho === false);
    check('CTA do módulo selecionado existe',
      await evaluate("!!document.querySelector('.mod-trail-card--current .mod-trail-cta')"));
    await evaluate("document.querySelector('.mod-trail-card--current .mod-trail-cta')?.click(); 1");
    await waitFor("!!document.querySelector('#startBtn') || !!document.querySelector('[data-mode=free]')", 'tela de modos');

    // ── 4. sessão livre, 3 questões ─────────────────────────────────────
    await evaluate("document.querySelector('[data-mode=free]')?.click(); 1");
    await sleep(400);
    await evaluate("document.querySelector('#startBtn')?.click(); 1");
    await waitFor("S.screen === 'quiz' && document.querySelectorAll('.opt,.match-row').length > 0", 'primeira questão');
    check('quiz abriu', (await evaluate('S.screen')) === 'quiz');

    for (let i = 0; i < 3; i++) {
      const antes = await evaluate('S.qi');
      await waitFor("document.querySelectorAll('.opt,.match-row').length > 0", `opções da questão ${i + 1}`);

      const ehAssociacao = await evaluate("document.querySelectorAll('select').length > 0");
      if (ehAssociacao) {
        // associação: escolhe a primeira opção de cada select e confirma
        await evaluate(`(() => {
          document.querySelectorAll('select').forEach(s => {
            if (s.options.length > 1) s.selectedIndex = 1;
            s.dispatchEvent(new Event('change', { bubbles: true }));
          });
          document.querySelector('#matchConfirm')?.click();
          return 1;
        })()`);
      } else {
        await evaluate("document.querySelectorAll('.opt')[0]?.click(); 1");
        await sleep(500);
        if (await evaluate("!!document.querySelector('#multiConfirm')")) {
          await evaluate("document.querySelector('#multiConfirm').click(); 1");
        }
      }

      // só avança depois que o app registrou a resposta (evita clicar no vazio)
      await waitFor('S.answered === true', `resposta registrada (questão ${i + 1})`);
      await evaluate("document.querySelector('#nextBtn')?.click(); 1");
      await waitFor(`S.qi > ${antes} || S.screen !== 'quiz'`, `avançar da questão ${i + 1}`);
    }
    if (process.env.SMOKE_DEBUG) {
      console.log('   debug:', await evaluate(`JSON.stringify({
        screen: S.screen, qi: S.qi, answered: S.answered,
        correct: S.correct, wrong: S.wrong,
        qstats: Object.keys(qStats || {}).length,
        opts: document.querySelectorAll('.opt').length
      })`));
    }

    await evaluate("document.querySelector('#quitBtn')?.click(); 1");
    await waitFor("!!document.querySelector('#confOk')", 'confirmação de encerrar');
    await evaluate("document.querySelector('#confOk').click(); 1");
    await waitFor("S.screen === 'start'", 'volta para a trilha');
    const qstats = await evaluate("JSON.parse(localStorage.getItem('sl_qstats') || '{}')");
    check('encerrar salvou as respostas', Object.keys(qstats || {}).length >= 3,
      `${Object.keys(qstats || {}).length} questões`);

    // ── 5. Gabarito é consulta: NÃO escreve progresso ───────────────────
    const before = await evaluate(`JSON.stringify({
      q: localStorage.getItem('sl_qstats'),
      xp: localStorage.getItem('sl_xp_total'),
      hist: (JSON.parse(localStorage.getItem('sl_history') || '[]')).length,
      spaced: localStorage.getItem('sl_spaced')
    })`);

    await evaluate("document.querySelector('#searchBtn')?.click(); 1");
    await waitFor("!!document.querySelector('#searchInput')", 'campo de busca');
    check('tela do Gabarito abre', await evaluate(
      "(document.body.innerText || '').includes('Gabarito')"));
    await evaluate(`(() => { const i = document.querySelector('#searchInput');
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(i, 'vlan');
      i.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
    await waitFor("document.querySelectorAll('.search-item').length > 0", 'resultados da busca');
    const nRes = await evaluate("document.querySelectorAll('.search-item').length");
    check('busca retorna resultados', nRes > 0, `${nRes} resultados`);

    await evaluate("document.querySelector('.search-item')?.click(); 1");
    await waitFor("document.querySelectorAll('.opt.correct').length > 0", 'gabarito da questão');
    check('resposta correta destacada', (await evaluate("document.querySelectorAll('.opt.correct').length")) > 0);
    check('explicação visível', await evaluate("!!document.querySelector('.fb-why')"));
    check('aviso de consulta presente', await evaluate(
      "(document.body.innerText || '').includes('não conta XP')"));

    // navega entre três questões do gabarito
    for (let i = 0; i < 2; i++) {
      const has = await evaluate("!!document.querySelector('#gabNext')");
      if (!has) break;
      await evaluate("document.querySelector('#gabNext').click(); 1");
      await sleep(700);
    }

    const after = await evaluate(`JSON.stringify({
      q: localStorage.getItem('sl_qstats'),
      xp: localStorage.getItem('sl_xp_total'),
      hist: (JSON.parse(localStorage.getItem('sl_history') || '[]')).length,
      spaced: localStorage.getItem('sl_spaced')
    })`);
    check('Gabarito não altera qStats/XP/histórico/espaçada', before === after,
      before === after ? 'byte a byte igual' : `antes=${before} depois=${after}`);

    // ── 6. volta para a busca e a lista continua funcionando ────────────
    await evaluate("document.querySelector('#gabaritoBack')?.click(); 1");
    await waitFor("document.querySelectorAll('.search-item').length > 0", 'volta para a lista');
    check('voltar mantém os resultados', (await evaluate("document.querySelectorAll('.search-item').length")) > 0);

    // ── 7. nenhum erro de JS no caminho inteiro ─────────────────────────
    check('sem erro de JS', jsErrors.length === 0, jsErrors.slice(0, 3).join(' | '));
  } catch (err) {
    fail('execução', err.message);
  } finally {
    try { if (cdp) cdp.ws.close(); } catch {}
    try { if (proc) proc.kill(); } catch {}
    try { if (server) server.close(); } catch {}
    if (!KEEP) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }

    console.log(`\n${failures.length === 0 ? '✅ SMOKE OK' : '❌ SMOKE FALHOU'} — ${pass} passaram, ${failures.length} falharam`);
    if (failures.length) failures.forEach(f => console.log('   - ' + f));
    process.exit(failures.length === 0 ? 0 : 1);
  }
})();
