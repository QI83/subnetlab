// ===================================================================
// SubnetLab v2 — js/app.js
// Simulador CCNA v7 · Vanilla JS · sem dependências externas
// ===================================================================
'use strict';

// ── 1. REGISTRY DE QUESTÕES ─────────────────────────────────────────
// Coleta todos os módulos window.QUESTIONS_M* registrados via script tag.
// Para adicionar M1 ou M3: incluir o script na página — detectado aqui.
let Q = [];
let ALL = [];

function qKey(q) { return q.mod + ':' + q.id; }

function buildPool() {
  ALL = [];
  Object.keys(window)
    .filter(k => /^QUESTIONS_M\d+$/.test(k))
    .sort()
    .forEach(k => ALL.push(...window[k]));
  if (S.selectedMod) {
    let pool = ALL.filter(q => q.mod === S.selectedMod);
    // Módulo 4 = somente o exame de certificação. As questões de ENSA e SRWE
    // já estão nos Módulos 3 e 2, então não se repetem aqui.
    if (S.selectedMod === 4) pool = pool.filter(q => q.fonte === 'cert');
    Q = pool;
  } else {
    Q = ALL.slice();
  }
}

function availableMods() {
  return [...new Set(ALL.map(q => q.mod))].sort((a, b) => a - b);
}

function modProgress(mod) {
  const qs = mod ? ALL.filter(q => q.mod === mod) : ALL;
  // No Módulo 4 o número que importa é o do Exame 200-301: as questões de ENSA e SRWE
  // são material de apoio. Assim o card mostra 90, não as 205 acumuladas.
  const ref = mod === 4 ? qs.filter(q => q.fonte === 'cert') : qs;
  const seen = ref.filter(q => qStats[qKey(q)]).length;
  return { seen, total: ref.length, pct: ref.length ? Math.round(seen / ref.length * 100) : 0 };
}

function nextAfterSplash() {
  S.screen = getStudent() ? 'modules' : 'login';
  render();
}

// ── 2. SIGLAS CCNA ──────────────────────────────────────────────────
// Copiado de reference/CCNA_SIMULATOR.html
const ACRONYMS = {
  'LAN':   'Local Area Network — Rede de Área Local',
  'WAN':   'Wide Area Network — Rede de Área Ampla',
  'WLAN':  'Wireless Local Area Network — Rede Local Sem Fio',
  'VLAN':  'Virtual Local Area Network — Rede Local Virtual',
  'VPN':   'Virtual Private Network — Rede Privada Virtual',
  'ISP':   'Internet Service Provider — Provedor de Serviço de Internet',
  'IP':    'Internet Protocol — Protocolo de Internet',
  'IPv4':  'Internet Protocol version 4 — Protocolo de Internet versão 4',
  'IPv6':  'Internet Protocol version 6 — Protocolo de Internet versão 6',
  'TCP':   'Transmission Control Protocol — Protocolo de Controle de Transmissão',
  'UDP':   'User Datagram Protocol — Protocolo de Datagrama de Usuário',
  'ICMP':  'Internet Control Message Protocol — Protocolo de Mensagens de Controle',
  'ARP':   'Address Resolution Protocol — Protocolo de Resolução de Endereços (IP→MAC)',
  'DNS':   'Domain Name System — Sistema de Nomes de Domínio (URL→IP)',
  'DHCP':  'Dynamic Host Configuration Protocol — Protocolo de Configuração Dinâmica de Host',
  'DHCPv4':'Dynamic Host Configuration Protocol v4 — DHCP para redes IPv4',
  'DHCPv6':'Dynamic Host Configuration Protocol v6 — DHCP para redes IPv6',
  'HTTP':  'HyperText Transfer Protocol — Protocolo de Transferência de Hipertexto',
  'HTTPS': 'HTTP Secure — HTTP com camada de criptografia TLS/SSL',
  'FTP':   'File Transfer Protocol — Protocolo de Transferência de Arquivos',
  'SSH':   'Secure Shell — Protocolo de acesso remoto seguro (criptografado)',
  'Telnet':'Telecommunication Network — Acesso remoto sem criptografia (inseguro)',
  'SNMP':  'Simple Network Management Protocol — Protocolo de Gerenciamento de Rede',
  'NTP':   'Network Time Protocol — Protocolo de Sincronização de Tempo',
  'SMTP':  'Simple Mail Transfer Protocol — Protocolo de Envio de E-mail',
  'PPP':   'Point-to-Point Protocol — Protocolo de Comunicação Ponto a Ponto',
  'NAT':   'Network Address Translation — Tradução de Endereços de Rede',
  'ACL':   'Access Control List — Lista de Controle de Acesso',
  'QoS':   'Quality of Service — Qualidade de Serviço (priorização de tráfego)',
  'PoE':   'Power over Ethernet — Alimentação elétrica via cabo Ethernet',
  'RFC':   'Request for Comments — Documento de especificação de padrões da Internet',
  'OSI':   'Open Systems Interconnection — Modelo de referência de 7 camadas para redes',
  'PDU':   'Protocol Data Unit — Unidade de Dados de Protocolo (frame/pacote/segmento)',
  'MTU':   'Maximum Transmission Unit — Tamanho máximo de unidade de transmissão',
  'TTL':   'Time to Live — Tempo de Vida do pacote (número máximo de saltos)',
  'DSL':   'Digital Subscriber Line — Linha Digital de Assinante (conexão banda larga)',
  'ISL':   'Inter-Switch Link — Protocolo de trunk proprietário Cisco (obsoleto)',
  'MAC':   'Media Access Control — Controle de Acesso ao Meio (endereço físico único da placa de rede)',
  'NIC':   'Network Interface Card — Placa de Interface de Rede',
  'CAM':   'Content Addressable Memory — Memória de Acesso por Conteúdo (tabela MAC do switch)',
  'FCS':   'Frame Check Sequence — Verificação de erros no frame Ethernet',
  'STP':   'Spanning Tree Protocol — Protocolo Árvore Geradora (elimina loops na camada 2)',
  'RSTP':  'Rapid Spanning Tree Protocol — STP Rápido (IEEE 802.1w), converge mais rápido que o STP',
  'PVST':  'Per-VLAN Spanning Tree — Instância STP separada por VLAN (proprietário Cisco)',
  'MSTP':  'Multiple Spanning Tree Protocol — STP múltiplo, agrupa VLANs em instâncias (IEEE 802.1s)',
  'MST':   'Multiple Spanning Tree — Implementação Cisco do IEEE 802.1s (múltiplas instâncias STP)',
  'BPDU':  'Bridge Protocol Data Unit — Mensagem STP trocada entre switches para eleger caminhos',
  'BID':   'Bridge ID — Identificador da Bridge: prioridade (2 bytes) + endereço MAC (6 bytes)',
  'VTP':   'VLAN Trunking Protocol — Protocolo Cisco para propagar configurações de VLAN automaticamente',
  'DTP':   'Dynamic Trunking Protocol — Protocolo Cisco para negociar links trunk automaticamente',
  'SVI':   'Switch Virtual Interface — Interface virtual do switch para gerenciamento via VLAN',
  'LACP':  'Link Aggregation Control Protocol — Padrão IEEE 802.3ad para agregação de links (EtherChannel)',
  'PAgP':  'Port Aggregation Protocol — Protocolo proprietário Cisco para criar EtherChannel',
  'FIB':   'Forwarding Information Base — Tabela pré-compilada de encaminhamento usada pelo CEF',
  'CEF':   'Cisco Express Forwarding — Mecanismo de encaminhamento mais rápido dos roteadores Cisco',
  'FHRP':  'First Hop Redundancy Protocol — Protocolo de Redundância do Primeiro Salto (gateway)',
  'HSRP':  'Hot Standby Router Protocol — Gateway redundante Cisco: um roteador ativo + um standby',
  'VRRP':  'Virtual Router Redundancy Protocol — Padrão aberto IEEE de gateway redundante',
  'GLBP':  'Gateway Load Balancing Protocol — Gateway redundante Cisco COM balanceamento de carga real',
  'DAI':   'Dynamic ARP Inspection — Inspeção ARP Dinâmica (protege contra ARP spoofing/poisoning)',
  'AAA':   'Authentication, Authorization, Accounting — Autenticação, Autorização e Contabilidade',
  'RADIUS':'Remote Authentication Dial-In User Service — Servidor de autenticação centralizada (AAA)',
  'EAP':   'Extensible Authentication Protocol — Protocolo extensível de autenticação (usado no 802.1X)',
  'AP':    'Access Point — Ponto de Acesso sem fio (dispositivo WiFi que conecta clientes à rede)',
  'SSID':  'Service Set Identifier — Nome da rede WiFi transmitido pelo Access Point',
  'WLC':   'Wireless LAN Controller — Controlador central que gerencia múltiplos APs',
  'WPA':   'Wi-Fi Protected Access — Protocolo de segurança WiFi v1 (usa TKIP, mais fraco)',
  'WEP':   'Wired Equivalent Privacy — Protocolo de segurança WiFi obsoleto e facilmente quebrado',
  'AES':   'Advanced Encryption Standard — Criptografia simétrica forte (128/256 bits), usada no WPA2',
  'TKIP':  'Temporal Key Integrity Protocol — Criptografia do WPA (mais fraca que AES/CCMP)',
  'CCMP':  'Counter Mode CBC-MAC Protocol — Modo de criptografia do WPA2 baseado em AES',
  'PSK':   'Pre-Shared Key — Chave Pré-Compartilhada (senha WiFi no modo Personal/doméstico)',
  'OSPF':  'Open Shortest Path First — Protocolo de roteamento dinâmico de estado de link (padrão aberto)',
  'EIGRP': 'Enhanced Interior Gateway Routing Protocol — Protocolo de roteamento híbrido proprietário Cisco',
  'RIP':   'Routing Information Protocol — Protocolo de roteamento por vetor de distância (simples, legado)',
  'BGP':   'Border Gateway Protocol — Protocolo de roteamento entre sistemas autônomos (Internet)',
  'AD':    'Administrative Distance — Distância Administrativa (valor de confiabilidade da fonte de rota)',
  'SLAAC': 'Stateless Address Autoconfiguration — Autoconfiguração de endereço IPv6 sem servidor DHCP',
  'RA':    'Router Advertisement — Anúncio do Roteador (mensagem ICMPv6 com prefixo e flags M/O)',
  'RS':    'Router Solicitation — Solicitação de Roteador (host pede RA ao roteador via ICMPv6)',
  'NMS':   'Network Management System — Sistema de Gerenciamento de Rede (recebe traps SNMP)',
  'MIB':   'Management Information Base — Base de dados de variáveis gerenciáveis pelo SNMP',
  'VTY':   'Virtual Terminal Lines — Linhas virtuais de terminal para acesso remoto SSH/Telnet no IOS',
  'IEEE':  'Institute of Electrical and Electronics Engineers — Organização que define padrões de rede',
  'VoIP':  'Voice over IP — Voz sobre IP (telefonia transmitida pela rede de dados)',
  'DORA':  'Discover, Offer, Request, Acknowledge — As 4 mensagens do processo DHCP',
  'NAK':   'Negative Acknowledgment — Resposta negativa do DHCP (rejeita renovação de endereço)',
};

const _acrKeys = Object.keys(ACRONYMS).sort((a, b) => b.length - a.length);
const _acrRe = new RegExp(
  '(?<![\\w/])(' + _acrKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\w/])',
  'g'
);

function wrapAcronyms(html) {
  return html.replace(_acrRe, m => {
    const def = ACRONYMS[m];
    return `<span class="acr" role="term" tabindex="0" aria-label="${esc(def)}" data-def="${esc(def)}">${m}</span>`;
  });
}

// ── 3. CONSTANTES ───────────────────────────────────────────────────
const KEY = {
  name:     'sl_name',
  dark:     'sl_dark',
  favs:     'sl_favs',
  progress: 'sl_progress',
  history:  'sl_history',
  qstats:   'sl_qstats',
  examdate: 'sl_examdate',
  spaced:   'sl_spaced',
};

const LEVELS = [
  { n: 'Novato',       min: 0,   max: 60  },
  { n: 'Trainee',      min: 60,  max: 150 },
  { n: 'Júnior',       min: 150, max: 280 },
  { n: 'Técnico',      min: 280, max: 450 },
  { n: 'Especialista', min: 450, max: 650 },
  { n: 'Engineer',     min: 650, max: 900 },
  { n: 'CCNA Ready',   min: 900, max: 901 },
];

const TOPIC_COLORS = {
  'VLANs':          '#1D9E75',
  'Trunking':       '#534AB7',
  'Inter-VLAN':     '#D85A30',
  'STP':            '#185FA5',
  'EtherChannel':   '#639922',
  'DHCPv4':         '#BA7517',
  'DHCPv6':         '#854F0B',
  'FHRP':           '#993556',
  'Segurança L2':   '#A32D2D',
  'WLAN':           '#1D9E75',
  'Roteamento':     '#D85A30',
  'Switching':      '#185FA5',
  'Troubleshooting':'#993556',
  // Module 3 — ENSA
  'OSPF':           '#2555B6',
  'ACLs':           '#B55D23',
  'WAN':            '#6E4DD3',
  'Arquitetura':    '#30895D',
  'NAT':            '#196C61',
  'Segurança':      '#C72929',
  'Gerência':       '#46761C',
  'SDN/Cloud':      '#AF32C9',
  'QoS':            '#86831F',
  'Automação':      '#257A9C',
};

const MODE_INFO = {
  free:   { label: '📚 Livre',           sub: 'Feedback imediato, sem timer' },
  timed:  { label: '⏱ Prova',            sub: 'Cronômetro, resultado no fim' },
  topic:  { label: '🏷️ Por Tópico',      sub: 'Escolha um tema específico' },
  errors: { label: '❌ Revisão de Erros', sub: 'Questões que você errou' },
  spaced: { label: '🔁 Revisão Espaçada', sub: 'Questões não dominadas' },
};

// ── 4. UTILITÁRIOS ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Escapa caracteres HTML para prevenir XSS
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function pad(n) { return String(n).padStart(2, '0'); }

function getLvl(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--)
    if (xp >= LEVELS[i].min) return { ...LEVELS[i], idx: i };
  return { ...LEVELS[0], idx: 0 };
}

function topicColor(tp) {
  return TOPIC_COLORS[tp] || '#7AB8F5';
}

function dateLabel() {
  return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
    + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Data LOCAL no formato YYYY-MM-DD (toISOString usa UTC e adianta o dia à noite no Brasil)
function hojeISO() {
  const d = new Date();
  return d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
}

// ── 5. PERSISTÊNCIA (somente localStorage) ──────────────────────────
let darkMode  = localStorage.getItem(KEY.dark) !== 'false';
let favorites = new Set(JSON.parse(localStorage.getItem(KEY.favs) || '[]'));
let qStats    = JSON.parse(localStorage.getItem(KEY.qstats) || '{}');
let spaced    = JSON.parse(localStorage.getItem(KEY.spaced) || '{}');

function getStudent()     { return localStorage.getItem(KEY.name) || ''; }
function saveStudent(n)   { localStorage.setItem(KEY.name, esc(n).slice(0, 40)); }
function getExamDate()    { return localStorage.getItem(KEY.examdate) || ''; }
function saveExamDate(d)  { localStorage.setItem(KEY.examdate, d); }

function saveProgress() {
  if (S.screen !== 'quiz') return;
  const snap = {
    qi: S.qi,
    order: S.order,
    xp: S.xp,
    lives: S.lives === Infinity ? -1 : S.lives,
    maxLives: S.maxLives === Infinity ? -1 : S.maxLives,
    streak: S.streak,
    maxStreak: S.maxStreak,
    correct: S.correct,
    wrong: S.wrong,
    wrongLog: S.wrongLog.map(w => ({ qId: w.q ? w.q.id : null, userAns: w.userAns })),
    topicStats: S.topicStats,
    timerMode: S.timerMode,
    timerLeft: S.timerLeft,
    startMode: S.startMode,
    selectedTopic: S.selectedTopic,
  };
  localStorage.setItem(KEY.progress, JSON.stringify(snap));
}

function loadProgress() {
  const raw = localStorage.getItem(KEY.progress);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    // Reconstruir wrongLog com objetos de questão completos
    s.wrongLog = (s.wrongLog || [])
      .map(w => ({ q: Q.find(x => x.id === w.qId) || null, userAns: w.userAns }))
      .filter(w => w.q);
    // Restaurar Infinity
    if (s.lives === -1) s.lives = Infinity;
    if (s.maxLives === -1) s.maxLives = Infinity;
    return s;
  } catch { return null; }
}

function clearProgress() { localStorage.removeItem(KEY.progress); }

function saveHistory(entry) {
  const h = JSON.parse(localStorage.getItem(KEY.history) || '[]');
  h.unshift(entry);
  if (h.length > 20) h.pop();
  localStorage.setItem(KEY.history, JSON.stringify(h));
}

function getHistory() {
  return JSON.parse(localStorage.getItem(KEY.history) || '[]');
}

function migrateQStats() {
  let changed = false;
  const fixed = {};
  for (const [k, v] of Object.entries(qStats)) {
    if (/^\d+$/.test(k)) { fixed['2:' + k] = v; changed = true; }
    else { fixed[k] = v; }
  }
  if (changed) {
    qStats = fixed;
    localStorage.setItem(KEY.qstats, JSON.stringify(qStats));
  }
}

function updateQStat(q, correct) {
  const k = qKey(q);
  if (!qStats[k]) qStats[k] = { a: 0, c: 0 };
  qStats[k].a++;
  if (correct) qStats[k].c++;
  localStorage.setItem(KEY.qstats, JSON.stringify(qStats));
}

function updateSpaced(q, correct) {
  const k = qKey(q);
  const s = spaced[k] ? { ...spaced[k] } : { int: 1, due: hojeISO(), ease: 2.5, reps: 0 };
  if (correct) {
    s.reps += 1;
    if (s.reps === 1)      s.int = 1;
    else if (s.reps === 2) s.int = 6;
    else                   s.int = Math.round(s.int * s.ease);
    s.ease = Math.min(3.0, +(s.ease + 0.1).toFixed(2));
  } else {
    s.reps = 0;
    s.int  = 1;
    s.ease = Math.max(1.3, +(s.ease - 0.2).toFixed(2));
  }
  const d = new Date();
  d.setDate(d.getDate() + s.int);
  s.due = d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
  spaced[k] = s;
}

function toggleFav(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  localStorage.setItem(KEY.favs, JSON.stringify([...favorites]));
}

function exportData() {
  const data = {
    __v: 2,
    name: getStudent(),
    examDate: getExamDate(),
    history: getHistory(),
    qStats,
    favs: [...favorites],
    dark: darkMode,
  };
  const filename = `subnetlab_progresso_${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showAlert(`Backup exportado\n${filename}`);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (!d.__v) throw new Error('Formato inválido');
      if (d.name)     saveStudent(d.name);
      if (d.examDate) saveExamDate(d.examDate);
      if (d.history)  localStorage.setItem(KEY.history, JSON.stringify(d.history));
      if (d.qStats)   { qStats = d.qStats; migrateQStats(); localStorage.setItem(KEY.qstats, JSON.stringify(qStats)); }
      if (d.favs)     { favorites = new Set(d.favs); localStorage.setItem(KEY.favs, JSON.stringify(d.favs)); }
      if (typeof d.dark === 'boolean') {
        darkMode = d.dark;
        localStorage.setItem(KEY.dark, String(darkMode));
      }
      showAlert('✅ Progresso importado com sucesso!');
      render();
    } catch {
      showAlert('❌ Arquivo inválido. Verifique se é um backup do SubnetLab.');
    }
  };
  reader.readAsText(file);
}

// ── 6. ESTADO ───────────────────────────────────────────────────────
let S = {
  screen:        'login',  // splash | login | modules | start | quiz | result | review | history | search
  startMode:     'free',   // free | timed | topic | errors | spaced
  selectedTopic: null,
  order:         [],       // índices em Q para a sessão atual
  qi:            0,        // índice corrente em order
  xp:            0,
  lives:         Infinity,
  maxLives:      Infinity,
  streak:        0,
  maxStreak:     0,
  correct:       0,
  wrong:         0,
  answered:      false,
  selected:      null,     // índice original selecionado (single)
  multiSel:      [],       // índices originais selecionados (multi)
  matchSel:      {},       // {pairIdx: optIdx} para match
  shuffledMatchOpts: [],   // opções direita embaralhadas (match)
  optOrder:      null,     // ordem embaralhada das opções (single/multi)
  badges:        [],
  wrongLog:      [],       // [{q, userAns}]
  topicStats:    {},       // {tp: {c, t}}
  timerMode:     'free',
  timerLeft:     0,
  reviewIdx:     0,
  searchQuery:   '',
  selectedMod:   0,
};

// ── 7. TIMER ────────────────────────────────────────────────────────
let timerInterval = null;

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    if (S.screen !== 'quiz') { stopTimer(); return; }
    S.timerLeft = Math.max(0, S.timerLeft - 1);
    if (S.timerLeft <= 0) { stopTimer(); finishQuiz(); return; }
    const el = document.getElementById('hud-timer');
    if (el) {
      const t = S.timerLeft;
      el.className = t <= 300 ? 'timer-danger' : t <= 900 ? 'timer-warn' : 'timer-ok';
      el.textContent = '⏱ ' + formatTime(t);
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// ── 8. TEMA ─────────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
}

function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem(KEY.dark, String(darkMode));
  applyTheme();
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.textContent = darkMode ? '☀️' : '🌙';
    b.setAttribute('aria-label', darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro');
  });
}

// ── 9. NÚCLEO DO QUIZ ────────────────────────────────────────────────
function getSpacedPool() {
  const hoje = hojeISO();
  return Q.map((_, i) => i).filter(i => {
    const s = spaced[qKey(Q[i])];
    if (!s) return true;      // nunca revisada → entra
    return s.due <= hoje;     // venceu → entra
  });
}

// Revisão de erros: questões erradas nas últimas sessões ou com c < a em qStats
function getErrorPool() {
  const h = getHistory();
  const counts = {};
  h.slice(0, 15).forEach(entry => {
    (entry.wrongIds || []).forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  });
  // Also include any question that was attempted but not always correct per qStats
  Q.forEach(q => {
    const st = qStats[qKey(q)];
    if (st && st.a > 0 && st.c < st.a) {
      counts[q.id] = counts[q.id] || 1;
    }
  });
  return Q.map((_, i) => i).filter(i => counts[Q[i].id] > 0)
    .sort((a, b) => (counts[Q[b].id] || 0) - (counts[Q[a].id] || 0));
}

function startQuiz() {
  stopTimer();
  const mode = S.startMode;
  let pool;

  if (mode === 'favs') {
    pool = Q.map((_, i) => i).filter(i => favorites.has(Q[i].id));
    if (!pool.length) { showAlert('Nenhuma questão nos favoritos. Adicione questões com ☆ primeiro!'); return; }
  } else if (mode === 'topic') {
    if (!S.selectedTopic) { showAlert('Selecione um tópico antes de iniciar.'); return; }
    pool = Q.map((_, i) => i).filter(i => Q[i].tp === S.selectedTopic);
  } else if (mode === 'errors') {
    pool = getErrorPool();
    if (!pool.length) { showAlert('Nenhum erro registrado ainda. Complete uma sessão primeiro!'); return; }
  } else if (mode === 'spaced') {
    pool = getSpacedPool();
    if (!pool.length) { showAlert('Nada para revisar hoje. Volte amanhã! ✓'); return; }
  } else {
    pool = [...Array(Q.length).keys()];
    // Revisão Completa (sem módulo escolhido): a Prova é uma amostra de 60 questões
    // sorteadas do banco; o modo Livre continua apresentando todas, aleatoriamente.
    if (mode === 'timed' && !S.selectedMod && pool.length > 60) {
      pool = shuffle(pool).slice(0, 60);
    }
  }

  if (!pool.length) { showAlert('Nenhuma questão disponível para este modo.'); return; }

  const order    = shuffle(pool);
  const isTimed  = mode === 'timed';
  const maxLives = isTimed ? Math.max(1, Math.floor(pool.length * 0.30)) : Infinity;

  clearProgress();

  S = {
    screen: 'quiz',
    startMode: mode,
    selectedTopic: S.selectedTopic,
    selectedMod: S.selectedMod,
    order,
    qi: 0,
    xp: 0,
    lives: maxLives,
    maxLives,
    streak: 0,
    maxStreak: 0,
    correct: 0,
    wrong: 0,
    answered: false,
    selected: null,
    multiSel: [],
    matchSel: {},
    shuffledMatchOpts: [],
    optOrder: null,
    badges: [],
    wrongLog: [],
    spacedLog: [],
    topicStats: {},
    timerMode: isTimed ? 'timed' : 'free',
    timerLeft: pool.length * 60,
    reviewIdx: 0,
    searchQuery: '',
  };

  if (isTimed) startTimer();
  render();
}

function resumeQuiz() {
  const saved = loadProgress();
  if (!saved) return;
  S = {
    ...S,
    ...saved,
    screen: 'quiz',
    answered: false,
    selected: null,
    multiSel: [],
    matchSel: {},
    shuffledMatchOpts: [],
    optOrder: null,
  };
  if (S.timerMode === 'timed') startTimer();
  render();
}

function handleSingle(dispIdx) {
  if (S.answered) return;
  const q       = Q[S.order[S.qi]];
  const realIdx = S.optOrder[dispIdx];
  S.selected    = realIdx;
  S.answered    = true;
  const ok      = realIdx === q.cor;
  applyScore(q, ok, dispIdx);
  render();
  saveProgress();
  if (S.timerMode === 'timed' && S.lives <= 0) showLivesOut();
}

function handleMultiToggle(dispIdx) {
  if (S.answered) return;
  const realIdx = S.optOrder[dispIdx];
  if (S.multiSel.includes(realIdx))
    S.multiSel = S.multiSel.filter(x => x !== realIdx);
  else
    S.multiSel = [...S.multiSel, realIdx];
  // Atualiza apenas os botões de opção, sem re-renderizar tudo
  document.querySelectorAll('.opt[data-di]').forEach(btn => {
    const di  = parseInt(btn.dataset.di);
    const ri  = S.optOrder[di];
    const sel = S.multiSel.includes(ri);
    btn.classList.toggle('sel', sel);
    btn.querySelector('.olet').style.background = sel ? 'var(--blue)' : '';
    btn.querySelector('.olet').style.color      = sel ? '#fff' : '';
    btn.querySelector('.olet').style.borderColor = sel ? 'var(--blue)' : '';
  });
  const confirmBtn = document.getElementById('multiConfirm');
  if (confirmBtn) confirmBtn.disabled = S.multiSel.length === 0;
}

function handleMultiConfirm() {
  if (S.answered || S.multiSel.length === 0) return;
  const q      = Q[S.order[S.qi]];
  S.answered   = true;
  const corSet = new Set(q.cor);
  const selSet = new Set(S.multiSel);
  // Considerada correta se selecionou exatamente as corretas
  const ok     = [...corSet].every(c => selSet.has(c)) && selSet.size === corSet.size;
  applyScore(q, ok, null);
  render();
  saveProgress();
  if (S.timerMode === 'timed' && S.lives <= 0) showLivesOut();
}

function handleMatchSel(pairIdx, optVal) {
  if (S.answered) return;
  S.matchSel = { ...S.matchSel, [pairIdx]: parseInt(optVal) };
  const confirmBtn = document.getElementById('matchConfirm');
  const q = Q[S.order[S.qi]];
  if (confirmBtn) confirmBtn.disabled = Object.keys(S.matchSel).length < q.pairs.length;
}

function handleMatchConfirm() {
  if (S.answered) return;
  const q   = Q[S.order[S.qi]];
  if (Object.keys(S.matchSel).length < q.pairs.length) return;
  S.answered = true;
  const allOk = q.pairs.every((p, pi) => S.shuffledMatchOpts[S.matchSel[pi]] === p.r);
  applyScore(q, allOk, null);
  render();
  saveProgress();
  if (S.timerMode === 'timed' && S.lives <= 0) showLivesOut();
}

function applyScore(q, ok, _dispIdx) {
  if (ok) {
    S.streak++;
    if (S.streak > S.maxStreak) S.maxStreak = S.streak;
    S.xp += 15 + (S.streak >= 3 ? 10 : S.streak >= 2 ? 5 : 0);
    S.correct++;
  } else {
    if (S.timerMode === 'timed' && S.lives !== Infinity)
      S.lives = Math.max(0, S.lives - 1);
    S.streak = 0;
    S.xp     = Math.max(0, S.xp - 5);
    S.wrong++;
    S.wrongLog.push({ q, userAns: null });
  }
  // Estatísticas por tópico e por questão
  const tp = q.tp;
  if (!S.topicStats[tp]) S.topicStats[tp] = { c: 0, t: 0 };
  S.topicStats[tp].t++;
  if (ok) S.topicStats[tp].c++;
  updateQStat(q, ok);
  if (S.startMode === 'spaced') {
    if (!S.spacedLog) S.spacedLog = [];
    S.spacedLog.push({ q, ok });
  }

  // Animação flash
  const app = document.getElementById('app');
  if (app) {
    app.classList.remove('flash-ok', 'flash-ng');
    void app.offsetWidth;
    app.classList.add(ok ? 'flash-ok' : 'flash-ng');
  }
}

function showLivesOut() {
  if (document.getElementById('lives-out-overlay')) return;
  closeAllModals();
  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.id = 'lives-out-overlay';
  el.innerHTML = `<div class="cmodal">
    <div class="cmodal-title">⚠️ Vidas esgotadas</div>
    <div class="cmodal-msg">Você ultrapassou o limite de erros para o Modo Prova.<br>Deseja continuar sem pontuação ou encerrar agora?</div>
    <div class="cmodal-btns">
      <button class="btn" id="lo-end">Encerrar</button>
      <button class="btn pri" id="lo-cont">Continuar</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.querySelector('#lo-end').onclick  = () => { el.remove(); finishQuiz(); };
  el.querySelector('#lo-cont').onclick = () => { el.remove(); S.lives = Infinity; };
}

function nextQuestion() {
  if (S.qi >= S.order.length - 1) { finishQuiz(); return; }
  S.qi++;
  S.answered         = false;
  S.selected         = null;
  S.multiSel         = [];
  S.matchSel         = {};
  S.shuffledMatchOpts = [];
  S.optOrder         = null;
  render();
  saveProgress();
}

function buildHistoryEntry() {
  const tot = S.correct + S.wrong;
  const pct = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const wrongIds = S.wrongLog.map(w => w.q?.id).filter(Boolean);
  return {
    date:       dateLabel(),
    pct,
    correct:    S.correct,
    wrong:      S.wrong,
    total:      tot,
    xp:         S.xp,
    level:      getLvl(S.xp).n,
    passed:     S.timerMode !== 'timed' || S.lives !== Infinity && S.lives > 0 || pct >= 70,
    mode:       S.timerMode === 'timed' ? '⏱' : '📚',
    topicStats: S.topicStats,
    wrongIds,
    startMode:  S.startMode,
  };
}

// Persiste o estado da revisão espaçada (chamada em qualquer saída do quiz)
function persistSpaced() {
  if (S.startMode === 'spaced' && S.spacedLog?.length) {
    S.spacedLog.forEach(({ q, ok }) => updateSpaced(q, ok));
    localStorage.setItem(KEY.spaced, JSON.stringify(spaced));
    S.spacedLog = [];
  }
}

function finishQuiz() {
  stopTimer();
  clearProgress();

  persistSpaced();

  const tot = S.correct + S.wrong;
  const pct = tot > 0 ? Math.round(S.correct / tot * 100) : 0;

  // Badges
  S.badges = [];
  if (pct === 100) S.badges.push({ t: 'Perfeito 🏆', bg: 'var(--green-bg)', c: 'var(--green-text)', bc: 'var(--green)' });
  if (S.maxStreak >= 5) S.badges.push({ t: 'Streak Master 🔥', bg: 'var(--purple-bg)', c: 'var(--purple-text)', bc: 'var(--purple)' });
  if (S.lives !== Infinity && S.lives > 0) S.badges.push({ t: 'Aprovado ✓', bg: 'var(--blue-bg)', c: 'var(--blue-text)', bc: 'var(--blue)' });
  if (S.wrong === 0 && pct > 0) S.badges.push({ t: 'Sem Erros 💚', bg: 'var(--green-bg)', c: 'var(--green-text)', bc: 'var(--green)' });
  if (S.xp >= 300) S.badges.push({ t: 'XP Master ⚡', bg: 'var(--yellow-bg)', c: 'var(--yellow-text)', bc: 'var(--yellow)' });
  if (S.timerMode === 'timed') S.badges.push({ t: '⏱ Contra-relógio', bg: 'var(--blue-bg)', c: 'var(--blue-text)', bc: 'var(--blue)' });

  // Histórico
  saveHistory(buildHistoryEntry());

  S.screen = 'result';
  render();
}

// ── 10. RENDER ──────────────────────────────────────────────────────
function render() {
  applyTheme();
  stopCountdownTick();   // re-armado por bindStart quando a tela start renderizar
  const app = document.getElementById('app');
  if (!app) return;

  if (S.screen === 'splash')  { app.innerHTML = renderSplash();            bindSplash();  return; }
  if (S.screen === 'modules') { app.innerHTML = renderModules();           bindModules(); return; }
  if (S.screen === 'login')   { app.innerHTML = renderLogin();             bindLogin();   return; }
  if (S.screen === 'start')   { app.innerHTML = renderStart();             bindStart();   return; }
  if (S.screen === 'quiz')    { app.innerHTML = renderQuiz();              bindQuiz();    return; }
  if (S.screen === 'result')  { app.innerHTML = renderResult();            bindResult();  return; }
  if (S.screen === 'review')  { app.innerHTML = renderReview();            bindReview();  return; }
  if (S.screen === 'history') { app.innerHTML = renderHistory();           bindHistory(); return; }
  if (S.screen === 'search')  { app.innerHTML = renderSearch();            bindSearch();  return; }
}

// ── DEFINIÇÕES DOS MÓDULOS ────────────────────────────────────────────
const MOD_DEFS = [
  {
    mod: 1,
    icon: '🌐',
    name: 'Introduction to Networks',
    abbr: 'ITN',
    desc: 'Fundamentos de redes, modelo OSI/TCP-IP, cabeçalho, protocolos básicos e configuração inicial de dispositivos Cisco.',
  },
  {
    mod: 2,
    icon: '🔀',
    name: 'Switching, Routing & Wireless Essentials',
    abbr: 'SRWE',
    desc: 'VLANs, STP, EtherChannel, roteamento inter-VLAN, DHCPv4/v6, WLAN, segurança de Camada 2 e protocolos FHRP.',
  },
  {
    mod: 3,
    icon: '🏢',
    name: 'Enterprise Networking, Security & Automation',
    abbr: 'ENSA',
    desc: 'OSPF, ACLs, NAT, QoS, gerenciamento de rede, segurança empresarial e automação com Python/Ansible.',
  },
  {
    mod: 4,
    icon: '🎓',
    name: 'Preparação para a Certificação',
    abbr: 'CERT',
    desc: 'Exames finais dos três cursos do CCNA reunidos, mais o exame prático de certificação 200-301.',
  },
  {
    mod: 0,
    icon: '🎯',
    name: 'Revisão Completa',
    abbr: 'Todos',
    desc: 'Revisão geral com todas as questões — ideal para a prova de certificação CCNA 200-301.',
  },
];

// ── SPLASH ────────────────────────────────────────────────────────────
function renderSplash() {
  return `<div class="splash-screen" id="splash-screen" role="main" aria-label="Carregando SubnetLab">
    <div class="splash-logo">🐴</div>
    <div class="splash-title">SubnetLab</div>
    <div class="splash-pbar" aria-hidden="true">
      <div class="splash-pfill"></div>
    </div>
  </div>`;
}

function bindSplash() {
  const container = document.getElementById('splash-screen');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 300 : 1500;
  let done = false;
  function advance() {
    if (done) return;
    done = true;
    nextAfterSplash();
  }
  const timer = setTimeout(advance, duration);
  if (container) {
    container.addEventListener('click', () => { clearTimeout(timer); advance(); }, { once: true });
  }
}

// ── TELA DE MÓDULOS ───────────────────────────────────────────────────
function renderModules() {
  const name = getStudent() || 'Estudante';
  const availMods = availableMods();

  const card = (def) => {
    const isAvail = def.mod === 0 ? ALL.length > 0 : availMods.includes(def.mod);
    const prog = modProgress(def.mod);

    if (!isAvail) {
      return `<div class="mod-card mod-card-disabled" aria-disabled="true" tabindex="-1">
        <div class="mod-card-top">
          <span class="mod-card-icon">${def.icon}</span>
          <div class="mod-card-info">
            <div class="mod-card-title">CCNA v7: ${esc(def.name)}</div>
            <span class="mod-card-badge mod-card-soon">Em breve</span>
          </div>
        </div>
        <p class="mod-card-desc">${esc(def.desc)}</p>
      </div>`;
    }

    const { seen, total, pct } = prog;
    return `<div class="mod-card" data-mod="${def.mod}" role="button" tabindex="0" aria-label="${esc('CCNA v7: ' + def.name)}">
      <div class="mod-card-top">
        <span class="mod-card-icon">${def.icon}</span>
        <div class="mod-card-info">
          <div class="mod-card-title">CCNA v7: ${esc(def.name)}</div>
          <span class="mod-card-badge mod-card-avail">✓ Disponível · ${total} questões</span>
        </div>
      </div>
      <p class="mod-card-desc">${esc(def.desc)}</p>
      <div class="mod-card-progress-wrap">
        <div class="mod-card-pbar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="mod-card-pfill" style="width:${pct}%"></div>
        </div>
        <span class="mod-card-ptext">${seen} de ${total} questões vistas · ${pct}%</span>
      </div>
    </div>`;
  };

  const byMod = m => MOD_DEFS.find(d => d.mod === m);
  const GRUPOS = [
    { titulo: 'Módulos do curso',   sub: 'Conteúdo de cada curso do CCNA v7.',   mods: [1, 2, 3] },
    { titulo: 'Revisão completa',   sub: 'Todo o banco de questões, sem filtro de curso.', mods: [0] },
    { titulo: 'Certificação',       sub: 'Exame prático 200-301.',                mods: [4] },
  ];

  const secoes = GRUPOS.map(g => `
    <div class="mod-section">
      <p class="sec-hdr" style="margin-bottom:2px">${g.titulo}</p>
      <p class="mod-section-sub">${g.sub}</p>
      <div class="mod-list">${g.mods.map(m => byMod(m)).filter(Boolean).map(card).join('')}</div>
    </div>`).join('');

  return `<div class="modules-wrap">
    <div class="modules-topbar">
      <h1 class="modules-h">Módulos</h1>
      <div class="modules-student">
        <span>👤 ${esc(name)}</span>
        <span class="modules-role">Estudante</span>
        <button class="btn" id="modChangeName" style="padding:3px 10px;font-size:11px" aria-label="Alterar nome">Alterar</button>
      </div>
    </div>
    <p class="modules-sub">Selecione o módulo do curso que está cursando.</p>
    ${secoes}
  </div>`;
}

function bindModules() {
  document.querySelectorAll('.mod-card[data-mod]').forEach(card => {
    const activate = () => {
      const m = parseInt(card.dataset.mod, 10) || 0;
      S.selectedMod = m;
      localStorage.setItem('sl_mod', String(m));
      buildPool();
      S.screen = 'start';
      render();
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
  document.getElementById('modChangeName')?.addEventListener('click', () => { S.screen = 'login'; render(); });
}

// ── LOGIN ────────────────────────────────────────────────────────────
function renderLogin() {
  return `<div class="login-wrap">
    <div class="login-logo">🌐</div>
    <h1 class="login-h">SubnetLab</h1>
    <p class="login-sub">Simulador CCNA v7 — Cisco Networking Academy<br>Digite seu nome para começar</p>
    <div class="login-form">
      <input class="login-input" id="nameInput" type="text"
        placeholder="Seu nome" autocomplete="name" maxlength="40"
        value="${esc(getStudent())}" aria-label="Seu nome">
      <button class="btn pri" id="loginBtn" style="font-size:15px;padding:14px">Continuar →</button>
    </div>
    <div style="margin-top:20px">
      <button class="icon-btn theme-btn" aria-label="Alternar tema">${darkMode ? '☀️' : '🌙'}</button>
    </div>
  </div>`;
}

function bindLogin() {
  const inp = document.getElementById('nameInput');
  const btn = document.getElementById('loginBtn');
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);
  function tryLogin() {
    const name = inp.value.trim();
    if (!name) { inp.focus(); inp.style.borderColor = 'var(--red)'; return; }
    saveStudent(name);
    S.screen = 'modules';
    render();
  }
  btn.addEventListener('click', tryLogin);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  if (!inp.value) inp.focus();
}

// ── TELA INICIAL ─────────────────────────────────────────────────────
// Contador ao vivo (portado do projeto antigo)
let cdTick = null;
function stopCountdownTick() { if (cdTick) { clearInterval(cdTick); cdTick = null; } }

function startCountdownTick() {
  stopCountdownTick();
  // Só arma se houver data e o contador estiver na tela (data futura)
  if (!getExamDate() || !document.getElementById('cd-d')) return;
  cdTick = setInterval(() => {
    const elD = document.getElementById('cd-d');
    if (!elD) { stopCountdownTick(); return; }
    const diff = new Date(getExamDate() + 'T08:00:00') - new Date();
    if (diff <= 0) { stopCountdownTick(); render(); return; }
    elD.textContent = Math.floor(diff / 864e5);
    document.getElementById('cd-h').textContent = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, '0');
  }, 1000);
}

function renderCountdown() {
  const dStr = getExamDate();
  if (!dStr) {
    return `<div class="countdown-box" style="justify-content:center;gap:12px">
      <span style="font-size:12px;color:var(--text3)">📅 Nenhuma data de prova configurada.</span>
      <button class="btn" id="cdSet" style="padding:4px 10px;font-size:11px;flex-shrink:0">Definir data</button>
    </div>`;
  }
  const examStr = new Date(dStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const diff = new Date(dStr + 'T08:00:00') - new Date();

  if (diff <= 0) {
    return `<div class="countdown-box" style="justify-content:space-between">
      <span style="font-size:12px;color:var(--text3)">📅 Data <strong>${examStr}</strong> já passou.</span>
      <button class="btn" id="cdEdit" style="padding:4px 10px;font-size:11px;flex-shrink:0">Nova data</button>
    </div>`;
  }

  const days = Math.floor(diff / 864e5);
  const hrs  = Math.floor((diff % 864e5) / 36e5);
  const mins = Math.floor((diff % 36e5) / 6e4);
  const secs = Math.floor((diff % 6e4) / 1e3);

  return `<div class="countdown-box">
    <div style="flex:1;min-width:0">
      <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">⏳ Faltam para o exame (${examStr})</div>
      <div style="display:flex;align-items:flex-end;gap:4px">
        <div class="cd-unit"><div class="cd-num" id="cd-d">${days}</div><div class="cd-lbl">dias</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><div class="cd-num" id="cd-h">${String(hrs).padStart(2, '0')}</div><div class="cd-lbl">horas</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><div class="cd-num" id="cd-m">${String(mins).padStart(2, '0')}</div><div class="cd-lbl">min</div></div>
        <div class="cd-sep">:</div>
        <div class="cd-unit"><div class="cd-num" id="cd-s">${String(secs).padStart(2, '0')}</div><div class="cd-lbl">seg</div></div>
      </div>
    </div>
    <button class="btn" id="cdEdit" style="padding:4px 10px;font-size:11px;flex-shrink:0" aria-label="Alterar data do exame">✏️ Alterar</button>
  </div>`;
}

function renderStart() {
  const hist    = getHistory();
  const saved   = loadProgress();
  const favCount = favorites.size;
  const topics  = [...new Set(Q.map(q => q.tp))].sort();

  // Evolução por tópico
  let evoHtml = '';
  if (hist.length > 0) {
    const cum = {};
    hist.slice(0, 10).forEach(h => {
      if (h.topicStats) Object.entries(h.topicStats).forEach(([tp, { c, t }]) => {
        if (!cum[tp]) cum[tp] = { c: 0, t: 0 };
        cum[tp].c += c; cum[tp].t += t;
      });
    });
    const tps = Object.keys(cum).filter(tp => cum[tp].t > 0)
      .sort((a, b) => (cum[a].c / cum[a].t) - (cum[b].c / cum[b].t));
    if (tps.length > 0) {
      const rows = tps.map(tp => {
        const p   = Math.round(cum[tp].c / cum[tp].t * 100);
        const col = p >= 80 ? '#1D9E75' : p >= 60 ? '#BA7517' : '#A32D2D';
        return `<div class="evo-row">
          <div class="evo-label" title="${esc(tp)}">${esc(tp)}</div>
          <div class="evo-bar-wrap"><div class="evo-bar-fill" style="width:${p}%;background:${col}"></div></div>
          <div class="evo-pct" style="color:${col}">${p}%</div>
        </div>`;
      }).join('');
      evoHtml = `<p class="sec-hdr">📈 Desempenho por Tópico</p>
        <div class="evo-wrap">${rows}</div>`;
    }
  }

  // Último resultado
  let lastResult = '';
  if (hist.length > 0) {
    const l  = hist[0];
    const gc = l.passed ? 'var(--green-text)' : 'var(--red-text)';
    lastResult = `<div class="last-result">
      <div style="font-size:22px;font-weight:700;color:${gc};min-width:46px">${l.pct}%</div>
      <div style="flex:1">
        <div style="font-size:10px;color:var(--text3)">${esc(l.date)} · ${esc(l.mode)}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:2px">✓ ${l.correct} &nbsp;✗ ${l.wrong} &nbsp;· ${esc(l.level)}</div>
      </div>
      <button class="btn" id="histBtn" style="padding:5px 12px;font-size:11px" aria-label="Ver histórico">Histórico →</button>
    </div>`;
  }

  // Banner de retomar
  const resumeBanner = saved ? `<div class="resume-banner">
    <span style="font-size:20px">⏸️</span>
    <div style="flex:1">
      <div style="font-size:12px;font-weight:600;color:var(--blue-text)">Sessão salva</div>
      <div style="font-size:11px;color:var(--text2)">Q ${saved.qi + 1}/${saved.order.length} · ✓ ${saved.correct} · ✗ ${saved.wrong}</div>
    </div>
    <button class="btn blue" id="resumeBtn" style="padding:5px 12px;font-size:11px" aria-label="Continuar sessão">Continuar →</button>
    <button class="btn" id="discardBtn" style="padding:5px 10px;font-size:11px" aria-label="Descartar sessão">✕</button>
  </div>` : '';

  // Chips de tópico (para modo Por Tópico)
  const topicChips = S.startMode === 'topic' ? `
    <p class="sec-hdr" style="margin-top:0">Escolha o tópico:</p>
    <div class="topic-sel">
      ${topics.map(t => `<div class="topic-chip${S.selectedTopic === t ? ' sel-chip' : ''}" data-tp="${esc(t)}" role="button" tabindex="0">
        <span class="topic-dot" style="background:${topicColor(t)}"></span>${esc(t)}
      </div>`).join('')}
    </div>
  ` : '';

  // Contador espaçada
  const spacedDue = getSpacedPool().length;
  const spacedSub = spacedDue > 0 ? `${spacedDue} para revisar hoje` : 'Tudo em dia ✓';

  // Cards de modo
  const modeCards = Object.entries(MODE_INFO).map(([mode, info]) => {
    const sub = mode === 'spaced' ? spacedSub : info.sub;
    return `
    <div class="mode-card${S.startMode === mode ? ' sel-mode' : ''}" data-mode="${mode}" role="button" tabindex="0" aria-pressed="${S.startMode === mode}">
      <div class="mode-icon">${info.label.split(' ')[0]}</div>
      <div class="mode-title">${info.label.replace(/^[^\s]+ /, '')}</div>
      <div class="mode-sub">${sub}</div>
    </div>
    `;
  }).join('');

  // Módulos disponíveis
  const modLabels = { 1: 'ITN', 2: 'SRWE', 3: 'ENSA', 4: 'Preparação para Certificação' };
  const modInfo   = {
    1: 'Introdução às Redes',
    2: 'Switching, Routing e Wireless',
    3: 'Redes Empresariais',
    4: 'Preparação para Certificação',
  };
  let titleSub;
  titleSub = S.selectedMod
    ? `Módulo ${S.selectedMod} — ${modLabels[S.selectedMod] || ''} · ${Q.length} questões`
    : `Revisão Completa · ${Q.length} questões`;

  // Módulo 4 não tem seletor de escopo: aqui só entram as questões do exame 200-301.
  // ENSA e SRWE já são módulos próprios na tela anterior.

  return `<div class="start-wrap">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px">
      <button class="btn" id="modulesBtn" style="padding:3px 10px;font-size:11px" title="Voltar para a seleção de módulos" aria-label="Voltar para a seleção de módulos">← Módulos</button>
      <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
        <button class="btn" id="searchBtn" style="padding:5px 11px;font-size:12px" title="Buscar questões" aria-label="Buscar questões">🔍</button>
        <button class="btn" id="glossBtn"  style="padding:5px 11px;font-size:12px" title="Glossário de siglas" aria-label="Glossário de siglas">📖</button>
        <button class="btn" id="readyBtn"  style="padding:5px 11px;font-size:12px" title="Relatório de prontidão" aria-label="Relatório de prontidão">🎯</button>
        <button class="icon-btn theme-btn" title="Alternar tema claro/escuro" aria-label="Alternar tema claro/escuro">${darkMode ? '☀️' : '🌙'}</button>
      </div>
    </div>
    <div class="start-topbar">
      <div>
        <div class="module-label">CCNA v7 — Cisco Networking Academy</div>
        <h1 class="start-h">SubnetLab<br>
          <span style="font-size:14px;font-weight:400;color:var(--text2)">
            ${titleSub}
          </span>
        </h1>
      </div>
    </div>
    ${renderCountdown()}
    ${resumeBanner}
    ${lastResult}

    <p class="sec-hdr">Modo de Estudo</p>
    <div class="mode-grid">${modeCards}</div>
    ${topicChips}

    ${evoHtml}

    ${S.startMode === 'topic' ? '' : `
    <p class="sec-hdr" style="margin-top:4px">Tópicos — ${S.selectedMod ? 'Módulo ' + S.selectedMod : 'Revisão Completa'}</p>
    <div class="tgrid">
      ${topics.map(t => `<div class="tpill">
        <span class="tdot" style="background:${topicColor(t)}"></span>
        <span style="font-size:11px">${esc(t)}</span>
      </div>`).join('')}
    </div>`}

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <button class="btn" id="histBtnBottom" style="flex:1;min-width:100px" aria-label="Ver histórico">📋 Histórico</button>
      <button class="btn" id="statsBtn" style="flex:1;min-width:100px" aria-label="Estatísticas por questão">📊 Stats</button>
      <button class="btn" id="exportBtn" aria-label="Exportar progresso">⬇️ Exportar</button>
      <label class="btn" style="cursor:pointer" aria-label="Importar progresso">
        ⬆️ Importar<input type="file" accept=".json" id="importFile" style="display:none">
      </label>
    </div>

    <button class="btn pri" id="startBtn" style="width:100%;font-size:16px;padding:15px;border-radius:var(--radius)">
      ▶ Iniciar${S.startMode === 'timed' ? ' Prova' : S.startMode === 'topic' && S.selectedTopic ? ' — ' + S.selectedTopic : ''}
    </button>
  </div>`;
}

function bindStart() {
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);

  document.getElementById('modulesBtn')?.addEventListener('click', () => { S.screen = 'modules'; render(); });

  document.getElementById('startBtn')?.addEventListener('click', startQuiz);

  document.getElementById('resumeBtn')?.addEventListener('click', resumeQuiz);
  document.getElementById('discardBtn')?.addEventListener('click', () => { clearProgress(); render(); });

  document.getElementById('histBtn')?.addEventListener('click', () => { S.screen = 'history'; render(); });
  document.getElementById('histBtnBottom')?.addEventListener('click', () => { S.screen = 'history'; render(); });

  document.getElementById('searchBtn')?.addEventListener('click', () => { S.screen = 'search'; render(); });
  document.getElementById('glossBtn')?.addEventListener('click', showGlossary);
  document.getElementById('readyBtn')?.addEventListener('click', showReadiness);
  document.getElementById('statsBtn')?.addEventListener('click', showQStats);
  document.getElementById('exportBtn')?.addEventListener('click', exportData);

  document.getElementById('importFile')?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) importData(f);
  });

  document.getElementById('cdSet')?.addEventListener('click', promptExamDate);
  document.getElementById('cdEdit')?.addEventListener('click', promptExamDate);
  startCountdownTick();

  // Cards de modo
  document.querySelectorAll('.mode-card').forEach(card => {
    const activate = () => {
      S.startMode = card.dataset.mode;
      if (S.startMode !== 'topic') S.selectedTopic = null;
      render();
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  });

  // Chips de tópico
  document.querySelectorAll('.topic-chip[data-tp]').forEach(chip => {
    const select = () => {
      S.selectedTopic = S.selectedTopic === chip.dataset.tp ? null : chip.dataset.tp;
      render();
    };
    chip.addEventListener('click', select);
    chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });

}

// ── QUIZ ─────────────────────────────────────────────────────────────
function renderHUD() {
  const lv     = getLvl(S.xp);
  const range  = Math.max(1, lv.max - lv.min);
  const lvPct  = Math.min(100, Math.round((S.xp - lv.min) / range * 100));
  const isTimed = S.timerMode === 'timed';
  const livesHtml = isTimed && S.lives !== Infinity
    ? `<div class="hc">
        <span class="hc-l">Vidas</span>
        <span class="hc-v" style="color:${S.lives <= 1 ? 'var(--red-text)' : 'var(--green-text)'}">❤️ ${S.lives}</span>
      </div>`
    : '';
  const timerHtml = isTimed
    ? `<span id="hud-timer" class="${S.timerLeft <= 300 ? 'timer-danger' : S.timerLeft <= 900 ? 'timer-warn' : 'timer-ok'}">⏱ ${formatTime(S.timerLeft)}</span>`
    : '';

  return `<div class="hud" role="status" aria-label="HUD do quiz">
    <div class="hc" title="Nível">
      <span class="hc-l">Nível</span>
      <span class="hc-v">${esc(lv.n)}</span>
      <div class="lv-bar" role="progressbar" aria-valuenow="${lvPct}" aria-valuemin="0" aria-valuemax="100">
        <div class="lv-fill" style="width:${lvPct}%"></div>
      </div>
    </div>
    <div class="hc"><span class="hc-l">XP</span><span class="hc-v xp-b">⚡ ${S.xp}</span></div>
    <div class="hc"><span class="hc-l">Streak</span><span class="hc-v str-b">🔥 ${S.streak}</span></div>
    ${livesHtml}
    ${timerHtml}
    <div style="flex:1"></div>
    <div class="hc"><span class="hc-l">${S.qi + 1}/${S.order.length}</span></div>
  </div>
  <div class="pbar" role="progressbar" aria-valuenow="${S.qi}" aria-valuemax="${S.order.length}">
    <div class="pfill" style="width:${(S.qi / S.order.length) * 100}%"></div>
  </div>`;
}

function renderQuizQuestion() {
  const q  = Q[S.order[S.qi]];
  const isFav = favorites.has(q.id);

  // Embaralhar opções uma vez por questão
  if (!S.optOrder && q.ty !== 'match') {
    if (q.ty === 'single')
      S.optOrder = shuffle([...Array(q.opts.length).keys()]);
    else if (q.ty === 'multi')
      S.optOrder = shuffle([...Array(q.opts.length).keys()]);
  }
  if (q.ty === 'match' && S.shuffledMatchOpts.length === 0) {
    S.shuffledMatchOpts = shuffle(q.pairs.map(p => p.r));
  }

  const tagColor = topicColor(q.tp);
  const qTextHtml = wrapAcronyms(esc(q.text));

  let figHtml = '';
  if (q.code) {
    figHtml = `<pre class="qcode" aria-label="Tela de comandos da questão">${esc(q.code)}</pre>`;
  } else if (q.fig) {
    figHtml = `<div class="qfig" id="qfig" role="button" tabindex="0" aria-label="Ver imagem em tamanho real">
      <img src="${esc(q.fig)}" alt="${esc(q.figAlt || 'Diagrama da questão')}" decoding="async" style="max-width:100%">
      <div class="qfig-caption">${esc(q.figAlt || 'Diagrama da questão')} · toque para ampliar</div>
    </div>`;
  }

  let optsHtml = '';
  if (q.ty === 'single') {
    optsHtml = renderSingleOpts(q);
  } else if (q.ty === 'multi') {
    const corCount = q.cor.length;
    optsHtml = `<p class="multi-note" role="note">Escolha ${corCount === 2 ? 'duas' : corCount === 3 ? 'três' : corCount} opções</p>
      ${renderMultiOpts(q)}
      ${!S.answered ? `<button class="btn pri" id="multiConfirm" style="width:100%;margin-top:6px" ${S.multiSel.length === 0 ? 'disabled' : ''}>Confirmar</button>` : ''}`;
  } else if (q.ty === 'match') {
    optsHtml = renderMatchOpts(q);
  }

  let feedbackHtml = '';
  if (S.answered && S.timerMode === 'free') {
    feedbackHtml = renderFeedback(q);
  }

  const nextLabel = S.qi >= S.order.length - 1 ? 'Ver Resultado →' : 'Próxima →';

  return `<div class="qcard">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span class="qtag" style="background:${tagColor}22;color:${tagColor};border:.5px solid ${tagColor}44">${esc(q.tp)}</span>
      <span class="qnum">#${q.id}</span>
      <span style="flex:1"></span>
      <button class="fav-btn${isFav ? ' fav-on' : ''}" id="favBtn" data-id="${q.id}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${isFav ? '⭐' : '☆'}</button>
    </div>
    <p class="qtext">${qTextHtml}</p>
    ${figHtml}
  </div>

  <div class="opts" id="opts-wrap" role="${q.ty === 'single' ? 'radiogroup' : 'group'}" aria-label="Opções de resposta">
    ${optsHtml}
  </div>

  ${feedbackHtml}

  ${S.answered ? `<button class="btn pri" id="nextBtn" style="width:100%;margin-bottom:12px" aria-label="${nextLabel}">${nextLabel}</button>` : ''}`;
}

function renderSingleOpts(q) {
  const letters = 'ABCDEFGHIJKLMNOP';
  return S.optOrder.map((realIdx, dispIdx) => {
    const optText = wrapAcronyms(esc(q.opts[realIdx]));
    let cls = 'opt';
    if (S.answered) {
      if (realIdx === q.cor)       cls += ' correct';
      else if (realIdx === S.selected) cls += ' wrong';
      else                         cls += ' dim';
    }
    return `<button class="${cls}" data-di="${dispIdx}" ${S.answered ? 'disabled aria-disabled="true"' : ''} role="radio" aria-checked="${S.selected === realIdx}">
      <span class="olet">${letters[dispIdx]}</span>
      <span>${optText}</span>
    </button>`;
  }).join('');
}

function renderMultiOpts(q) {
  const letters = 'ABCDEFGHIJKLMNOP';
  return S.optOrder.map((realIdx, dispIdx) => {
    const optText = wrapAcronyms(esc(q.opts[realIdx]));
    const isSel   = S.multiSel.includes(realIdx);
    let cls = 'opt';
    if (S.answered) {
      const isCorrect = q.cor.includes(realIdx);
      const wasSelected = S.multiSel.includes(realIdx);
      if (isCorrect)                         cls += ' correct';
      else if (wasSelected && !isCorrect)    cls += ' wrong';
      else if (!isCorrect && !wasSelected)   cls += ' dim';
    } else if (isSel) {
      cls += ' sel';
    }
    return `<button class="${cls}" data-di="${dispIdx}" ${S.answered ? 'disabled aria-disabled="true"' : ''} role="checkbox" aria-checked="${isSel}">
      <span class="olet">${letters[dispIdx]}</span>
      <span>${optText}</span>
    </button>`;
  }).join('');
}

function renderMatchOpts(q) {
  const rows = q.pairs.map((p, pi) => {
    const selVal = S.matchSel[pi];
    if (S.answered) {
      const selectedRight = selVal !== undefined ? S.shuffledMatchOpts[selVal] : null;
      const isOk = selectedRight === p.r;
      return `<div class="match-row ${isOk ? 'correct' : 'wrong'}">
        <div class="match-left">${wrapAcronyms(esc(p.l))}</div>
        <div>
          ${selectedRight ? `<div class="match-wrong-sel">${esc(selectedRight)}</div>` : ''}
          ${!isOk ? `<div class="match-correct-ans">✓ ${esc(p.r)}</div>` : `<div style="font-size:12px;color:var(--green-text)">✓ ${esc(p.r)}</div>`}
        </div>
      </div>`;
    }
    return `<div class="match-row">
      <div class="match-left">${wrapAcronyms(esc(p.l))}</div>
      <select class="match-select" data-pi="${pi}" aria-label="Correspondência para: ${esc(p.l)}">
        <option value="">— selecione —</option>
        ${S.shuffledMatchOpts.map((r, oi) => `<option value="${oi}" ${selVal === oi ? 'selected' : ''}>${esc(r)}</option>`).join('')}
      </select>
    </div>`;
  }).join('');

  const allSel = Object.keys(S.matchSel).length >= q.pairs.length;
  return `<div class="match-wrap">
    <p class="match-hint">Associe cada item à esquerda com o correspondente à direita</p>
    ${rows}
    ${!S.answered ? `<button class="btn pri" id="matchConfirm" style="width:100%;margin-top:8px" ${allSel ? '' : 'disabled'}>Confirmar</button>` : ''}
  </div>`;
}

function renderFeedback(q) {
  // Só chamada quando S.answered===true e timerMode==='free'
  if (!S.answered) return '';

  // Determinar resultado desta questão
  let ok = false;
  if (q.ty === 'single') {
    ok = S.selected === q.cor;
  } else if (q.ty === 'multi') {
    const corSet = new Set(q.cor);
    const selSet = new Set(S.multiSel);
    ok = [...corSet].every(c => selSet.has(c)) && selSet.size === corSet.size;
  } else if (q.ty === 'match') {
    ok = q.pairs.every((p, pi) => S.shuffledMatchOpts[S.matchSel[pi]] === p.r);
  }

  const cls    = ok ? 'ok'  : 'ng';
  const title  = ok ? '✓ Correto!' : '✗ Incorreto';
  const whyHtml = q.why ? `<div class="fb-why">
    <div class="fb-why-lbl">Explicação</div>
    ${wrapAcronyms(esc(q.why))}
  </div>` : '';

  // Resposta correta para single/multi
  let corAnsHtml = '';
  if (!ok && q.ty === 'single') {
    corAnsHtml = `<div style="margin-top:5px;font-size:12px"><strong>Resposta correta:</strong> ${wrapAcronyms(esc(q.opts[q.cor]))}</div>`;
  } else if (!ok && q.ty === 'multi') {
    corAnsHtml = `<div style="margin-top:5px;font-size:12px"><strong>Respostas corretas:</strong> ${q.cor.map(i => wrapAcronyms(esc(q.opts[i]))).join(' · ')}</div>`;
  }

  return `<div class="fb ${cls}" role="alert">
    <div class="fb-title">${title}</div>
    ${corAnsHtml}
    ${whyHtml}
  </div>`;
}

function renderQuiz() {
  return `${renderHUD()}
  <div id="quiz-content">
    ${renderQuizQuestion()}
  </div>
  <div style="display:flex;justify-content:flex-end;margin-top:4px">
    <button class="btn" id="quitBtn" style="padding:5px 12px;font-size:11px" aria-label="Encerrar quiz">Encerrar ✕</button>
  </div>`;
}

function bindQuiz() {
  document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
  document.getElementById('multiConfirm')?.addEventListener('click', handleMultiConfirm);
  document.getElementById('matchConfirm')?.addEventListener('click', handleMatchConfirm);

  document.getElementById('quitBtn')?.addEventListener('click', () => {
    showConfirm('Encerrar sessão?', 'Seu progresso atual será salvo.', () => {
      stopTimer();
      persistSpaced();
      if (S.correct + S.wrong > 0) saveHistory(buildHistoryEntry());
      clearProgress();
      S.screen = 'start';
      render();
    });
  });

  document.getElementById('favBtn')?.addEventListener('click', e => {
    const id = parseInt(e.currentTarget.dataset.id);
    toggleFav(id);
    const btn = e.currentTarget;
    const on  = favorites.has(id);
    btn.classList.toggle('fav-on', on);
    btn.textContent = on ? '⭐' : '☆';
    btn.setAttribute('aria-label', on ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
  });

  document.getElementById('qfig')?.addEventListener('click', () => {
    const q = Q[S.order[S.qi]];
    if (q.fig) showLightbox(q.fig, q.figAlt);
  });
  document.getElementById('qfig')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = Q[S.order[S.qi]];
      if (q.fig) showLightbox(q.fig, q.figAlt);
    }
  });

  // Cliques em opções single
  if (!S.answered) {
    document.querySelectorAll('.opt[data-di]').forEach(btn => {
      const q = Q[S.order[S.qi]];
      if (q.ty === 'single') {
        btn.addEventListener('click', () => handleSingle(parseInt(btn.dataset.di)));
      } else if (q.ty === 'multi') {
        btn.addEventListener('click', () => handleMultiToggle(parseInt(btn.dataset.di)));
      }
    });

    document.querySelectorAll('.match-select').forEach(sel => {
      sel.addEventListener('change', e => handleMatchSel(parseInt(sel.dataset.pi), e.target.value));
    });
  }

  // Tooltips de siglas (mobile: tap para abrir cmodal)
  document.querySelectorAll('.acr').forEach(span => {
    span.addEventListener('click', e => {
      e.stopPropagation();
      const def = span.dataset.def;
      if (def) showAlert(`${span.textContent}\n\n${def}`);
    });
  });
}

// ── RESULTADO ─────────────────────────────────────────────────────────
function renderResult() {
  const tot    = S.correct + S.wrong;
  const pct    = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const lv     = getLvl(S.xp);
  // Aprovação é pela NOTA (>=70%), não por ainda ter vidas restantes
  const passed = pct >= 70;

  const scoreColor = pct === 100 ? '#F5C842' : pct >= 90 ? '#5EE0A8' : pct >= 70 ? '#7AB8F5' : '#F08080';
  const certBorder = scoreColor + '88';

  const isCert = S.timerMode === 'timed' && pct >= 70;
  const certData = pct === 100 ? { rank: 'Mestre CCNA',    icon: '🏆', sub: 'Desempenho Perfeito!' }
    : pct >= 90              ? { rank: 'Expert em Redes',  icon: '🌟', sub: 'Resultado excepcional!' }
    : pct >= 80              ? { rank: 'CCNA Aprovado',    icon: '✅', sub: 'Pronto para o exame real!' }
    :                          { rank: 'Técnico de Redes', icon: '📡', sub: 'Aprovado no limite!' };

  const _modLabels = { 1: 'Módulo 1 — ITN', 2: 'Módulo 2 — SRWE', 3: 'Módulo 3 — ENSA', 4: 'Módulo 4 — Preparação para Certificação', 0: 'Revisão Completa' };
  const modLabel = _modLabels[S.selectedMod] || 'SubnetLab';
  const datePT   = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const badgeHtml = S.badges.map(b =>
    `<span class="badge" style="background:${b.bg};color:${b.c};border-color:${b.bc}">${esc(b.t)}</span>`
  ).join('');

  // Tópicos
  const tpEntries = Object.entries(S.topicStats)
    .map(([tp, { c, t }]) => ({ tp, pct: Math.round(c / t * 100), t }))
    .sort((a, b) => a.pct - b.pct);

  const topicHtml = tpEntries.map(({ tp, pct: p }) => {
    const col = p >= 80 ? '#1D9E75' : p >= 60 ? '#BA7517' : '#A32D2D';
    return `<div class="topic-row">
      <div class="topic-name" title="${esc(tp)}">${esc(tp)}</div>
      <div class="topic-bar-wrap"><div class="topic-bar-fill" style="width:${p}%;background:${col}"></div></div>
      <div class="topic-pct" style="color:${col}">${p}%</div>
    </div>`;
  }).join('');

  const name = getStudent() || 'Aluno';

  const certInner = isCert ? `
      <div class="cert-top-label">${esc(modLabel)}</div>
      <div class="cert-icon" style="color:${scoreColor}">${certData.icon}</div>
      <div class="cert-title-sm">Certificado de Aprovação</div>
      <div class="cert-student">${esc(name)}</div>
      <div class="cert-rank" style="color:${scoreColor}">${esc(certData.rank)}</div>
      <div class="cert-sub">${esc(certData.sub)} · ${esc(datePT)}</div>
      <div class="cert-divider" style="border-color:${scoreColor}"></div>
      <div class="cert-score-row">
        <div class="cert-stat">
          <div class="cert-stat-v" style="color:${scoreColor}">${pct}%</div>
          <div class="cert-stat-l">Aproveitamento</div>
        </div>
        <div class="cert-seal" style="border-color:${scoreColor};box-shadow:0 0 18px ${scoreColor}44">
          <div style="font-size:22px;line-height:1">${certData.icon}</div>
          <div style="font-size:8px;font-weight:700;color:${scoreColor};letter-spacing:.04em;margin-top:3px">APROVADO</div>
        </div>
        <div class="cert-stat">
          <div class="cert-stat-v" style="color:var(--green-text)">${S.correct}</div>
          <div class="cert-stat-l">Acertos</div>
        </div>
      </div>
      <div class="cert-stats-mini">
        <span>✗ ${S.wrong} erros</span>
        <span>🔥 Streak ${S.maxStreak}</span>
        <span>⚡ ${S.xp} XP</span>
        <span>· ⏱ ${formatTime((S.order.length * 60) - S.timerLeft)} gasto</span>
      </div>
  ` : `
      <div class="cert-top-label">SubnetLab · CCNA v7 SRWE</div>
      <div class="cert-icon">${pct === 100 ? '🏆' : pct >= 90 ? '🌟' : pct >= 70 ? '🎓' : '📚'}</div>
      <div class="cert-title-sm">Resultado do Simulado</div>
      <div class="cert-rank" style="color:${scoreColor}">${pct}%</div>
      <div class="cert-student">${esc(name)}</div>
      <div class="cert-sub">${passed ? '✓ Aprovado' : 'Continue praticando!'} · ${esc(lv.n)}</div>
      <div class="cert-divider" style="border-color:${scoreColor}"></div>
      <div class="cert-score-row">
        <div class="cert-stat">
          <div class="cert-stat-v" style="color:var(--green-text)">${S.correct}</div>
          <div class="cert-stat-l">Acertos</div>
        </div>
        <div class="cert-seal" style="border-color:${scoreColor}">
          <div style="font-size:10px;font-weight:700;color:${scoreColor}">XP</div>
          <div style="font-size:22px;font-weight:800;color:${scoreColor}">${S.xp}</div>
        </div>
        <div class="cert-stat">
          <div class="cert-stat-v" style="color:var(--red-text)">${S.wrong}</div>
          <div class="cert-stat-l">Erros</div>
        </div>
      </div>
      <div class="cert-stats-mini">
        <span>🔥 Streak: ${S.maxStreak}</span>
        <span>· ${S.order.length} questões</span>
        ${S.timerMode === 'timed' ? `<span>· ⏱ ${formatTime((S.order.length * 60) - S.timerLeft)} gasto</span>` : ''}
      </div>
  `;

  return `<div class="res-wrap">
    <div class="cert-wrap" id="certCard" style="border-color:${certBorder}">
      <div class="cert-corner tl" style="border-color:${scoreColor}"></div>
      <div class="cert-corner tr" style="border-color:${scoreColor}"></div>
      <div class="cert-corner bl" style="border-color:${scoreColor}"></div>
      <div class="cert-corner br" style="border-color:${scoreColor}"></div>
      ${certInner}
    </div>
    ${isCert ? `<div style="text-align:center;margin:-8px 0 16px"><button class="btn" id="dlCertBtn" style="font-size:12px;padding:8px 18px">📥 Baixar certificado</button></div>` : ''}

    ${badgeHtml ? `<div class="badge-row" role="list" aria-label="Conquistas">${badgeHtml}</div>` : ''}

    ${tpEntries.length ? `<div class="topic-stats-wrap">
      <p class="sec-hdr">Por Tópico</p>
      ${topicHtml}
    </div>` : ''}

    <div class="btn-row">
      ${(S.wrongLog.length || S.timerMode === 'timed') ? `<button class="btn" id="reviewBtn" aria-label="${S.timerMode === 'timed' ? 'Revisar todas as questões' : 'Revisar questões erradas'}">🔍 ${S.timerMode === 'timed' ? `Revisar (${S.order.length})` : `Revisar Erros (${S.wrongLog.length})`}</button>` : ''}
      <button class="btn" id="shareBtn" aria-label="Compartilhar resultado">🔗 Compartilhar</button>
      <button class="btn pri" id="newGameBtn" aria-label="Nova sessão">↺ Nova Sessão</button>
    </div>
    <div style="margin-top:10px">
      <button class="btn" id="backFromResult" style="width:100%" aria-label="Voltar ao início">← Início</button>
    </div>
  </div>`;
}

function bindResult() {
  document.getElementById('reviewBtn')?.addEventListener('click', () => {
    S.reviewIdx = 0;
    S.screen    = 'review';
    render();
  });
  document.getElementById('newGameBtn')?.addEventListener('click', () => {
    S.screen = 'start';
    render();
    window.scrollTo(0, 0);
  });
  document.getElementById('backFromResult')?.addEventListener('click', () => { S.screen = 'start'; render(); });
  document.getElementById('shareBtn')?.addEventListener('click', shareResult);
  document.getElementById('dlCertBtn')?.addEventListener('click', downloadCertCanvas);
}

function downloadCertCanvas() {
  const tot = S.correct + S.wrong;
  const pct = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const certData = pct === 100 ? { rank: 'Mestre CCNA',    icon: '🏆', color: '#F5C842' }
    : pct >= 90              ? { rank: 'Expert em Redes',  icon: '🌟', color: '#5EE0A8' }
    : pct >= 80              ? { rank: 'CCNA Aprovado',    icon: '✅', color: '#7AB8F5' }
    :                          { rank: 'Técnico de Redes', icon: '📡', color: '#A89DF5' };

  const name     = getStudent() || 'Aluno';
  const _mL      = { 1: 'Módulo 1 — ITN', 2: 'Módulo 2 — SRWE', 3: 'Módulo 3 — ENSA', 4: 'Módulo 4 — Preparação para Certificação', 0: 'Revisão Completa' };
  const modLabel = _mL[S.selectedMod] || 'SubnetLab';
  const datePT   = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const W = 800, H = 500;
  const cv  = document.createElement('canvas');
  cv.width  = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // Fundo
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#12172B');
  bg.addColorStop(0.5, '#1A1D2F');
  bg.addColorStop(1,   '#12172B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Borda
  ctx.strokeStyle = certData.color + '88';
  ctx.lineWidth   = 3;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  // Cantos decorativos
  const cs = 18;
  ctx.strokeStyle = certData.color + '66';
  ctx.lineWidth   = 2;
  [[20, 20, 1, 1], [W-20, 20, -1, 1], [20, H-20, 1, -1], [W-20, H-20, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * cs, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * cs);
    ctx.stroke();
  });

  ctx.textAlign = 'center';

  // Rótulo superior
  ctx.fillStyle = '#6B7399';
  ctx.font      = '12px system-ui, sans-serif';
  ctx.fillText('SubnetLab · CCNA v7 · Simulador de Certificação', W / 2, 52);

  // Ícone
  ctx.font = '52px system-ui, sans-serif';
  ctx.fillText(certData.icon, W / 2, 120);

  // Título
  ctx.fillStyle = '#9BA3C4';
  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillText('CERTIFICADO DE APROVAÇÃO', W / 2, 155);

  // Nome
  ctx.fillStyle = '#E8EAF6';
  ctx.font      = 'bold 26px system-ui, sans-serif';
  ctx.fillText(name, W / 2, 198);

  // Rank
  ctx.fillStyle = certData.color;
  ctx.font      = 'bold 30px system-ui, sans-serif';
  ctx.fillText(certData.rank, W / 2, 240);

  // Módulo
  ctx.fillStyle = '#9BA3C4';
  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillText(modLabel, W / 2, 268);

  // Divisor
  ctx.strokeStyle = certData.color + '44';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 200, 285);
  ctx.lineTo(W / 2 + 200, 285);
  ctx.stroke();

  // Stats
  ctx.fillStyle = certData.color;
  ctx.font      = 'bold 34px system-ui, sans-serif';
  [[pct + '%', W / 2 - 150], [String(S.correct), W / 2], [String(S.wrong), W / 2 + 150]].forEach(([v, x]) => {
    ctx.fillText(v, x, 335);
  });
  ctx.fillStyle = '#6B7399';
  ctx.font      = '11px system-ui, sans-serif';
  [['APROVEITAMENTO', W / 2 - 150], ['ACERTOS', W / 2], ['ERROS', W / 2 + 150]].forEach(([l, x]) => {
    ctx.fillText(l, x, 353);
  });

  // Data
  ctx.fillStyle = '#6B7399';
  ctx.font      = '12px system-ui, sans-serif';
  ctx.fillText(datePT, W / 2, 410);

  // Marca d'água
  ctx.fillStyle = '#3A3F5C';
  ctx.font      = '11px system-ui, sans-serif';
  ctx.fillText('SubnetLab', W / 2, 450);

  try {
    const a    = document.createElement('a');
    a.download = `certificado_${name.replace(/\s+/g, '_')}_${hojeISO()}.png`;
    a.href     = cv.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    showAlert('Não foi possível gerar o PNG. Tente capturar a tela manualmente.');
  }
}

// ── REVISÃO ───────────────────────────────────────────────────────────
function renderReview() {
  const list = S.timerMode === 'timed'
    ? S.order.map(i => Q[i])  // revisão total para modo prova
    : S.wrongLog.map(w => w.q).filter(Boolean); // só erros para modo livre

  if (!list.length) {
    return `<div>
      <p class="sec-hdr">Revisão</p>
      <p style="color:var(--text2);font-size:13px">Nenhuma questão para revisar.</p>
      <button class="btn" id="backFromReview" style="margin-top:14px">← Resultado</button>
    </div>`;
  }

  const idx = Math.min(S.reviewIdx, list.length - 1);
  const q   = list[idx];

  const tagColor = topicColor(q.tp);
  const letters  = 'ABCDEFGHIJKLMNOP';

  let optsHtml = '';
  if (q.ty === 'single') {
    optsHtml = q.opts.map((opt, i) => {
      const cls = i === q.cor ? 'opt correct' : 'opt dim';
      return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
    }).join('');
  } else if (q.ty === 'multi') {
    optsHtml = q.opts.map((opt, i) => {
      const cls = q.cor.includes(i) ? 'opt correct' : 'opt dim';
      return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
    }).join('');
  } else if (q.ty === 'match') {
    optsHtml = q.pairs.map(p =>
      `<div class="match-row correct">
        <div class="match-left">${wrapAcronyms(esc(p.l))}</div>
        <div style="font-size:12px;color:var(--green-text)">✓ ${esc(p.r)}</div>
      </div>`
    ).join('');
  }

  const whyHtml = q.why ? `<div class="fb-why" style="margin-top:10px">
    <div class="fb-why-lbl">Explicação</div>
    ${wrapAcronyms(esc(q.why))}
  </div>` : '';

  let figHtml = '';
  if (q.code) {
    figHtml = `<pre class="qcode" aria-label="Tela de comandos da questão">${esc(q.code)}</pre>`;
  } else if (q.fig) {
    figHtml = `<div class="qfig" id="rev-qfig" role="button" tabindex="0" aria-label="Ampliar imagem">
      <img src="${esc(q.fig)}" alt="${esc(q.figAlt || '')}" decoding="async" style="max-width:100%">
    </div>`;
  }

  return `<div>
    <div class="review-nav">
      <button class="btn" id="revPrev" ${idx <= 0 ? 'disabled' : ''} aria-label="Questão anterior">← Anterior</button>
      <span class="review-ctr">${idx + 1} / ${list.length}</span>
      <button class="btn" id="revNext" ${idx >= list.length - 1 ? 'disabled' : ''} aria-label="Próxima questão">Próxima →</button>
    </div>

    <div class="qcard">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span class="qtag" style="background:${tagColor}22;color:${tagColor};border:.5px solid ${tagColor}44">${esc(q.tp)}</span>
        <span class="qnum">#${q.id}</span>
      </div>
      <p class="qtext">${wrapAcronyms(esc(q.text))}</p>
      ${figHtml}
    </div>

    <div class="opts">${optsHtml}</div>
    ${whyHtml}

    <div class="btn-row" style="margin-top:14px">
      <button class="btn" id="backFromReview" aria-label="Voltar ao resultado">← Resultado</button>
    </div>
  </div>`;
}

function bindReview() {
  const list = S.timerMode === 'timed'
    ? S.order.map(i => Q[i])
    : S.wrongLog.map(w => w.q).filter(Boolean);

  document.getElementById('revPrev')?.addEventListener('click', () => {
    if (S.reviewIdx > 0) { S.reviewIdx--; render(); }
  });
  document.getElementById('revNext')?.addEventListener('click', () => {
    if (S.reviewIdx < list.length - 1) { S.reviewIdx++; render(); }
  });
  document.getElementById('backFromReview')?.addEventListener('click', () => { S.screen = 'result'; render(); });
  document.getElementById('rev-qfig')?.addEventListener('click', () => {
    const q = list[S.reviewIdx];
    if (q?.fig) showLightbox(q.fig, q.figAlt);
  });

  document.querySelectorAll('.acr').forEach(span => {
    span.addEventListener('click', e => {
      e.stopPropagation();
      showAlert(`${span.textContent}\n\n${span.dataset.def}`);
    });
  });
}

// ── HISTÓRICO ─────────────────────────────────────────────────────────
function renderHistory() {
  const hist = getHistory();
  const rows = hist.length
    ? hist.map((h, i) => {
        const gc  = h.passed ? 'var(--green-text)' : 'var(--red-text)';
        const bgc = h.passed ? 'var(--green-bg)'   : 'var(--red-bg)';
        const bc  = h.passed ? 'var(--green)'      : 'var(--red)';
        return `<div class="hist-item">
          <div class="hist-pct" style="color:${gc}">${h.pct}%</div>
          <div class="hist-info">
            <div class="hist-date">${esc(h.date)} · ${esc(h.mode || '📚')}</div>
            <div class="hist-detail">✓ ${h.correct} &nbsp;✗ ${h.wrong} &nbsp;· ${esc(h.level || '—')}</div>
          </div>
          <span class="hist-tag" style="background:${bgc};color:${gc};border-color:${bc}">
            ${h.passed ? 'Aprovado' : 'Reprovado'}
          </span>
        </div>`;
      }).join('')
    : `<p style="color:var(--text2);font-size:13px;padding:20px 0">Nenhuma sessão concluída ainda.</p>`;

  return `<div class="hist-wrap">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <h2 style="font-size:16px;font-weight:700">📋 Histórico</h2>
      <button class="btn" id="backFromHist" aria-label="Voltar">← Voltar</button>
    </div>
    <div class="hist-list">${rows}</div>
    ${hist.length ? `<button class="btn" id="clearHistBtn" style="width:100%;color:var(--red-text);border-color:var(--red)" aria-label="Limpar histórico">Limpar histórico</button>` : ''}
  </div>`;
}

function bindHistory() {
  document.getElementById('backFromHist')?.addEventListener('click', () => { S.screen = 'start'; render(); });
  document.getElementById('clearHistBtn')?.addEventListener('click', () => {
    showConfirm('Limpar histórico?', 'Isso removerá todas as sessões salvas. As estatísticas por questão não serão afetadas.', () => {
      localStorage.removeItem(KEY.history);
      render();
    });
  });
}

// ── BUSCA ─────────────────────────────────────────────────────────────
function renderSearch() {
  const q   = S.searchQuery.toLowerCase().trim();
  const results = q.length >= 2
    ? Q.filter(item =>
        item.text.toLowerCase().includes(q) ||
        (item.opts || []).some(o => o.toLowerCase().includes(q)) ||
        (item.why || '').toLowerCase().includes(q) ||
        item.tp.toLowerCase().includes(q)
      ).slice(0, 30)
    : [];

  const listHtml = results.length
    ? results.map(item => {
        const col = topicColor(item.tp);
        const isFav = favorites.has(item.id);
        return `<div class="search-item" data-id="${item.id}" role="button" tabindex="0">
          <div class="search-num">#${item.id} · ${item.ty === 'single' ? 'Escolha única' : item.ty === 'multi' ? 'Múltipla escolha' : 'Correspondência'}</div>
          <div class="search-text">${esc(item.text.slice(0, 100))}${item.text.length > 100 ? '…' : ''}</div>
          <span class="search-tag" style="background:${col}22;color:${col};border:.5px solid ${col}44">${esc(item.tp)}</span>
          ${isFav ? '<span style="font-size:12px;margin-left:5px">⭐</span>' : ''}
        </div>`;
      }).join('')
    : q.length >= 2
      ? `<p style="color:var(--text2);font-size:13px">Nenhuma questão encontrada para "${esc(q)}"</p>`
      : q.length === 1
        ? `<p style="color:var(--yellow-text,#b45309);font-size:13px">Digite ao menos 2 caracteres.</p>`
        : `<p style="color:var(--text3);font-size:12px">Digite ao menos 2 caracteres para buscar.</p>`;

  return `<div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <button class="btn" id="backFromSearch" style="padding:5px 12px;font-size:12px" aria-label="Voltar">← Voltar</button>
      <h2 style="font-size:16px;font-weight:700">🔍 Buscar</h2>
    </div>
    <div style="position:relative;display:flex;align-items:center;margin-bottom:0">
      <input class="search-box" id="searchInput" type="search" placeholder="Buscar por texto, tópico, resposta…"
        value="${esc(S.searchQuery)}" autocomplete="off" aria-label="Campo de busca"
        style="flex:1;${S.searchQuery ? 'padding-right:44px' : ''}">
      ${S.searchQuery ? `<button id="clearSearch" style="position:absolute;right:0;top:0;bottom:0;width:44px;min-width:44px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text2);display:flex;align-items:center;justify-content:center" aria-label="Limpar busca">✕</button>` : ''}
    </div>
    <div id="searchResults">${listHtml}</div>
  </div>`;
}

function bindSearch() {
  document.getElementById('backFromSearch')?.addEventListener('click', () => { S.screen = 'start'; render(); });

  document.getElementById('clearSearch')?.addEventListener('click', () => {
    S.searchQuery = '';
    render();
  });

  const inp = document.getElementById('searchInput');
  if (inp) {
    inp.focus();
    inp.addEventListener('input', e => {
      S.searchQuery = e.target.value;
      const q   = S.searchQuery.toLowerCase().trim();
      const results = q.length >= 2
        ? Q.filter(item =>
            item.text.toLowerCase().includes(q) ||
            (item.opts || []).some(o => o.toLowerCase().includes(q)) ||
            (item.why || '').toLowerCase().includes(q) ||
            item.tp.toLowerCase().includes(q)
          ).slice(0, 30)
        : [];

      const col  = topicColor;
      const listHtml = results.length
        ? results.map(item => {
            const c   = col(item.tp);
            const isFav = favorites.has(item.id);
            return `<div class="search-item" data-id="${item.id}" role="button" tabindex="0">
              <div class="search-num">#${item.id}</div>
              <div class="search-text">${esc(item.text.slice(0, 100))}${item.text.length > 100 ? '…' : ''}</div>
              <span class="search-tag" style="background:${c}22;color:${c};border:.5px solid ${c}44">${esc(item.tp)}</span>
              ${isFav ? '<span style="font-size:12px;margin-left:5px">⭐</span>' : ''}
            </div>`;
          }).join('')
        : q.length >= 2
          ? `<p style="color:var(--text2);font-size:13px">Nenhuma questão encontrada.</p>`
          : q.length === 1
            ? `<p style="color:var(--yellow-text,#b45309);font-size:13px">Digite ao menos 2 caracteres.</p>`
            : `<p style="color:var(--text3);font-size:12px">Digite ao menos 2 caracteres para buscar.</p>`;

      // Update clear button visibility
      const clearBtn = document.getElementById('clearSearch');
      if (S.searchQuery && !clearBtn) {
        const wrapper = inp.parentElement;
        const btn = document.createElement('button');
        btn.id = 'clearSearch';
        btn.setAttribute('aria-label', 'Limpar busca');
        btn.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:44px;min-width:44px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text2);display:flex;align-items:center;justify-content:center';
        btn.textContent = '✕';
        btn.addEventListener('click', () => { S.searchQuery = ''; render(); });
        wrapper.appendChild(btn);
        inp.style.paddingRight = '44px';
      } else if (!S.searchQuery && clearBtn) {
        clearBtn.remove();
        inp.style.paddingRight = '';
      }

      document.getElementById('searchResults').innerHTML = listHtml;
      bindSearchResults();
    });
  }
  bindSearchResults();
}

function bindSearchResults() {
  document.querySelectorAll('.search-item').forEach(item => {
    const activate = () => {
      const id = parseInt(item.dataset.id);
      const qi = Q.findIndex(x => x.id === id);
      if (qi < 0) return;
      // Iniciar modo livre com apenas esta questão
      S.order = [qi];
      S.qi    = 0;
      S.startMode = 'free';
      S.screen    = 'quiz';
      S.answered  = false;
      S.selected  = null;
      S.multiSel  = [];
      S.matchSel  = {};
      S.shuffledMatchOpts = [];
      S.optOrder  = null;
      S.xp = 0; S.lives = Infinity; S.maxLives = Infinity;
      S.streak = 0; S.maxStreak = 0; S.correct = 0; S.wrong = 0;
      S.badges = []; S.wrongLog = []; S.topicStats = {};
      S.timerMode = 'free'; S.timerLeft = 0;
      render();
    };
    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => { if (e.key === 'Enter') activate(); });
  });
}

// ── 11. OVERLAYS ────────────────────────────────────────────────────
function closeAllModals() {
  document.querySelectorAll('.cmodal-overlay, .gloss-overlay').forEach(el => el.remove());
}

function showAlert(msg) {
  closeAllModals();
  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.id = 'alert-overlay';
  const lines = esc(msg).replace(/\n/g, '<br>');
  el.innerHTML = `<div class="cmodal">
    <div class="cmodal-msg" style="margin-bottom:0">${lines}</div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn pri" id="alertOk" style="min-width:80px">OK</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.querySelector('#alertOk').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

function showConfirm(title, msg, onOk) {
  closeAllModals();
  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.innerHTML = `<div class="cmodal">
    <div class="cmodal-title">${esc(title)}</div>
    <div class="cmodal-msg">${esc(msg)}</div>
    <div class="cmodal-btns">
      <button class="btn" id="confCancel">Cancelar</button>
      <button class="btn pri" id="confOk">Confirmar</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.querySelector('#confOk').onclick    = () => { el.remove(); onOk(); };
  el.querySelector('#confCancel').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

function showLightbox(src, alt) {
  const existing = document.getElementById('lb-overlay');
  if (existing) { existing.remove(); return; }
  closeAllModals();
  const el = document.createElement('div');
  el.className = 'lightbox-overlay';
  el.id = 'lb-overlay';
  el.innerHTML = `<img src="${esc(src)}" alt="${esc(alt || 'Imagem')}" loading="lazy">`;
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
  el.focus();
}

function promptExamDate() {
  closeAllModals();
  const current = getExamDate();
  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.innerHTML = `<div class="cmodal">
    <div class="cmodal-title">📅 Data do Exame</div>
    <div class="cmodal-msg">Defina a data para acompanhar a contagem regressiva.</div>
    <input class="cmodal-input" type="date" id="examDateInp" value="${esc(current)}">
    <div class="cmodal-btns">
      <button class="btn" id="edCancel">Cancelar</button>
      <button class="btn pri" id="edOk">Salvar</button>
    </div>
  </div>`;
  document.body.appendChild(el);
  el.querySelector('#edOk').onclick = () => {
    const val = el.querySelector('#examDateInp').value;
    if (val) { saveExamDate(val); render(); }
    el.remove();
  };
  el.querySelector('#edCancel').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  setTimeout(() => el.querySelector('#examDateInp')?.focus(), 60);
}

// ── 12. GLOSSÁRIO ────────────────────────────────────────────────────
function showGlossary() {
  if (document.getElementById('gloss-overlay')) {
    document.getElementById('gloss-overlay').remove(); return;
  }
  closeAllModals();
  const items = Object.entries(ACRONYMS).sort((a, b) => a[0].localeCompare(b[0])).map(([acr, def]) => {
    const dash = def.indexOf(' — ');
    const full = dash > -1 ? def.slice(0, dash) : def;
    const expl = dash > -1 ? def.slice(dash + 3) : '';
    return { acr, full, expl };
  });
  const letters = [...new Set(items.map(x => x.acr[0].toUpperCase()))].sort();

  let activeLetter = '';
  let searchVal    = '';

  const el = document.createElement('div');
  el.className = 'gloss-overlay';
  el.id = 'gloss-overlay';
  el.innerHTML = `<div class="gloss-box" role="dialog" aria-label="Glossário de siglas">
    <div class="gloss-handle"></div>
    <div class="gloss-hdr">
      <span class="gloss-htitle">📖 Glossário CCNA</span>
      <button class="gloss-close" id="gloss-close" aria-label="Fechar glossário">✕</button>
    </div>
    <input class="gloss-search" id="gloss-search" type="search" placeholder="Buscar sigla…" autocomplete="off" aria-label="Buscar sigla">
    <div class="gloss-letters" role="toolbar" aria-label="Filtrar por letra">
      <button class="gloss-ltr g-act" data-l="" aria-pressed="true">Todas</button>
      ${letters.map(l => `<button class="gloss-ltr" data-l="${l}">${l}</button>`).join('')}
    </div>
    <div class="gloss-count" id="gloss-count"></div>
    <div class="gloss-list" id="gloss-list" role="list"></div>
  </div>`;
  document.body.appendChild(el);

  function filtered() {
    const q = searchVal.toLowerCase();
    return items.filter(x => {
      if (q) return x.acr.toLowerCase().includes(q) || x.full.toLowerCase().includes(q) || x.expl.toLowerCase().includes(q);
      if (activeLetter) return x.acr[0].toUpperCase() === activeLetter;
      return true;
    });
  }

  function refresh() {
    const list = filtered();
    document.getElementById('gloss-count').textContent = `${list.length} sigla${list.length !== 1 ? 's' : ''}`;
    document.getElementById('gloss-list').innerHTML = list.map(x => `
      <div class="gloss-item" role="listitem" tabindex="0">
        <div class="gloss-item-head">
          <span class="gloss-acr">${esc(x.acr)}</span>
          <span class="gloss-short">${esc(x.full)}</span>
          <span class="gloss-chevron">▼</span>
        </div>
        <div class="gloss-body">${esc(x.expl)}</div>
      </div>`).join('');
    document.querySelectorAll('.gloss-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('g-open'));
      item.addEventListener('keydown', e => { if (e.key === 'Enter') item.classList.toggle('g-open'); });
    });
  }

  el.querySelector('#gloss-close').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  el.querySelector('.gloss-letters').addEventListener('click', e => {
    const btn = e.target.closest('.gloss-ltr');
    if (!btn) return;
    activeLetter = btn.dataset.l;
    searchVal = '';
    document.getElementById('gloss-search').value = '';
    document.querySelectorAll('.gloss-ltr').forEach(b => b.classList.toggle('g-act', b.dataset.l === activeLetter));
    btn.setAttribute('aria-pressed', 'true');
    refresh();
  });
  el.querySelector('#gloss-search').addEventListener('input', e => {
    searchVal = e.target.value;
    activeLetter = '';
    document.querySelectorAll('.gloss-ltr').forEach(b => b.classList.toggle('g-act', b.dataset.l === ''));
    refresh();
  });

  refresh();
  setTimeout(() => document.getElementById('gloss-search')?.focus(), 80);
}

// ── 13. RELATÓRIO DE PRONTIDÃO ───────────────────────────────────────
function showReadiness() {
  if (document.getElementById('ready-overlay')) {
    document.getElementById('ready-overlay').remove(); return;
  }
  closeAllModals();
  const hist     = getHistory().filter(h => h.mode === '📚' || h.mode === '⏱');
  const el       = document.createElement('div');
  el.className   = 'ready-overlay';
  el.id          = 'ready-overlay';

  if (!hist.length) {
    el.innerHTML = `<div class="ready-box" role="dialog">
      <div class="gloss-handle"></div>
      <div class="ready-hdr"><span class="ready-htitle">🎯 Relatório de Prontidão</span>
        <button class="gloss-close" id="ready-close" aria-label="Fechar">✕</button></div>
      <div class="ready-body"><div class="ready-no-data">🔍 Nenhuma sessão completa ainda.<br>Conclua ao menos uma vez<br>para gerar seu relatório.</div></div>
    </div>`;
    document.body.appendChild(el);
    el.querySelector('#ready-close').onclick = () => el.remove();
    el.addEventListener('click', e => { if (e.target === el) el.remove(); });
    return;
  }

  // Índice ponderado (sessões recentes valem mais)
  let wSum = 0, wTot = 0;
  hist.forEach((h, i) => { const w = Math.max(0.3, 1 - i * 0.1); wSum += h.pct * w; wTot += w; });
  const overall = Math.round(wSum / wTot);

  // Estatísticas cumulativas por tópico
  const cum = {};
  hist.forEach(h => {
    if (h.topicStats) Object.entries(h.topicStats).forEach(([tp, { c, t }]) => {
      if (!cum[tp]) cum[tp] = { c: 0, t: 0 };
      cum[tp].c += c; cum[tp].t += t;
    });
  });

  const topicList = Object.entries(cum)
    .filter(([, { t }]) => t >= 2)
    .map(([tp, { c, t }]) => ({ tp, pct: Math.round(c / t * 100), t }))
    .sort((a, b) => b.pct - a.pct);

  const strengths = topicList.filter(x => x.pct >= 75);
  const mid       = topicList.filter(x => x.pct >= 60 && x.pct < 75);
  const weak      = topicList.filter(x => x.pct < 60).sort((a, b) => a.pct - b.pct);

  const rColor = overall >= 80 ? '#5EE0A8' : overall >= 65 ? '#F5C842' : '#E05555';
  const rMsg   = overall >= 80 ? 'Excelente preparação! 🚀' : overall >= 65 ? 'Bom progresso — foque nas lacunas! 💪' : 'Continue praticando — você consegue! 🎯';

  function tpRows(list) {
    return list.map(x => {
      const col = x.pct >= 75 ? '#1D9E75' : x.pct >= 60 ? '#BA7517' : '#A32D2D';
      return `<div class="ready-topic-row">
        <span class="ready-tp-name">${esc(x.tp)}</span>
        <div class="ready-tp-bar"><div class="ready-tp-fill" style="width:${x.pct}%;background:${col}"></div></div>
        <span class="ready-tp-pct" style="color:${col}">${x.pct}%</span>
      </div>`;
    }).join('');
  }

  const statsHtml = topicList.length ? `
    ${strengths.length ? `<div class="ready-section"><div class="ready-stitle"><span style="color:#5EE0A8">✅</span> Pontos Fortes</div>${tpRows(strengths)}</div>` : ''}
    ${mid.length       ? `<div class="ready-section"><div class="ready-stitle"><span style="color:#F5C842">⚡</span> Em Desenvolvimento</div>${tpRows(mid)}</div>` : ''}
    ${weak.length      ? `<div class="ready-section"><div class="ready-stitle"><span style="color:#E05555">🎯</span> Foque Aqui</div>${tpRows(weak)}</div>` : ''}
  ` : `<div style="font-size:12px;color:var(--text2);text-align:center;padding:12px">Dados insuficientes por tópico ainda.</div>`;

  // Plano de estudo
  let planHtml = '';
  const dStr = getExamDate();
  if (weak.length && dStr) {
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const exam     = new Date(dStr + 'T00:00:00');
    const daysLeft = Math.max(0, Math.round((exam - today) / (1000 * 60 * 60 * 24)));
    if (daysLeft > 0) {
      const days    = Math.min(daysLeft, 7);
      const actions = ['Revisar teoria e conceitos', 'Praticar questões no simulador', 'Analisar erros cometidos', 'Refazer questões da categoria', 'Revisão geral do tópico'];
      const rows    = Array.from({ length: days }, (_, i) => {
        const topic = weak[i % weak.length];
        const label = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : `Dia +${i}`;
        return `<div class="ready-plan-row">
          <span class="ready-day-badge">${label}</span>
          <div><div class="ready-plan-topic">${esc(topic.tp)} — ${topic.pct}%</div>
          <div class="ready-plan-action">${actions[i % actions.length]}</div></div>
        </div>`;
      }).join('');
      planHtml = `<div class="ready-section">
        <div class="ready-stitle">📅 Plano de Estudo (${daysLeft} dia${daysLeft !== 1 ? 's' : ''} até o exame)</div>
        ${rows}
      </div>`;
    }
  }

  el.innerHTML = `<div class="ready-box" role="dialog" aria-label="Relatório de prontidão">
    <div class="gloss-handle"></div>
    <div class="ready-hdr">
      <span class="ready-htitle">🎯 Relatório de Prontidão</span>
      <button class="gloss-close" id="ready-close" aria-label="Fechar">✕</button>
    </div>
    <div class="ready-body">
      <div class="ready-score">
        <div class="ready-pct" style="color:${rColor}">${overall}%</div>
        <div class="ready-label">Índice de Prontidão · ${hist.length === 1 ? '1 sessão analisada' : hist.length + ' sessões analisadas'}</div>
        <div class="ready-msg">${rMsg}</div>
      </div>
      ${statsHtml}
      ${planHtml}
    </div>
  </div>`;

  document.body.appendChild(el);
  el.querySelector('#ready-close').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

// ── 14. STATS POR QUESTÃO ────────────────────────────────────────────
function showQStats() {
  if (document.getElementById('qstats-overlay')) {
    document.getElementById('qstats-overlay').remove(); return;
  }
  closeAllModals();
  const el = document.createElement('div');
  el.className = 'gloss-overlay';
  el.id = 'qstats-overlay';

  const attempted = Q.filter(q => qStats[qKey(q)]);
  const rows = attempted.length
    ? attempted
        .sort((a, b) => {
          const pa = qStats[qKey(a)].c / qStats[qKey(a)].a;
          const pb = qStats[qKey(b)].c / qStats[qKey(b)].a;
          return pa - pb;
        })
        .map(q => {
          const st  = qStats[qKey(q)];
          const pct = Math.round(st.c / st.a * 100);
          const col = pct >= 80 ? '#1D9E75' : pct >= 50 ? '#BA7517' : '#A32D2D';
          return `<div class="qstat-row">
            <span class="qstat-id">#${q.id}</span>
            <span class="qstat-text">${esc(q.text.slice(0, 55))}…</span>
            <div class="qstat-bar"><div class="qstat-fill" style="width:${pct}%;background:${col}"></div></div>
            <span class="qstat-pct" style="color:${col}">${pct}%</span>
          </div>`;
        }).join('')
    : '<p style="color:var(--text2);font-size:13px;padding:20px">Nenhuma questão tentada ainda.</p>';

  el.innerHTML = `<div class="gloss-box" role="dialog" aria-label="Estatísticas por questão">
    <div class="gloss-handle"></div>
    <div class="gloss-hdr">
      <span class="gloss-htitle">📊 Stats por Questão</span>
      <button class="gloss-close" id="qstats-close" aria-label="Fechar">✕</button>
    </div>
    <div class="gloss-count" style="padding:8px 14px 4px">${attempted.length === 1 ? '1 questão tentada' : attempted.length + ' questões tentadas'} · ordenadas por acerto ↑</div>
    <div class="gloss-list">${rows}</div>
  </div>`;

  document.body.appendChild(el);
  el.querySelector('#qstats-close').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}

// ── 15. COMPARTILHAR ─────────────────────────────────────────────────
function shareResult() {
  const tot    = S.correct + S.wrong;
  const pct    = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const lv     = getLvl(S.xp).n;
  const name   = getStudent() || 'Aluno';
  const text   = `SubnetLab · CCNA v7 SRWE\n${name}\n\n✅ ${pct}% (${S.correct}/${tot})\n⚡ ${S.xp} XP · 🔥 Streak ${S.maxStreak}\n🎓 ${lv}\n\nSimulador: github.com/SubnetLab`;

  if (navigator.share) {
    navigator.share({ title: 'Resultado SubnetLab', text }).catch(() => copyToClipboard(text));
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showAlert('✅ Resultado copiado para a área de transferência!'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showAlert('✅ Resultado copiado!'); } catch { showAlert('Não foi possível copiar. Tente manualmente.'); }
    document.body.removeChild(ta);
  }
}

// ── 16. PWA INSTALL ──────────────────────────────────────────────────
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  // Mostrar banner de instalação na próxima renderização da tela inicial
  const banner = document.getElementById('install-banner');
  if (banner) banner.style.display = 'flex';
});

// ── 17. SERVICE WORKER ───────────────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.warn('SW: falha no registro', err));
  }
}

// ── 18. INICIALIZAÇÃO ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  migrateQStats();
  buildPool();

  // Restaurar módulo salvo (se existir e for válido)
  const savedMod = parseInt(localStorage.getItem('sl_mod') || '0', 10) || 0;
  if (savedMod && availableMods().includes(savedMod)) {
    S.selectedMod = savedMod;
    buildPool();
  } else if (availableMods().length > 1) {
    // Sem escolha salva e com vários módulos: começar mostrando todos
    S.selectedMod = 0;
  }

  if (!Q.length) {
    document.getElementById('app').innerHTML =
      `<div style="padding:40px;text-align:center;color:var(--red-text)">
        ⚠️ Erro: nenhuma questão carregada.<br>
        <small>Verifique se o arquivo data/modulo2.js está presente.</small>
      </div>`;
    return;
  }

  // Determinar tela inicial (splash 1× por sessão via sessionStorage)
  const splashSeen = sessionStorage.getItem('sl_splash_seen');
  if (!splashSeen) {
    sessionStorage.setItem('sl_splash_seen', '1');
    S.screen = 'splash';
  } else {
    S.screen = getStudent() ? 'modules' : 'login';
  }

  applyTheme();
  render();
  registerSW();

  // Tooltips de siglas — clicar em .acr mostra definição
  document.addEventListener('click', e => {
    const acr = e.target.closest('.acr');
    if (!acr) return;
    const overlay = document.getElementById('acr-tooltip');
    if (overlay) { overlay.remove(); return; }
    e.stopPropagation();
    const def = acr.dataset.def;
    if (!def) return;
    const el = document.createElement('div');
    el.id = 'acr-tooltip';
    el.style.cssText = `
      position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
      background:#1A2540;color:#E8F0FF;border:1px solid #334477;
      border-radius:10px;padding:10px 16px;font-size:13px;font-weight:500;
      max-width:min(300px,90vw);line-height:1.6;z-index:99999;
      box-shadow:0 4px 20px rgba(0,0,0,.5);text-align:center;
    `;
    el.innerHTML = `<strong style="color:#7AB8F5">${esc(acr.textContent)}</strong><br>${esc(def).replace(' — ', '<br>')}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  });
});
