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
  certs:    'sl_certs',       // melhor certificado por módulo (local)
  notifSeen:'sl_notif_seen',  // id da última conquista vista
  spaced:   'sl_spaced',
};

// ── CÓDIGO DE ACESSO ────────────────────────────────────────────────
const ALFA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars, sem I O 0 1

function gerarCodigo() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let s = '';
  for (const b of bytes) s += ALFA[b % 32];
  return s.match(/.{4}/g).join('-');
}

function getCode() { return localStorage.getItem('sl_code') || ''; }

function ensureCode() {
  let c = getCode();
  if (!c) {
    c = gerarCodigo();
    localStorage.setItem('sl_code', c);
    localStorage.setItem('sl_code_seen', ''); // marcador: ainda não confirmou que guardou
  }
  return c;
}

function normalizarCodigo(c) {
  return String(c).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// ── SUPABASE ──────────────────────────────────────────────────────────
const SB_URL = 'https://obxytazxfeozyawkvcpx.supabase.co';
const SB_KEY = 'sb_publishable_bSqD4FOMLCyc81egVV9eJQ_x13y-EzL';

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

const TOPIC_AREAS = {
  'Switching':               ['Switching', 'VLANs', 'STP', 'EtherChannel', 'Inter-VLAN', 'Tabela MAC'],
  'Roteamento':              ['Roteamento', 'OSPF', 'FHRP', 'DHCPv4', 'DHCPv6'],
  'Segurança':               ['Segurança', 'Segurança L2', 'ACLs', 'NAT'],
  'WLAN e WAN':              ['WLAN', 'WAN', 'QoS'],
  'Arquitetura e automação': ['Arquitetura', 'Gerência', 'SDN/Cloud', 'Automação'],
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

// ── PESO DOS DOMÍNIOS DO EXAME ──────────────────────────────────────
// O 200-301 não sorteia tópicos por igual: o blueprint da Cisco dá peso a cada
// domínio. Sortear uniforme inflava VLAN/ACL (temos muitas) e quase ignorava
// Fundamentos. Os pesos abaixo são os oficiais (v1.1), em %.
const EXAM_DOMAINS = [
  { key: 'fund',   pct: 20, topics: ['Arquitetura', 'Troubleshooting'] },
  { key: 'access', pct: 20, topics: ['VLANs', 'Inter-VLAN', 'Switching', 'STP', 'EtherChannel', 'WLAN', 'Tabela MAC', 'Segurança L2'] },
  { key: 'ipconn', pct: 25, topics: ['Roteamento', 'OSPF', 'FHRP'] },
  { key: 'ipserv', pct: 10, topics: ['Gerência', 'QoS', 'DHCPv4', 'NAT', 'WAN'] },
  { key: 'sec',    pct: 15, topics: ['Segurança', 'ACLs'] },
  { key: 'auto',   pct: 10, topics: ['Automação', 'SDN/Cloud'] },
];
let DOMAIN_OF_TOPIC = null;

function domainOf(tp) {
  if (!DOMAIN_OF_TOPIC) {
    DOMAIN_OF_TOPIC = {};
    EXAM_DOMAINS.forEach(d => d.topics.forEach(t => { DOMAIN_OF_TOPIC[t] = d.key; }));
  }
  return DOMAIN_OF_TOPIC[tp] || 'fund';   // tópico novo cai em Fundamentos, nunca fora da conta
}

// Sorteia n questões do pool respeitando o peso de cada domínio. Domínio sem
// questões suficientes entrega tudo o que tem e a sobra vai para quem ainda tem
// espaço (na ordem do peso) — nunca trava nem devolve menos que o pedido quando
// o pool é maior que n.
function weightedDraw(pool, n) {
  if (n >= pool.length) return shuffle(pool.slice());
  const grupos = {};
  EXAM_DOMAINS.forEach(d => { grupos[d.key] = []; });
  pool.forEach(i => { grupos[domainOf(Q[i].tp)].push(i); });

  const cotas = {};
  let soma = 0;
  EXAM_DOMAINS.forEach(d => { cotas[d.key] = Math.floor(n * d.pct / 100); soma += cotas[d.key]; });

  // maior resto (12,5 vira 13 quando sobra vaga)
  const restos = EXAM_DOMAINS
    .map(d => ({ k: d.key, r: n * d.pct / 100 - cotas[d.key] }))
    .sort((a, b) => b.r - a.r);
  for (let i = 0; soma < n && i < restos.length; i++) {
    const k = restos[i].k;
    if (cotas[k] < grupos[k].length) { cotas[k]++; soma++; }
  }

  // domínio com menos questões que a cota: pega todas e redistribui a falta
  let falta = 0;
  EXAM_DOMAINS.forEach(d => {
    const k = d.key;
    if (cotas[k] > grupos[k].length) { falta += cotas[k] - grupos[k].length; cotas[k] = grupos[k].length; }
  });
  let guard = 0;
  while (falta > 0 && guard++ < 50) {
    const comEspaco = EXAM_DOMAINS
      .filter(d => cotas[d.key] < grupos[d.key].length)
      .sort((a, b) => b.pct - a.pct);
    if (!comEspaco.length) break;
    for (const d of comEspaco) {
      if (falta <= 0) break;
      if (cotas[d.key] < grupos[d.key].length) { cotas[d.key]++; falta--; }
    }
  }

  let out = [];
  EXAM_DOMAINS.forEach(d => {
    out = out.concat(shuffle(grupos[d.key].slice()).slice(0, cotas[d.key]));
  });
  return shuffle(out);
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

function corDoNome(nome) {
  let h = 0;
  for (const ch of nome) h = (h * 31 + ch.charCodeAt(0)) % 360;
  // 58% de saturação e 28% de luminosidade: com 48% as iniciais brancas davam
  // 1,9:1 nos verdes/amarelos (WCAG pede 4.5:1). Nesta faixa todo matiz fica
  // escuro o bastante para o branco passar, mantendo cores distintas por aluno.
  return `hsl(${h}, 58%, 28%)`;
}

function iniciais(nome) {
  if (!nome) return '??';
  const p = nome.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return '??';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function formatXP(n) { return Number(n || 0).toLocaleString('pt-BR'); }

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
    wrongLog: S.wrongLog.map(w => ({ qId: w.q ? w.q.id : null, qKey: w.q ? qKey(w.q) : null, userAns: w.userAns })),
    answers: S.answers || {},
    topicStats: S.topicStats,
    timerMode: S.timerMode,
    timerLeft: S.timerLeft,
    startMode: S.startMode,
    selectedTopic: S.selectedTopic,
    planIds: S.planIds || [],
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
      .map(w => ({ q: (w.qKey ? Q.find(x => qKey(x) === w.qKey) : null) || Q.find(x => x.id === w.qId) || null,
                   userAns: w.userAns }))
      .filter(w => w.q);
    if (!s.answers) s.answers = {};
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

// ── XP TOTAL ──────────────────────────────────────────────────────────
function getXpTotal() {
  let n = parseInt(localStorage.getItem('sl_xp_total') || '0', 10) || 0;
  if (!n) {
    const h = getHistory();
    if (h.length) {
      n = h.reduce((s, e) => s + (e.xp || 0), 0);
      if (n) localStorage.setItem('sl_xp_total', String(n));
    }
  }
  return n;
}

function addXpTotal(xp) {
  if (!xp || xp <= 0) return;
  localStorage.setItem('sl_xp_total', String(getXpTotal() + xp));
}

// ── SNAPSHOT / SUPABASE FETCH ─────────────────────────────────────────
function snapshot() {
  // Regra do projeto: todo estado de progresso novo entra no snapshot E no backup.
  // `certs` ficou de fora desde que nasceu — trocar de aparelho perdia o certificado
  // local (a nuvem tinha, mas offline e rollback ficavam cegos).
  return { qStats, spaced, history: getHistory(), certs: getCerts() };
}

async function sbPush() {
  const code = getCode();
  if (!code) return false;

  // ANTES de enviar, junta com o que está na nuvem. Sem isto, um aparelho com
  // dados antigos sobrescreve o progresso que outro aparelho acabou de gravar
  // (último-a-enviar-vence). Falha de rede aqui não impede o envio.
  try {
    const row = await sbPull(code);
    if (row) {
      const remote = { ...(row.dados || {}), xp: row.xp || 0 };
      const local  = { qStats, spaced, history: getHistory(), certs: getCerts(), xp: getXpTotal() };
      const { merged, changed } = mergeSnapshots(local, remote);
      if (changed) {
        qStats = merged.qStats;
        spaced = merged.spaced;
        localStorage.setItem(KEY.qstats,  JSON.stringify(qStats));
        localStorage.setItem(KEY.spaced,  JSON.stringify(spaced));
        localStorage.setItem(KEY.history, JSON.stringify(merged.history));
        if (merged.certs) localStorage.setItem(KEY.certs, JSON.stringify(merged.certs));
        localStorage.setItem('sl_xp_total', String(merged.xp));
      }
    }
  } catch { /* segue com o envio */ }

  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/sync_put`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_code: code,
        p_nome: getStudent() || 'Estudante',
        p_xp: getXpTotal(),
        p_dados: snapshot(),
      }),
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    return r.ok;
  } catch { clearTimeout(tid); return false; }
}

async function sbPull(code) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/sync_get`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code }),
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    if (!r.ok) return null;
    const data = await r.json();
    return data && data.length > 0 ? data[0] : null;
  } catch { clearTimeout(tid); return null; }
}

async function sbDeleteCloud(code) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/sync_delete`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code }),
      signal: ctrl.signal,
    });
    clearTimeout(tid);
    return r.ok;
  } catch { clearTimeout(tid); return false; }
}

// ── BIDIRECTIONAL SYNC ───────────────────────────────────────────────
// A data do histórico é uma string pt-BR ("16/11/26 18:05"); comparar isso como texto
// inverte sessões de meses/anos diferentes. Usa o ts gravado e, para registros antigos,
// converte a data na hora.
function histTs(h) {
  if (h && typeof h.ts === 'number') return h.ts;
  const m = /(\d{2})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/.exec((h && h.date) || '');
  if (!m) return 0;
  const [, d, mo, y, hh, mi] = m;
  return new Date(2000 + Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mi)).getTime();
}

function mergeSnapshots(local, remote) {
  let changed = false;

  // qStats: keep the record with higher `a`; tie → higher `c`
  const mergedQStats = { ...local.qStats };
  for (const [k, rv] of Object.entries(remote.qStats || {})) {
    const lv = local.qStats[k];
    if (!lv || rv.a > lv.a || (rv.a === lv.a && rv.c > lv.c)) {
      mergedQStats[k] = rv;
      if (!lv || lv.a !== rv.a || lv.c !== rv.c) changed = true;
    }
  }

  // spaced {int, due, ease, reps}: keep the record with higher `reps`; tie → higher `ease`
  const mergedSpaced = { ...local.spaced };
  for (const [k, rv] of Object.entries(remote.spaced || {})) {
    const lv = local.spaced[k];
    if (!lv || rv.reps > lv.reps || (rv.reps === lv.reps && rv.ease > lv.ease)) {
      mergedSpaced[k] = rv;
      if (!lv || lv.reps !== rv.reps || lv.ease !== rv.ease) changed = true;
    }
  }

  // certs: melhor nota por módulo, nunca a última gravada
  const mergedCerts = { ...(local.certs || {}) };
  for (const [mod, rc] of Object.entries(remote.certs || {})) {
    const lc = mergedCerts[mod];
    if (!lc || (rc.pct || 0) > (lc.pct || 0)) {
      mergedCerts[mod] = rc;
      if (!lc || lc.pct !== rc.pct) changed = true;
    }
  }

  // history: union by `${date}|${total}`, newest first, capped at 20
  const localHistory = local.history || [];
  const seen = new Set(localHistory.map(h => `${h.date}|${h.total}`));
  const mergedHistory = [...localHistory];
  for (const h of (remote.history || [])) {
    const key = `${h.date}|${h.total}`;
    if (!seen.has(key)) { mergedHistory.push(h); seen.add(key); changed = true; }
  }
  mergedHistory.sort((a, b) => histTs(b) - histTs(a));
  if (mergedHistory.length > 20) mergedHistory.length = 20;

  // xp: take the max
  const mergedXp = Math.max(local.xp || 0, remote.xp || 0);
  if (mergedXp > (local.xp || 0)) changed = true;

  return { merged: { qStats: mergedQStats, spaced: mergedSpaced, history: mergedHistory, certs: mergedCerts, xp: mergedXp }, changed };
}

async function syncPullMerge() {
  const code = getCode();
  if (!code || !navigator.onLine) return;
  if (_syncRunning) return;
  _syncRunning = true;
  try {
    const row = await sbPull(code);
    if (!row) return;
    const remote = { ...(row.dados || {}), xp: row.xp || 0 };
    const local  = { qStats, spaced, history: getHistory(), certs: getCerts(), xp: getXpTotal() };
    const { merged, changed } = mergeSnapshots(local, remote);
    if (changed) {
      qStats = merged.qStats;
      spaced = merged.spaced;
      localStorage.setItem(KEY.qstats,   JSON.stringify(qStats));
      localStorage.setItem(KEY.spaced,   JSON.stringify(spaced));
      localStorage.setItem(KEY.history,  JSON.stringify(merged.history));
      if (merged.certs) localStorage.setItem(KEY.certs, JSON.stringify(merged.certs));
      localStorage.setItem('sl_xp_total', String(merged.xp));
      if (S.screen === 'modules' || S.screen === 'start') render();
      await sbPush();
      setSyncStatus('ok');
    }
  } finally {
    _syncRunning = false;
  }
}

async function sbRanking() {
  if (!navigator.onLine) return { ok: false, data: [] };
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/ranking?select=*&order=posicao.asc&limit=50`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, signal: ctrl.signal, cache: 'no-store' }
    );
    clearTimeout(tid);
    if (!r.ok) return { ok: false, data: [] };
    const data = await r.json();
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch { clearTimeout(tid); return { ok: false, data: [] }; }
}

// ── SYNC STATUS ───────────────────────────────────────────────────────
let syncStatus = '';
let syncStatusTimer = null;
let _syncRunning = false;
let _lastAutoSync = 0;

function setSyncStatus(s) {
  syncStatus = s;
  if (syncStatusTimer) { clearTimeout(syncStatusTimer); syncStatusTimer = null; }
  if (s === 'ok') syncStatusTimer = setTimeout(() => { syncStatus = ''; updateSyncIndicator(); }, 3000);
  updateSyncIndicator();
}

function updateSyncIndicator() {
  const el = document.getElementById('sync-status');
  if (!el) return;
  if (!syncStatus)                   el.textContent = '';
  else if (syncStatus === 'syncing') el.textContent = '☁️ Sincronizando…';
  else if (syncStatus === 'ok')      el.textContent = '☁️ Sincronizado';
  else                               el.textContent = '☁️ Offline';
}

async function syncAndUpdateStatus() {
  if (!getCode()) return;
  setSyncStatus('syncing');
  const ok = await sbPush();
  setSyncStatus(ok ? 'ok' : 'offline');
}

function exportData() {
  const data = {
    __v: 2,
    name: getStudent(),
    examDate: getExamDate(),
    history: getHistory(),
    qStats,
    spaced,
    xpTotal: getXpTotal(),
    favs: [...favorites],
    certs: getCerts(),
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
      if (d.spaced) { spaced = d.spaced; localStorage.setItem(KEY.spaced, JSON.stringify(spaced)); }
      if (typeof d.xpTotal === 'number') localStorage.setItem('sl_xp_total', String(d.xpTotal));
      // Certificado é "melhor nota vence" — importar um backup antigo não pode apagar
      // um certificado melhor que já está neste aparelho (mesma regra da nuvem).
      aplicarCerts(d.certs);
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
  startMode:     'free',   // free | timed | topic | errors | spaced | plan
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
  answers:       {},       // {qKey: resposta do usuário} — usado na revisão
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
  pendingMod:    null,     // transient: módulo selecionado na trilha, não persistido
  gabaritoId:    null,     // transient: questão em consulta gabarito (nunca conta XP/stats)
  planIds:       [],       // índices do plano corrente (persistido para resumeQuiz)
  cert:          null,     // {elegivel, pct, melhor, novo, sincronizado}
  notif:         null,     // últimas conquistas dos colegas
  notifStale:    false,    // true = a lista veio de uma sessão anterior e pode estar velha
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

function getPlan() {
  const target = Math.min(25, Q.length);
  const used   = new Set();
  const partes = [];

  // Parte 1: tópicos fracos (até 10 questões)
  const tpAcc = {};
  Q.forEach(q => {
    const st = qStats[qKey(q)];
    if (!st) return;
    if (!tpAcc[q.tp]) tpAcc[q.tp] = { c: 0, a: 0 };
    tpAcc[q.tp].c += st.c;
    tpAcc[q.tp].a += st.a;
  });
  const weakTopics = Object.entries(tpAcc)
    .filter(([, { c, a }]) => a >= 2 && c / a < 0.6)
    .sort(([, a1], [, b1]) => a1.c / a1.a - b1.c / b1.a);

  if (weakTopics.length) {
    const weakSet = new Set(weakTopics.map(([tp]) => tp));
    const weakQs  = Q.map((_, i) => i).filter(i => weakSet.has(Q[i].tp) && qStats[qKey(Q[i])]);
    const taken   = weakQs.slice(0, 10);
    if (taken.length) {
      taken.forEach(i => used.add(qKey(Q[i])));
      const worstTp  = weakTopics[0][0];
      const worstPct = Math.round(weakTopics[0][1].c / weakTopics[0][1].a * 100);
      partes.push({ motivo: `${taken.length} de ${worstTp} — ${worstPct}% de acerto`, qtd: taken.length, ids: taken });
    }
  }

  // Parte 2: revisão espaçada vencida (até 8 questões)
  const hoje      = hojeISO();
  const spacedDue = Q.map((_, i) => i).filter(i => {
    const k = qKey(Q[i]);
    const s = spaced[k];
    return s && s.due <= hoje && !used.has(k);
  });
  const spacedTaken = spacedDue.slice(0, 8);
  if (spacedTaken.length) {
    spacedTaken.forEach(i => used.add(qKey(Q[i])));
    partes.push({ motivo: `${spacedTaken.length} para revisar hoje`, qtd: spacedTaken.length, ids: spacedTaken });
  }

  // Parte 3: nunca tentadas (completa até o alvo)
  const remaining = target - partes.reduce((s, p) => s + p.qtd, 0);
  if (remaining > 0) {
    const newQs   = shuffle(Q.map((_, i) => i).filter(i => !qStats[qKey(Q[i])] && !used.has(qKey(Q[i]))));
    const newTaken = newQs.slice(0, remaining);
    if (newTaken.length) {
      partes.push({ motivo: `${newTaken.length} questões novas`, qtd: newTaken.length, ids: newTaken });
    }
  }

  if (!partes.length) return { total: 0, partes: [], ids: [] };
  const ids = partes.flatMap(p => p.ids);
  return { total: ids.length, partes, ids };
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
  } else if (mode === 'plan') {
    pool = S.planIds && S.planIds.length ? S.planIds.slice() : getPlan().ids;
    if (!pool.length) { showAlert('Nada pendente no plano de hoje. ✓'); return; }
  } else {
    pool = [...Array(Q.length).keys()];
    // Revisão Completa (sem módulo escolhido): a Prova é uma amostra de 60 questões
    // sorteadas do banco; o modo Livre continua apresentando todas, aleatoriamente.
    if (mode === 'timed' && !S.selectedMod && pool.length > 60) {
      pool = weightedDraw(pool, 60);   // 60 com o peso dos domínios do 200-301
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
    answers: {},
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
    planIds: mode === 'plan' ? pool.slice() : [],
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
  (S.answers || (S.answers = {}))[qKey(q)] = realIdx;
  applyScore(q, ok, dispIdx);
  render();
  saveProgress();
  scrollToFeedback();
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
  (S.answers || (S.answers = {}))[qKey(q)] = [...S.multiSel];
  applyScore(q, ok, null);
  render();
  saveProgress();
  scrollToFeedback();
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
  (S.answers || (S.answers = {}))[qKey(q)] = q.pairs.map((_, pi) => S.shuffledMatchOpts[S.matchSel[pi]] || null);
  applyScore(q, allOk, null);
  render();
  saveProgress();
  scrollToFeedback();
  if (S.timerMode === 'timed' && S.lives <= 0) showLivesOut();
}

// Ao responder, a explicação nasce abaixo da dobra e o aluno não a vê.
// Esta função leva o bloco de feedback para a área visível.
function scrollToFeedback() {
  if (S.timerMode !== 'free') return;   // na prova o feedback só aparece no fim
  requestAnimationFrame(() => {
    const el = document.querySelector('.fb');
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.55) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
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
    S.wrongLog.push({ q, userAns: (S.answers && S.answers[qKey(q)]) ?? null });
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
  mountModal(el);
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
    ts:         Date.now(),       // ordenação confiável (a string dd/mm/aa não ordena)
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
  addXpTotal(S.xp);

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
  if (getCode()) sbPush();
  registrarCertificado();   // grava o melhor resultado e publica a conquista

  S.screen = 'result';
  render();
}


// ── CERTIFICADOS POR MÓDULO ──────────────────────────────────────────
// Regra: só ganha certificado quem faz uma PROVA (modo cronometrado) e
// acerta pelo menos CERT_MIN%. O melhor resultado é guardado; nota menor
// nunca substitui a maior (nem localmente, nem no banco).
const CERT_MIN = 70;

function certTipo(mod) {
  if (mod === 0) return { titulo: 'Certificado de Revisão Completa', curso: 'Revisão Completa — todos os módulos', tipo: 'revisao' };
  const d = MOD_DEFS.find(x => x.mod === mod) || { name: 'SubnetLab' };
  if (mod === 4) return { titulo: 'Certificado de Preparação para Certificação', curso: d.name, tipo: 'prep' };
  return { titulo: 'Certificado de Conclusão de Curso', curso: d.name, tipo: 'curso' };
}

// Cor do texto do rank na LISTA do perfil: no tema claro o amarelo/verde claros
// somem no fundo branco, então usamos a variante escura equivalente.
function rankListColor(pct) {
  const escuro = { 100: '#F5C842', 90: '#5EE0A8', 80: '#7AB8F5', 0: '#A89DF5' };
  const claro  = { 100: '#8A6A00', 90: '#0F6B45', 80: '#1E4E8C', 0: '#4B3E9E' };
  const faixa  = pct === 100 ? 100 : pct >= 90 ? 90 : pct >= 80 ? 80 : 0;
  return (darkMode ? escuro : claro)[faixa];
}

function certRank(pct) {
  return pct === 100 ? { rank: 'Mestre CCNA',    icon: '🏆', cor: '#F5C842' }
       : pct >= 90   ? { rank: 'Expert em Redes', icon: '🌟', cor: '#5EE0A8' }
       : pct >= 80   ? { rank: 'CCNA Aprovado',   icon: '✅', cor: '#7AB8F5' }
       :               { rank: 'Técnico de Redes', icon: '📡', cor: '#A89DF5' };
}

// Cor da nota/rank no DOM do resultado. Igual ao rankListColor: o azul/verde/amarelo
// claros foram escolhidos para o fundo escuro e somem no tema claro (medido 1,88:1
// no rank e no %). O canvas NÃO usa esta função — ele desenha sempre em fundo escuro.
function scoreColorUI(pct) {
  if (darkMode) {
    return pct === 100 ? '#F5C842' : pct >= 90 ? '#5EE0A8' : pct >= 70 ? '#7AB8F5' : '#F08080';
  }
  return pct === 100 ? '#8A6A00' : pct >= 90 ? '#0F6B45' : pct >= 70 ? '#1E4E8C' : '#B23B3B';
}

// Cor do TEXTO de percentual por desempenho. As cores usadas nas barras
// (#1D9E75 / #BA7517 / #A32D2D) somem quando viram texto de 11px no fundo escuro
// (medido 3,1:1). Aqui devolvemos variantes legíveis nos dois temas; as barras
// continuam com a cor saturada.
function pctText(p) {
  if (darkMode) return p >= 80 ? '#5EE0A8' : p >= 60 ? '#F5C842' : '#F08080';
  return p >= 80 ? '#0F6B45' : p >= 60 ? '#8A6A00' : '#B23B3B';
}

// Cor do texto (iniciais) sobre o avatar. corDoNome() devolve de verde claro a
// vinho; branco fixo dá 1,9:1 no verde claro. Escolhe entre branco e tinta
// escura pela luminância do fundo — vale para qualquer cor futura da paleta.
function corTextoAvatar(cor) {
  let r, g, b;
  const str = String(cor || '').trim();
  const hex = str.match(/^#([0-9a-f]{6})$/i);
  const hsl = str.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
  if (hex) {
    const h = hex[1];
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
  } else if (hsl) {
    const hh = parseFloat(hsl[1]) / 360, sat = parseFloat(hsl[2]) / 100, li = parseFloat(hsl[3]) / 100;
    const q = li < 0.5 ? li * (1 + sat) : li + sat - li * sat;
    const pp = 2 * li - q;
    const f = t => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return pp + (q - pp) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return pp + (q - pp) * (2 / 3 - t) * 6;
      return pp;
    };
    r = f(hh + 1 / 3); g = f(hh); b = f(hh - 1 / 3);
  } else {
    return '#FFFFFF';
  }
  const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.42 ? '#10131F' : '#FFFFFF';
}

function certSlug(mod) {
  return ({ 0: 'revisao', 1: 'itn', 2: 'srwe', 3: 'ensa', 4: 'cert' })[mod] || 'subnetlab';
}

function certCanvas(info) {
  const { mod, pct, acertos, erros, nome, dataStr } = info;
  const certD = pct === 100 ? { rank: 'Mestre CCNA',    icon: '🏆', color: '#F5C842' }
    : pct >= 90             ? { rank: 'Expert em Redes', icon: '🌟', color: '#5EE0A8' }
    : pct >= 80             ? { rank: 'CCNA Aprovado',   icon: '✅', color: '#7AB8F5' }
    :                         { rank: 'Técnico de Redes',icon: '📡', color: '#A89DF5' };

  const tipo = certTipo(mod);
  const W = 800, H = 500;
  const cv  = document.createElement('canvas');
  cv.width  = W; cv.height = H;
  const ctx = cv.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#12172B');
  bg.addColorStop(0.5, '#1A1D2F');
  bg.addColorStop(1,   '#12172B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = certD.color + '88';
  ctx.lineWidth   = 3;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  const cs = 18;
  ctx.strokeStyle = certD.color + '66';
  ctx.lineWidth   = 2;
  [[20, 20, 1, 1], [W-20, 20, -1, 1], [20, H-20, 1, -1], [W-20, H-20, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * cs, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * cs);
    ctx.stroke();
  });

  ctx.textAlign = 'center';

  ctx.fillStyle = '#6B7399';
  ctx.font      = '12px system-ui, sans-serif';
  ctx.fillText('SubnetLab · CCNA v7 · Simulador de Certificação', W / 2, 52);

  ctx.font = '52px system-ui, sans-serif';
  ctx.fillText(certD.icon, W / 2, 120);

  ctx.fillStyle = '#9BA3C4';
  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillText(tipo.titulo.toUpperCase(), W / 2, 155);

  ctx.fillStyle = '#E8EAF6';
  ctx.font      = 'bold 26px system-ui, sans-serif';
  ctx.fillText(nome, W / 2, 198);

  ctx.fillStyle = certD.color;
  ctx.font      = 'bold 30px system-ui, sans-serif';
  ctx.fillText(certD.rank, W / 2, 240);

  ctx.fillStyle = '#9BA3C4';
  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillText(tipo.curso, W / 2, 268);

  ctx.strokeStyle = certD.color + '44';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 200, 285);
  ctx.lineTo(W / 2 + 200, 285);
  ctx.stroke();

  ctx.fillStyle = certD.color;
  ctx.font      = 'bold 34px system-ui, sans-serif';
  [[pct + '%', W / 2 - 150], [String(acertos), W / 2], [String(erros), W / 2 + 150]].forEach(([v, x]) => {
    ctx.fillText(v, x, 335);
  });
  ctx.fillStyle = '#6B7399';
  ctx.font      = '11px system-ui, sans-serif';
  [['APROVEITAMENTO', W / 2 - 150], ['ACERTOS', W / 2], ['ERROS', W / 2 + 150]].forEach(([l, x]) => {
    ctx.fillText(l, x, 353);
  });

  let datePT;
  if (dataStr && dataStr.length === 10) {
    const [y, m, d] = dataStr.split('-').map(Number);
    datePT = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  } else if (dataStr) {
    datePT = new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } else {
    datePT = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  ctx.fillStyle = '#6B7399';
  ctx.font      = '12px system-ui, sans-serif';
  ctx.fillText(datePT, W / 2, 410);

  ctx.fillStyle = '#3A3F5C';
  ctx.font      = '11px system-ui, sans-serif';
  ctx.fillText('SubnetLab', W / 2, 450);

  return cv;
}

function getCerts() {
  try { return JSON.parse(localStorage.getItem(KEY.certs) || '{}'); } catch { return {}; }
}

// Grava localmente apenas se for a melhor nota do módulo. Devolve true se melhorou.
function saveCertLocal(mod, info) {
  const c   = getCerts();
  const at  = c[mod];
  if (at && at.pct >= info.pct) return false;
  c[mod] = info;
  localStorage.setItem(KEY.certs, JSON.stringify(c));
  return true;
}

// Aplica um mapa de certificados de fora (nuvem ou backup) mantendo o MELHOR por módulo.
// Reaproveitado pelo import, pelo merge do sync e pelos dois caminhos do vínculo de código —
// antes cada um fazia a sua própria lista de campos e `certs` ficou de fora dos três.
function aplicarCerts(mapa) {
  if (!mapa || typeof mapa !== 'object') return false;
  const at = getCerts();
  let mudou = false;
  for (const [mod, c] of Object.entries(mapa)) {
    if (!c || typeof c !== 'object') continue;
    if (!at[mod] || (c.pct || 0) > (at[mod].pct || 0)) { at[mod] = c; mudou = true; }
  }
  if (mudou) localStorage.setItem(KEY.certs, JSON.stringify(at));
  return mudou;
}

function bestCertPct(mod) {
  const c = getCerts();
  return c[mod] ? c[mod].pct : null;
}

async function sbCertPut(code, mod, pct, acertos, total, rank) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/cert_put`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code, p_mod: mod, p_pct: pct, p_acertos: acertos, p_total: total, p_rank: rank }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d[0] : d;
  } catch { return null; }
}

async function sbConquistaAdd(code, nome, mod, pct, rank) {
  try {
    await fetch(`${SB_URL}/rest/v1/rpc/conquista_add`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code, p_nome: nome, p_mod: mod, p_pct: pct, p_rank: rank }),
    });
    return true;
  } catch { return false; }
}

async function sbConquistasList(excluir, limite = 30) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/conquistas_list`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_excluir: excluir || '', p_limite: limite }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d : null;
  } catch { return null; }
}

async function sbCertList(code) {
  if (!code) return null;
  try {
    const r = await fetch(`${SB_URL}/rest/v1/rpc/cert_list`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return Array.isArray(d) ? d : null;
  } catch { return null; }
}

function mergeCerts(local, cloud) {
  const merged = { ...local };
  if (!cloud) return merged;
  for (const row of cloud) {
    const mod = row.mod;
    if (!merged[mod] || row.pct > merged[mod].pct) {
      merged[mod] = {
        pct: row.pct,
        acertos: row.acertos || 0,
        total: row.total || 0,
        rank: row.rank || certRank(row.pct).rank,
        quando: row.emitido_em || new Date().toISOString(),
        emitido_em: row.emitido_em,
      };
    }
  }
  return merged;
}

function renderCertListHtml(certs) {
  const mods = Object.keys(certs).map(Number).sort((a, b) => a - b);
  if (!mods.length) {
    return `<p class="cert-list-empty">Nenhum certificado ainda — conclua uma prova com 70% ou mais.</p>`;
  }
  return mods.map(mod => {
    const c = certs[mod];
    const def = MOD_DEFS.find(d => d.mod === mod);
    const modName = def ? def.abbr : `Módulo ${mod}`;
    const { rank, cor } = certRank(c.pct);
    const when = c.emitido_em || c.quando || '';
    const dateStr = when ? (() => {
      const dt = new Date(when);
      return isNaN(dt) ? '' : dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    })() : '';
    const dataISO = when && when.length >= 10 ? when.slice(0, 10) : hojeISO();
    const acertos = c.acertos || 0;
    const total   = c.total   || acertos;
    return `<div class="cert-list-row" data-mod="${mod}" data-pct="${c.pct}" data-acertos="${acertos}" data-total="${total}" data-data="${esc(dataISO)}">
      <div class="cert-list-info">
        <span class="cert-list-mod">${esc(modName)}</span>
        <span class="cert-list-rank" style="color:${rankListColor(c.pct)}">${c.pct}% · ${esc(rank)}</span>
        ${dateStr ? `<span class="cert-list-date">${esc(dateStr)}</span>` : ''}
      </div>
      <div class="cert-list-btns">
        <button class="btn cert-list-dl" style="padding:3px 8px;font-size:11px">⬇️ PNG</button>
        <button class="btn cert-list-share" style="padding:3px 8px;font-size:11px">📤 Compartilhar</button>
        <button class="btn cert-list-print" style="padding:3px 8px;font-size:11px">🖨 Imprimir</button>
      </div>
    </div>`;
  }).join('');
}

// Chamado no fim de TODA sessão: decide se há certificado e o que registrar.
async function registrarCertificado() {
  const tot = S.correct + S.wrong;
  const pct = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const mod = S.selectedMod;
  const elegivel = S.timerMode === 'timed' && pct >= CERT_MIN && [0, 1, 2, 3, 4].includes(mod);

  S.cert = { elegivel, pct, melhor: bestCertPct(mod), novo: false, sincronizado: null };
  if (!elegivel) return;

  const rank  = certRank(pct).rank;
  const antes = bestCertPct(mod);
  const info  = { pct, acertos: S.correct, total: tot, rank, quando: new Date().toISOString() };
  S.cert.novo = saveCertLocal(mod, info);
  S.cert.melhor = antes === null ? pct : Math.max(antes, pct);
  if (!S.cert.novo) return;              // nota menor: nada é publicado

  const code = getCode();
  if (!code) { S.cert.sincronizado = false; return; }
  const res = await sbCertPut(code, mod, pct, S.correct, tot, rank);
  S.cert.sincronizado = res ? !!res.melhorou : false;
  if (res && res.melhorou) {
    // só anuncia aos colegas quando a nota melhorou DE FATO na nuvem
    await sbConquistaAdd(code, getStudent() || 'Colega', mod, pct, rank);
  }
  if (S.screen === 'result') render();
}


// ── NOTIFICAÇÕES (conquistas dos colegas) ────────────────────────────
function ultimaNotifVista() {
  return parseInt(localStorage.getItem(KEY.notifSeen) || '0', 10) || 0;
}

async function carregarNotificacoes() {
  const lista = await sbConquistasList(getCode(), 30);
  if (!lista) {
    // Offline: mantém a lista em memória, mas MARCA que ela não é atual. Sem essa
    // marca o sino exibia conquistas de minutos (ou horas) atrás como se fossem agora,
    // sem nenhum aviso — o mesmo defeito que o ranking já teve com a lista em cache.
    S.notifStale = Array.isArray(S.notif) && S.notif.length > 0;
    return;
  }
  S.notif = lista;
  S.notifStale = false;
  const vistas = ultimaNotifVista();
  const novas  = lista.filter(c => Number(c.id) > vistas).length;
  const b = document.getElementById('notifBadge');
  if (b) {
    b.textContent = novas > 9 ? '9+' : String(novas);
    b.hidden = novas === 0;
  }
}

function textoConquista(c) {
  if (c.mod === 0) return `${c.nome} finalizou a revisão completa e conquistou o certificado ${c.rank || 'de aprovação'} (${c.pct}%)`;
  const alvo = c.mod === 4
    ? 'da preparação para a certificação'
    : `do curso ${certTipo(c.mod).curso}`;
  return `${c.nome} finalizou a prova final ${alvo} e conquistou o certificado ${c.rank || 'de aprovação'} (${c.pct}%)`;
}

function showNotificacoes() {
  closeAllModals();
  const lista = Array.isArray(S.notif) ? S.notif : null;   // null = ainda não carregou / falhou
  const avisoVelho = (lista && S.notifStale)
    ? `<p style="color:var(--text3);font-size:11px;margin:0 0 10px;display:flex;gap:6px;align-items:center">📵 Sem conexão agora — mostrando o que foi carregado nesta sessão.</p>`
    : '';
  const itens = lista === null
    ? `<p style="color:var(--text2);font-size:13px">Não foi possível carregar as conquistas agora. Verifique a conexão e tente de novo.</p>`
    : !lista.length
      ? `<p style="color:var(--text2);font-size:13px">Nenhum colega conquistou certificado ainda. Seja o primeiro! 🏆</p>`
      : lista.map(c => `<div class="notif-item">
          <div class="notif-icon">🎓</div>
          <div class="notif-body">
            <div class="notif-txt">${esc(textoConquista(c))}</div>
            <div class="notif-when">${esc(new Date(c.criado_em).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' }))}</div>
          </div>
        </div>`).join('');

  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.id = 'notif-overlay';
  el.innerHTML = `<div class="cmodal" style="max-width:420px">
    <div class="cmodal-title">🔔 Conquistas dos colegas</div>
    <div class="notif-list">${avisoVelho}${itens}</div>
    <div style="margin-top:16px;text-align:right">
      <button class="btn pri" id="notifOk" style="min-width:90px">Fechar</button>
    </div>
  </div>`;
  mountModal(el);
  el.querySelector('#notifOk').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });

  // marca como vistas
  if (Array.isArray(lista) && lista.length) {
    const maior = Math.max(...lista.map(c => Number(c.id) || 0));
    if (maior > ultimaNotifVista()) localStorage.setItem(KEY.notifSeen, String(maior));
    const b = document.getElementById('notifBadge');
    if (b) { b.hidden = true; b.textContent = ''; }
  }
}

// ── 10. RENDER ──────────────────────────────────────────────────────
function render() {
  applyTheme();
  stopCountdownTick();   // re-armado por bindStart quando a tela start renderizar
  const app = document.getElementById('app');
  if (!app) return;
  if (S.screen !== 'search') S.gabaritoId = null;

  if (S.screen === 'splash')  { app.innerHTML = renderSplash();            bindSplash();  return; }
  if (S.screen === 'modules') { app.innerHTML = renderModules();           bindModules(); return; }
  if (S.screen === 'login')   { app.innerHTML = renderLogin();             bindLogin();   return; }
  if (S.screen === 'start')   { app.innerHTML = renderStart();             bindStart();   return; }
  if (S.screen === 'quiz')    { app.innerHTML = renderQuiz();              bindQuiz();    return; }
  if (S.screen === 'result')  { app.innerHTML = renderResult();            bindResult();  return; }
  if (S.screen === 'review')  { app.innerHTML = renderReview();            bindReview();  return; }
  if (S.screen === 'history') { app.innerHTML = renderHistory();           bindHistory(); return; }
  if (S.screen === 'search')  { app.innerHTML = renderSearch();            bindSearch();  return; }
  if (S.screen === 'ranking') { app.innerHTML = renderRanking();           bindRanking(); return; }
  if (S.screen === 'guide')   { app.innerHTML = renderGuide();             bindGuide();   return; }
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
    abbr: '200-301 CCNA',
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
  const name     = getStudent() || 'Estudante';
  const availMods = availableMods();
  const ini      = iniciais(name);
  const cor      = corDoNome(name);

  // Trilha: módulos 1→4 em ordem fixa
  const trailDefs = MOD_DEFS.filter(d => d.mod !== 0).sort((a, b) => a.mod - b.mod);

  // Aluno novo nunca escolheu módulo (S.selectedMod === 0). Sem isto, NENHUM item
  // ficaria expandido: a tela perde o Continuar e a descrição justo no primeiro acesso.
  // Nesse caso destacamos o primeiro curso disponível como sugestão de partida.
  const disponiveis = trailDefs.filter(d => availMods.includes(d.mod));
  const atualMod    = S.selectedMod || (disponiveis[0] ? disponiveis[0].mod : 0);
  const estreia     = !S.selectedMod;   // destaque é sugestão, não histórico
  const pendente    = S.pendingMod != null ? S.pendingMod : atualMod;

  const trailItems = trailDefs.map(def => {
    const isAvail    = availMods.includes(def.mod);
    const isCurrent  = def.mod === atualMod;    // para marker e tag "Atual"
    const isPendente = def.mod === pendente && pendente !== 0; // para expansão
    const { seen, total, pct } = modProgress(def.mod);

    let markerClass, markerInner = '';
    if (!isAvail)        { markerClass = 'dm-disabled'; }
    else if (isCurrent)  { markerClass = 'dm-current'; }
    else if (pct >= 80)  { markerClass = 'dm-done'; markerInner = '✓'; }
    else if (pct > 0)    { markerClass = 'dm-half'; }
    else                 { markerClass = 'dm-empty'; }

    if (!isAvail) {
      return `<div class="mod-trail-step">
        <div class="mod-trail-marker ${markerClass}">${markerInner}</div>
        <div class="mod-trail-card mod-trail-card--disabled" aria-disabled="true">
          <div class="mod-trail-row">
            <span class="mod-trail-icon">${def.icon}</span>
            <span class="mod-trail-name">${esc(def.abbr)}</span>
            <span class="mod-trail-soon">Em breve</span>
          </div>
          <div class="mod-trail-name-full">${esc(def.name)}</div>
        </div>
      </div>`;
    }

    if (isPendente) {
      const ctaLabel = seen > 0 ? 'Continuar' : 'Iniciar';
      return `<div class="mod-trail-step">
        <div class="mod-trail-marker ${markerClass}">${markerInner}</div>
        <div class="mod-trail-card mod-trail-card--current" data-mod="${def.mod}">
          <div class="mod-trail-row">
            <span class="mod-trail-icon">${def.icon}</span>
            <span class="mod-trail-name">${esc(def.abbr)}</span>
            ${isCurrent ? `<span class="mod-trail-current-tag">${estreia ? 'Comece aqui' : 'Atual'}</span>` : ''}
          </div>
          <div class="mod-trail-name-full">${esc(def.name)}</div>
          <div class="mod-trail-stats">${seen} de ${total} questões · <span style="color:var(--blue-text);font-weight:700">${pct}%</span></div>
          <div class="mod-trail-pbar"><div class="mod-trail-pfill" style="width:${pct}%"></div></div>
          <button class="mod-trail-cta" aria-label="Entrar no módulo ${esc(def.name)}">${ctaLabel} <span>→</span></button>
        </div>
      </div>`;
    }

    const pctColor = pct >= 80 ? 'var(--green-text)' : pct > 0 ? 'var(--blue-text)' : 'var(--text3)';
    return `<div class="mod-trail-step">
      <div class="mod-trail-marker ${markerClass}">${markerInner}</div>
      <button type="button" class="mod-trail-card mod-trail-card--btn" data-mod="${def.mod}" aria-label="Selecionar módulo ${esc(def.name)}">
        <span class="mod-trail-compact-row">
          <span class="mod-trail-icon mod-trail-icon-sm">${def.icon}</span>
          <span class="mod-trail-compact-body">
            <span class="mod-trail-compact-name">${esc(def.abbr)} <span class="mod-trail-compact-meta">· ${seen} de ${total} questões</span></span>
            <span class="mod-trail-pbar mod-trail-pbar--thin"><span class="mod-trail-pfill" style="width:${pct}%"></span></span>
          </span>
          <span class="mod-trail-compact-pct" style="color:${pctColor}">${pct}%</span>
        </span>
      </button>
    </div>`;
  }).join('');

  const revProg = modProgress(0);

  return `<div class="modules-wrap">
    <div class="mod-topbar">
      <div class="mod-topbar-row1">
        <span class="mod-topbar-title">SubnetLab</span>
        <span id="sync-status" class="mod-topbar-sync"></span>
      </div>
      <div class="mod-topbar-row2">
        <button class="mod-profile" id="modProfile" aria-label="Meu perfil">
          <span class="mod-avatar" style="background:${esc(cor)}">${esc(ini)}</span>
          <span class="mod-profile-name">${esc(name)}</span>
        </button>
        <div class="mod-topbar-actions">
          <button class="icon-btn notif-btn" id="modNotif" title="Conquistas dos colegas" aria-label="Notificações de conquistas">🔔<span class="notif-badge" id="notifBadge" hidden></span></button>
          <button class="icon-btn" id="modRanking" title="Ranking da turma" aria-label="Ranking da turma">🏆</button>
          <button class="icon-btn" id="modGuide" title="Como funciona" aria-label="Como funciona">❓</button>
          <button class="icon-btn theme-btn" title="Alternar tema" aria-label="Alternar tema">${darkMode ? '☀️' : '🌙'}</button>
        </div>
      </div>
    </div>

    <div class="mod-sec-hdr">Sua Trilha</div>
    <div class="mod-sec-sub">Da introdução de Redes à Certificação CCNA</div>

    <div class="mod-trail">
      <div class="mod-trail-vline"></div>
      ${trailItems}
    </div>

    <div class="mod-trail-hr" style="margin-top:12px"></div>
    ${S.pendingMod === 0 ? `
    <div class="mod-revisao mod-revisao--current" data-mod="0">
      <span class="mod-trail-icon mod-trail-icon-sm">🎯</span>
      <div class="mod-revisao-body">
        <span class="mod-revisao-name">Revisão Completa</span>
        <span class="mod-revisao-desc">Combinação de todos os módulos, do ITN ao ENSA.</span>
        <span class="mod-revisao-count">${revProg.seen} de ${revProg.total} questões · ${revProg.pct}%</span>
        <div class="mod-trail-pbar"><div class="mod-trail-pfill" style="width:${revProg.pct}%"></div></div>
      </div>
      <button class="mod-trail-cta" aria-label="Entrar na revisão completa">${revProg.seen > 0 ? 'Continuar' : 'Iniciar'} <span>→</span></button>
    </div>` : `
    <button type="button" class="mod-revisao mod-revisao--btn" data-mod="0" aria-label="Selecionar Revisão Completa">
      <span class="mod-trail-icon mod-trail-icon-sm">🎯</span>
      <span class="mod-revisao-body">
        <span class="mod-revisao-name">Revisão Completa</span>
        <span class="mod-revisao-desc">Combinação de todos os módulos, do ITN ao ENSA.</span>
        <span class="mod-revisao-count">${revProg.seen} de ${revProg.total} questões · ${revProg.pct}%</span>
      </span>
      <span class="mod-revisao-arrow">›</span>
    </button>`}
  </div>`;
}

function bindModules() {
  ensureCode();
  if (localStorage.getItem('sl_code_seen') === '') showCodigoModal(true);
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);

  document.getElementById('modProfile')?.addEventListener('click', showProfileModal);
  document.getElementById('modNotif')?.addEventListener('click', showNotificacoes);
  carregarNotificacoes();

  const enterMod = (m) => {
    S.pendingMod = null;
    S.selectedMod = m;
    localStorage.setItem('sl_mod', String(m));
    buildPool();
    S.screen = 'start';
    render();
  };

  // Module cards: tap to SELECT (expand), not enter
  // Selecionar (mouse ou teclado): o card não selecionado é um <button>, então
  // Enter/Espaço já disparam o click nativo. O card selecionado é um <div> com o
  // CTA dentro — div clicável não aninha controles (era violação de acessibilidade).
  document.querySelectorAll('.mod-trail-card[data-mod]').forEach(el => {
    const mod = parseInt(el.dataset.mod, 10);
    el.addEventListener('click', e => {
      if (e.target.closest('.mod-trail-cta')) return;   // o CTA tem o seu próprio handler
      S.pendingMod = mod; render();
    });
  });

  // CTA button: enter the expanded module
  document.querySelectorAll('.mod-trail-cta').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('[data-mod]');
      enterMod(card ? parseInt(card.dataset.mod, 10) : 0);
    });
  });

  // Revisão completa: tap to SELECT (expand), enter via CTA (same pattern as module cards)
  document.querySelectorAll('.mod-revisao[data-mod]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.mod-trail-cta')) return;
      S.pendingMod = 0; render();
    });
  });

  const goRanking = () => { S.ranking = { status: 'loading', lista: [] }; S.screen = 'ranking'; render(); };
  const goGuide   = () => { S.screen = 'guide'; render(); };

  document.getElementById('modRanking')?.addEventListener('click', goRanking);
  document.getElementById('modGuide')?.addEventListener('click', goGuide);


  if (getCode()) syncAndUpdateStatus();
}

// ── GUIA ──────────────────────────────────────────────────────────────
function renderGuide() {
  const chips = [
    { id: 'sec-caminho',   label: 'O caminho' },
    { id: 'sec-modos',     label: 'Os modos' },
    { id: 'sec-botoes',    label: 'Os botões' },
    { id: 'sec-pontuacao', label: 'Pontuação' },
    { id: 'sec-progresso', label: 'Seu progresso' },
  ];

  const chipHtml = chips.map(c =>
    `<button class="guide-chip" role="button" tabindex="0" data-target="${c.id}" aria-label="Ir para ${esc(c.label)}">${esc(c.label)}</button>`
  ).join('');

  const stepsHtml = [
    { n: '1', title: 'Escolha o módulo',        text: 'SRWE, ENSA, Revisão Completa ou Certificação. O número no card é quantas questões o módulo tem. A barra mostra quanto você já viu.' },
    { n: '2', title: 'Escolha o modo de estudo', text: 'Livre, Prova, Por Tópico, Revisão de Erros ou Revisão Espaçada — ou o Plano de hoje, que monta a sessão sozinho.' },
    { n: '3', title: 'Estude e acompanhe',       text: 'Cada questão tem explicação da resposta. O XP aparece no ranking, e um código guarda seu progresso para você continuar em outro aparelho.' },
    { n: '4', title: 'Conquiste o certificado',  text: 'Termine uma Prova com 70% ou mais e o certificado sai na hora. Cada módulo tem o seu, e o app guarda sempre a sua melhor nota — refazer e tirar menos não apaga o certificado que você já ganhou.' },
  ].map(s => `<div class="guide-step">
    <div class="guide-step-num">${s.n}</div>
    <div class="guide-step-body"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
  </div>`).join('');

  const modesHtml = [
    { icon: '📚', name: 'Livre',           desc: 'Questões em ordem aleatória, com correção e explicação na hora.',        when: '"quero estudar sem pressão"' },
    { icon: '⏱', name: 'Prova',            desc: 'Cronômetro, sem feedback até o fim, limite de erros. 70%+ emite o certificado do módulo.', when: '"quero simular o dia da prova"' },
    { icon: '🏷️', name: 'Por Tópico',      desc: 'Você escolhe um assunto (STP, OSPF, ACLs…) e treina só ele.',           when: '"vou mal em VLANs"' },
    { icon: '❌', name: 'Revisão de Erros', desc: 'Só as questões que você já errou, das mais erradas para as menos.',     when: '"quero corrigir o que caiu"' },
    { icon: '🔁', name: 'Revisão Espaçada', desc: 'Questões vencendo hoje, num intervalo que cresce a cada acerto.',       when: '"quero não esquecer o que aprendi"' },
  ].map(m => `<div class="guide-mode-card">
    <div class="guide-mode-icon">${m.icon}</div>
    <div class="guide-mode-name">${esc(m.name)}</div>
    <div class="guide-mode-desc">${esc(m.desc)}</div>
    <div class="guide-mode-when"><strong>Use quando…</strong> ${esc(m.when)}</div>
  </div>`).join('');

  const buttonsHtml = [
    { icon: '🔍',    name: 'Gabarito',          desc: 'Procura qualquer questão do módulo e mostra a resposta certa com a explicação — modo consulta, não conta XP.' },
    { icon: '📖',    name: 'Glossário',         desc: 'Explica as siglas do CCNA (VLAN, STP, OSPF…).' },
    { icon: '🎯',    name: 'Prontidão',         desc: 'Diz o quanto você está pronto para a prova.' },
    { icon: '📅',    name: 'Data da prova',     desc: 'Marca o dia do exame. Enquanto não marcar, nada aparece; depois, a contagem fica no topo do módulo.' },
    { icon: '📊',    name: 'Stats',             desc: 'Seu desempenho questão por questão.' },
    { icon: '📋',    name: 'Histórico',         desc: 'Todas as sessões que você já fez.' },
    { icon: '🔔',    name: 'Conquistas',        desc: 'Avisa quando um colega conquista certificado — com nome, curso e nota.' },
    { icon: '🎓',    name: 'Meus certificados', desc: 'No seu perfil: baixar o PNG, compartilhar ou imprimir (dá para salvar em PDF na impressão).' },
    { icon: '🔑',    name: 'Meu código',        desc: 'O código que leva seu progresso para outro aparelho.' },
    { icon: '🏆',    name: 'Ranking',           desc: 'A classificação da turma por XP.' },
    { icon: '☀️/🌙', name: 'Tema',             desc: 'Troca entre o modo claro e o escuro.' },
    { icon: '⬇️/⬆️', name: 'Exportar/Importar', desc: 'Backup do progresso em arquivo local. Fica no seu perfil (avatar).' },
    { icon: '☆',    name: 'Favoritar',         desc: 'Marca uma questão para estudar depois.' },
  ].map(b => `<div class="guide-btn-row">
    <div class="guide-btn-icon">${b.icon}</div>
    <div class="guide-btn-name">${esc(b.name)}</div>
    <div class="guide-btn-desc">${esc(b.desc)}</div>
  </div>`).join('');

  const scoresHtml = [
    { emoji: '⚡', label: 'XP',                 rule: `Acertar vale <span class="guide-score-hl">+15 XP</span>. Errar desconta <span class="guide-score-hl">5 XP</span> (mínimo zero).` },
    { emoji: '🔥', label: 'Streak',              rule: `Acertos seguidos: <span class="guide-score-hl">+5 XP</span> no 2.° e <span class="guide-score-hl">+10 XP</span> do 3.° em diante.` },
    { emoji: '❤️', label: 'Vidas (só na Prova)', rule: 'Você pode errar até 30% das questões. A sessão encerra quando as vidas zeram.' },
    { emoji: '🎓', label: 'Certificado',         rule: '<span class="guide-score-hl">70%+ no modo Prova</span> gera certificado com rank. Módulos 1 a 3 emitem <em>Conclusão de Curso</em>; a Revisão Completa e a Preparação para Certificação têm os seus. Só a <strong>maior nota</strong> fica guardada.' },
  ].map(s => `<div class="guide-score-card">
    <div class="guide-score-top">
      <div class="guide-score-emoji">${s.emoji}</div>
      <div class="guide-score-label">${esc(s.label)}</div>
    </div>
    <div class="guide-score-rule">${s.rule}</div>
  </div>`).join('');

  const progHtml = [
    { icon: '🔑', title: 'Código de acesso', text: 'É o que identifica você — sem senha, sem e-mail. Guarde-o: com ele você recupera tudo em outro celular ou computador.' },
    { icon: '☁️', title: 'Sincronização',    text: 'Automática quando há internet: o app junta o que você fez em cada aparelho antes de enviar, então nada se perde se estudar em dois. Funciona offline — salva no aparelho e envia quando a conexão volta.' },
    { icon: '🏆', title: 'Ranking',          text: 'Nome, XP e posição. Seu progresso individual nunca é mostrado a ninguém.' },
    { icon: '🗑️', title: 'Apagar da nuvem', text: 'No modal do código você pode apagar os dados do servidor. Os dados deste aparelho ficam.' },
  ].map(p => `<div class="guide-prog-item">
    <div class="guide-prog-icon">${p.icon}</div>
    <div class="guide-prog-body"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>
  </div>`).join('');

  const secHdr = (label) =>
    `<div class="guide-section-hdr"><h2 class="sec-hdr" style="margin:0">${esc(label)}</h2></div>`;

  return `<div class="guide-wrap" role="main">
    <div class="guide-topbar">
      <button class="ranking-back" id="guideBack" aria-label="Voltar para módulos">← Voltar</button>
      <div class="guide-topbar-title">Guia</div>
      <button class="icon-btn theme-btn" title="Alternar tema" aria-label="Alternar tema claro/escuro">${darkMode ? '☀️' : '🌙'}</button>
    </div>

    <p class="guide-kicker">SUBNETLAB · CCNA v7</p>
    <div class="guide-hero">
      <h1>Como funciona</h1>
      <p>Tudo o que você precisa saber para usar o app.</p>
    </div>

    <div class="guide-chips" role="navigation" aria-label="Índice do guia">
      ${chipHtml}
    </div>

    <section class="guide-section" id="sec-caminho">
      ${secHdr('O caminho')}
      <div class="guide-steps">${stepsHtml}</div>
    </section>

    <section class="guide-section" id="sec-modos">
      ${secHdr('Os modos')}
      <div class="guide-plan-callout">
        <div class="guide-plan-icon">🎯</div>
        <div class="guide-plan-body">
          <h3>Plano de hoje</h3>
          <p>Monta uma sessão de ~25 questões sozinho — mistura seus pontos fracos, revisões vencidas e questões novas. Use quando não souber por onde começar.</p>
        </div>
      </div>
      <div class="guide-modes">${modesHtml}</div>
    </section>

    <section class="guide-section" id="sec-botoes">
      ${secHdr('Os botões')}
      <div class="guide-btn-list">${buttonsHtml}</div>
    </section>

    <section class="guide-section" id="sec-pontuacao">
      ${secHdr('Pontuação')}
      <div class="guide-score-grid">${scoresHtml}</div>
    </section>

    <section class="guide-section" id="sec-progresso">
      ${secHdr('Seu progresso')}
      <div class="guide-prog-list">${progHtml}</div>
    </section>

    <div class="guide-cta">
      <button class="btn pri" id="guideStudy">Entendi, vamos estudar →</button>
    </div>
  </div>`;
}

function bindGuide() {
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);

  const goBack = () => { S.screen = 'modules'; render(); };
  document.getElementById('guideBack')?.addEventListener('click', goBack);
  document.getElementById('guideStudy')?.addEventListener('click', goBack);

  document.querySelectorAll('.guide-chip').forEach(chip => {
    const activate = () => {
      const target = document.getElementById(chip.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    chip.addEventListener('click', activate);
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
}

// ── RANKING ───────────────────────────────────────────────────────────
function renderRanking() {
  const st = S.ranking || { status: 'loading', lista: [] };
  const nome = getStudent();

  const topbar = `
    <div class="ranking-topbar">
      <button class="ranking-back" id="btnRankingBack" aria-label="Voltar para módulos">← Voltar</button>
      <div class="ranking-topbar-title">🏆 RANKING${st.status === 'offline' ? ' <span class="rank-offline-badge" role="status" aria-label="Sem conexão">📵 offline</span>' : ''}</div>
      <button class="icon-btn theme-btn" title="Alternar tema claro/escuro" aria-label="Alternar tema claro/escuro">${darkMode ? '☀️' : '🌙'}</button>
    </div>`;

  if (st.status === 'loading') {
    return `<div class="ranking-wrap">${topbar}
      <p class="ranking-kicker">SUBNETLAB · CCNA v7</p>
      <div class="ranking-skeleton">
        <div class="rank-skel-podium">
          <div class="skel-block" style="height:125px"></div>
          <div class="skel-block" style="height:150px"></div>
          <div class="skel-block" style="height:105px"></div>
        </div>
        <div class="skel-row"></div>
        <div class="skel-row"></div>
        <div class="skel-row"></div>
        <div class="skel-row"></div>
        <div class="skel-row"></div>
      </div>
    </div>`;
  }

  const lista = st.lista;

  if (st.status === 'empty' || (!lista.length && st.status !== 'offline')) {
    return `<div class="ranking-wrap">${topbar}
      <p class="ranking-kicker">SUBNETLAB · CCNA v7</p>
      <div class="rank-empty">
        <div class="rank-empty-icon">🏆</div>
        <div class="rank-empty-title">Ninguém no ranking ainda</div>
        <div class="rank-empty-sub">Seja o primeiro: complete uma sessão e seu XP aparece aqui.</div>
        <button class="btn pri" id="btnRankingStudy" style="margin-top:20px;padding:12px 24px">Começar a estudar</button>
      </div>
    </div>`;
  }

  if (st.status === 'offline' && !lista.length) {
    return `<div class="ranking-wrap">${topbar}
      <p class="ranking-kicker">SUBNETLAB · CCNA v7</p>
      <div class="rank-offline-msg">📵 Ranking indisponível offline.</div>
    </div>`;
  }

  const offlineBanner = st.status === 'offline'
    ? `<div class="rank-offline-banner">📶 Sem conexão — mostrando a última lista vista</div>` : '';

  const totalAlunos = lista.length;
  const totalXP = lista.reduce((s, r) => s + (r.xp || 0), 0);
  const mediaXP = totalAlunos >= 2 ? Math.round(totalXP / totalAlunos) : null;
  const statsLine = `<div class="ranking-stats-line">${totalAlunos} aluno${totalAlunos !== 1 ? 's' : ''} · ${formatXP(totalXP)} XP no total${mediaXP !== null ? ' · média ' + formatXP(mediaXP) + ' XP' : ''}</div>`;

  const meEntry = lista.find(r => r.nome === nome);
  const mePosicao = meEntry ? meEntry.posicao : null;
  const meXp = meEntry ? meEntry.xp : getXpTotal();

  // ── Pódio (top 3)
  const top3 = lista.slice(0, Math.min(3, lista.length));
  let podiumOrder;
  if (top3.length >= 3)      podiumOrder = [top3[1], top3[0], top3[2]]; // 2º, 1º, 3º
  else if (top3.length === 2) podiumOrder = [top3[1], top3[0]];
  else                        podiumOrder = [top3[0]];

  const medalEmoji = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const medalClass = { 1: 'gold', 2: 'silver', 3: 'bronze' };
  const podiumDelays = { 1: 0, 2: 80, 3: 160 };

  const podiumCards = podiumOrder.map(item => {
    if (!item) return '';
    const pos = item.posicao;
    const cls = medalClass[pos] || 'gold';
    const delay = podiumDelays[pos] || 0;
    const isMe = item.nome === nome;
    const nomeTrunc = item.nome.length > 12 ? item.nome.slice(0, 12) + '…' : item.nome;
    const ini = iniciais(item.nome);
    const cor = corDoNome(item.nome);
    const avatarSize = pos === 1 ? 42 : 36;
    const fontSize = pos === 1 ? '16px' : '13px';
    return `<div class="podium-card podium-${cls}${isMe ? ' podium-me' : ''}" style="animation-delay:${delay}ms">
      <div class="podium-medal">${medalEmoji[pos] || '🏅'}</div>
      <div class="rank-avatar" style="background:${cor};color:${corTextoAvatar(cor)};width:${avatarSize}px;height:${avatarSize}px;font-size:${fontSize}">${esc(ini)}</div>
      <div class="podium-name" title="${esc(item.nome)}">${esc(nomeTrunc)}</div>
      <div class="podium-xp">${formatXP(item.xp)}</div>
    </div>`;
  }).join('');

  const podiumHTML = `<div class="ranking-podium">${podiumCards}</div>`;

  // ── Faixa de posição
  let bannerHTML = '';
  if (meEntry && meXp > 0) {
    let msg;
    if (mePosicao === 1) {
      msg = '🏆 Você lidera o ranking!';
    } else if (mePosicao === totalAlunos && totalAlunos >= 2 && totalAlunos < 50) {
      msg = '📍 Você está em último — bora subir?';
    } else {
      msg = `📍 Você está em ${mePosicao}º de ${totalAlunos} aluno${totalAlunos !== 1 ? 's' : ''}`;
    }
    bannerHTML = `<div class="rank-banner">${msg}</div>`;
  }

  // ── Lista do 4º em diante
  const listItems = lista.slice(3);
  const maxXP = Math.max(1, lista[0]?.xp || 1);

  const listRows = listItems.map((item, idx) => {
    const isMe = item.nome === nome;
    const ini = iniciais(item.nome);
    const cor = corDoNome(item.nome);
    const pct = Math.min(100, Math.round((item.xp || 0) / maxXP * 100));
    const delay = idx * 30;
    const nameHtml = isMe
      ? `${esc(item.nome)} <span class="rank-me-badge">VOCÊ</span>`
      : esc(item.nome);
    return `<div class="rank-row${isMe ? ' rank-row-me' : ''}" style="animation-delay:${delay}ms">
      <div class="rank-row-body">
        <span class="rank-pos">${item.posicao}</span>
        <div class="rank-avatar" style="background:${cor};color:${corTextoAvatar(cor)};width:32px;height:32px;font-size:12px">${esc(ini)}</div>
        <span class="rank-name">${nameHtml}</span>
        <div class="rank-xp-wrap">
          <span class="rank-xp-val">${formatXP(item.xp)}</span>
          <span class="rank-xp-suf">XP</span>
        </div>
      </div>
      <div class="rank-xpbar"><div class="rank-xpbar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join('');

  const listHTML = listItems.length ? `<div class="rank-list">${listRows}</div>` : '';

  // ── Fora do top 50
  let notFoundHTML = '';
  if (!meEntry) {
    const ini = nome ? iniciais(nome) : '?';
    const cor = nome ? corDoNome(nome) : '#888';
    const myXP = getXpTotal();
    const nameHtml = `${esc(nome || 'Você')} <span class="rank-me-badge">VOCÊ</span>`;
    notFoundHTML = `
      <div class="rank-sep"></div>
      <div class="rank-list">
        <div class="rank-row rank-row-me">
          <div class="rank-row-body">
            <span class="rank-pos" style="color:var(--text3)">?</span>
            <div class="rank-avatar" style="background:${cor};color:${corTextoAvatar(cor)};width:32px;height:32px;font-size:12px">${esc(ini)}</div>
            <span class="rank-name">${nameHtml}</span>
            <div class="rank-xp-wrap">
              ${myXP > 0 ? `<span class="rank-xp-val">${formatXP(myXP)}</span><span class="rank-xp-suf">XP</span>` : ''}
            </div>
          </div>
          <div class="rank-xpbar"><div class="rank-xpbar-fill" style="width:0%"></div></div>
        </div>
        <div class="rank-notfound-msg">Sua posição aparecerá aqui quando você pontuar.</div>
      </div>`;
  }

  return `<div class="ranking-wrap">
    ${topbar}
    <p class="ranking-kicker">SUBNETLAB · CCNA v7</p>
    ${statsLine}
    ${offlineBanner}
    ${podiumHTML}
    ${bannerHTML}
    ${listHTML}
    ${notFoundHTML}
  </div>`;
}

function bindRanking() {
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);
  document.getElementById('btnRankingBack')?.addEventListener('click', () => {
    S.screen = 'modules';
    render();
  });
  document.getElementById('btnRankingStudy')?.addEventListener('click', () => {
    S.screen = 'modules';
    render();
  });

  const st = S.ranking || { status: 'loading', lista: [] };
  if (st.status !== 'loading') return;

  sbRanking().then(({ ok, data }) => {
    if (!ok) {
      let cached = [];
      try { cached = JSON.parse(localStorage.getItem('sl_ranking_cache') || '[]'); } catch {}
      S.ranking = { status: 'offline', lista: cached };
    } else if (!data.length) {
      S.ranking = { status: 'empty', lista: [] };
    } else {
      localStorage.setItem('sl_ranking_cache', JSON.stringify(data));
      S.ranking = { status: 'ok', lista: data };
    }
    if (S.screen === 'ranking') render();
  });
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
    <div style="margin-top:12px;text-align:center">
      <button id="linkCodeBtn" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:12px;padding:4px 8px;text-decoration:underline">Já estudo em outro aparelho</button>
    </div>
    <div id="link-code-section" style="display:none;margin-top:12px">
      <input class="login-input" id="codeInput" type="text" placeholder="XXXX-XXXX-XXXX-XXXX"
        autocomplete="off" maxlength="24" aria-label="Código de acesso"
        style="margin-bottom:8px;text-align:center;letter-spacing:1px;font-family:monospace">
      <button class="btn" id="linkBtn" style="width:100%;font-size:14px;padding:10px">Vincular</button>
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
    ensureCode();
    if (localStorage.getItem('sl_code_seen') === '') {
      showCodigoModal(true);
    } else {
      S.screen = 'modules';
      render();
    }
  }
  btn.addEventListener('click', tryLogin);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  if (!inp.value) inp.focus();

  // Link "Já estudo em outro aparelho"
  document.getElementById('linkCodeBtn')?.addEventListener('click', () => {
    const sec = document.getElementById('link-code-section');
    if (!sec) return;
    const visible = sec.style.display !== 'none';
    sec.style.display = visible ? 'none' : 'block';
    if (!visible) document.getElementById('codeInput')?.focus();
  });

  document.getElementById('linkBtn')?.addEventListener('click', () => {
    const raw = (document.getElementById('codeInput')?.value || '').trim();
    vincularCodigo(raw);
  });

  document.getElementById('codeInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = e.target.value.trim();
      vincularCodigo(raw);
    }
  });
}

async function vincularCodigo(codigoDigitado) {
  const normalizado = normalizarCodigo(codigoDigitado);
  if (normalizado.length !== 16) {
    showAlert('Código inválido — deve ter 16 caracteres.');
    return;
  }
  if (normalizado === normalizarCodigo(getCode())) {
    showAlert('Este já é o código deste aparelho.');
    return;
  }

  const linkBtn = document.getElementById('linkBtn');
  const linkTxt = linkBtn ? linkBtn.textContent : '';
  if (linkBtn) { linkBtn.disabled = true; linkBtn.textContent = 'Buscando…'; }

  let remoto = null;
  try { remoto = await sbPull(normalizado); } catch { remoto = null; }

  if (linkBtn) { linkBtn.disabled = false; linkBtn.textContent = linkTxt || 'Vincular'; }

  if (!remoto) {
    // Sem retorno do servidor não dá para saber se o código não existe ou se o
    // progresso do outro aparelho ainda não subiu — a mensagem diz as duas coisas.
    showAlert('Não encontramos esse código na nuvem agora.\n\n'
      + 'Confira se digitou as 16 letras/números certos. Se o código é novo, o outro aparelho precisa estar online '
      + 'e sincronizado — aguarde alguns segundos e toque em Vincular de novo.');
    return;
  }

  const { nome, xp, dados } = remoto;
  const nQs = dados?.qStats ? Object.keys(dados.qStats).length : 0;
  const formatted = normalizado.match(/.{4}/g).join('-');

  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.id = 'merge-modal';
  el.innerHTML = `<div class="cmodal">
    <div class="cmodal-title">Encontramos seu progresso</div>
    <div class="cmodal-msg" style="margin-bottom:16px">
      Nome: <strong>${esc(nome)}</strong> · <strong>${xp}</strong> XP · <strong>${nQs}</strong> questões respondidas<br><br>
      O que fazer?
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn" id="merge-cloud">Usar o da nuvem (substitui este aparelho)</button>
      <button class="btn" id="merge-both">Juntar os dois (mantém o melhor de cada)</button>
      <button class="btn" id="merge-cancel">Cancelar</button>
    </div>
  </div>`;
  mountModal(el);

  el.querySelector('#merge-cancel').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });

  el.querySelector('#merge-cloud').onclick = () => {
    el.remove();
    localStorage.setItem('sl_code', formatted);
    if (dados?.qStats) { qStats = dados.qStats; localStorage.setItem(KEY.qstats, JSON.stringify(qStats)); }
    if (dados?.spaced) { spaced = dados.spaced; localStorage.setItem(KEY.spaced, JSON.stringify(spaced)); }
    if (dados?.history) localStorage.setItem(KEY.history, JSON.stringify(dados.history));
    aplicarCerts(dados?.certs);
    if (xp) localStorage.setItem('sl_xp_total', String(xp));
    if (!getStudent() && nome) saveStudent(nome);
    showAlert('✅ Progresso da nuvem aplicado!');
    if (getStudent()) { S.screen = 'modules'; }
    render();
  };

  el.querySelector('#merge-both').onclick = () => {
    el.remove();
    // Merge qStats: keep record with higher 'a'; on tie, higher 'c'
    const remoteQStats = dados?.qStats || {};
    const mergedQStats = { ...qStats };
    for (const [k, rv] of Object.entries(remoteQStats)) {
      const lv = mergedQStats[k];
      if (!lv || rv.a > lv.a || (rv.a === lv.a && rv.c > lv.c)) mergedQStats[k] = rv;
    }
    qStats = mergedQStats;
    localStorage.setItem(KEY.qstats, JSON.stringify(qStats));

    // Merge history: union by date+total
    const localHistory = getHistory();
    const seen = new Set(localHistory.map(h => `${h.date}|${h.total}`));
    const mergedHistory = [...localHistory];
    for (const h of (dados?.history || [])) {
      if (!seen.has(`${h.date}|${h.total}`)) { mergedHistory.push(h); seen.add(`${h.date}|${h.total}`); }
    }
    localStorage.setItem(KEY.history, JSON.stringify(mergedHistory));

    // Merge spaced: keep the entry with the furthest due date
    const remoteSpaced = dados?.spaced || {};
    const mergedSpaced = { ...spaced };
    for (const [k, rv] of Object.entries(remoteSpaced)) {
      if (!mergedSpaced[k] || rv.due > mergedSpaced[k].due) mergedSpaced[k] = rv;
    }
    spaced = mergedSpaced;
    localStorage.setItem(KEY.spaced, JSON.stringify(spaced));

    // Certificados: melhor nota por módulo, dos dois lados
    aplicarCerts(dados?.certs);

    // XP total: use the higher value
    const localXp = getXpTotal();
    if (xp > localXp) localStorage.setItem('sl_xp_total', String(xp));

    localStorage.setItem('sl_code', formatted);
    sbPush();
    showAlert('✅ Dados mesclados com sucesso!');
    if (!getStudent() && nome) saveStudent(nome);
    if (getStudent()) { S.screen = 'modules'; }
    render();
  };
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
  // Sem data configurada o bloco inteiro desaparece (pedido do Caique: "se não, não mostrar
  // nada na tela"). Quem configura é o 📅 da topbar; o espaço vertical fica para o conteúdo.
  if (!dStr) return '';
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

function renderPlanCard() {
  const plan = getPlan();
  if (!plan.total) return '';
  const mins  = Math.ceil(plan.total * 0.7);
  const linhas = plan.partes.map(p => `<li class="plan-item">• ${esc(p.motivo)}</li>`).join('');
  return `<div class="plan-card">
    <div class="plan-header">
      <span class="plan-title">🎯 Plano de hoje</span>
      <span class="plan-time">~${mins} min</span>
    </div>
    <ul class="plan-list">${linhas}</ul>
    <button class="btn pri" id="planBtn" style="width:100%;margin-top:12px">▶ Começar plano</button>
  </div>`;
}

function renderStart() {
  const hist    = getHistory();
  const saved   = loadProgress();
  const favCount = favorites.size;
  // Os tópicos vêm do pool REAL (Q), não de todas as questões do módulo: no M4
  // o pool é só o recorte 'cert', e listar tópicos de ENSA/SRWE abriria sessão vazia.
  const topics = [...new Set(Q.map(q => q.tp))].sort();

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
          <div class="evo-pct" style="color:${pctText(p)}">${p}%</div>
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
  const topicChips = S.startMode === 'topic' ? (() => {
    const chipHtml = t => `<div class="topic-chip${S.selectedTopic === t ? ' sel-chip' : ''}" data-tp="${esc(t)}" role="button" tabindex="0">
        <span class="topic-dot" style="background:${topicColor(t)}"></span>${esc(t)}
      </div>`;
    if (topics.length <= 12) {
      return `<p class="sec-hdr" style="margin-top:0">Escolha o tópico:</p>
    <div class="topic-sel">${topics.map(chipHtml).join('')}</div>`;
    }
    const assigned = new Set();
    let inner = '';
    for (const [area, areaTopics] of Object.entries(TOPIC_AREAS)) {
      const present = areaTopics.filter(t => topics.includes(t));
      if (!present.length) continue;
      present.forEach(t => assigned.add(t));
      inner += `<div class="topic-area-hdr">${esc(area)}</div>${present.map(chipHtml).join('')}`;
    }
    const others = topics.filter(t => !assigned.has(t));
    if (others.length) inner += `<div class="topic-area-hdr">Outros</div>${others.map(chipHtml).join('')}`;
    return `<p class="sec-hdr" style="margin-top:0">Escolha o tópico:</p>
    <div class="topic-sel">${inner}</div>`;
  })() : '';

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
  const modLabels = { 1: 'ITN', 2: 'SRWE', 3: 'ENSA', 4: '200-301 CCNA' };
  // Dentro do módulo o título é "Módulo 2 — SRWE": sem o nome do app (ele pertence à tela
  // de escolha) e sem a contagem de questões (que já aparece nos modos e nos cards).
  // A descrição do módulo vive AQUI, não na tela de escolha: é onde o aluno já entrou
  // e precisa saber o que vai estudar.
  const defAtual = MOD_DEFS.find(d => d.mod === (S.selectedMod || 0));

  // Título pelo nome do curso, sem o prefixo "Módulo N —" (pedido do Caique)
  const titleSub = S.selectedMod
    ? (defAtual ? defAtual.name : (modLabels[S.selectedMod] || ''))
    : 'Revisão Completa';
  const modDescHtml = defAtual && defAtual.desc
    ? `<p class="start-mod-desc">${esc(defAtual.desc)}</p>` : '';

  // Módulo 4 não tem seletor de escopo: aqui só entram as questões do exame 200-301.
  // ENSA e SRWE já são módulos próprios na tela anterior.

  return `<div class="start-wrap">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px">
      <button class="btn" id="modulesBtn" style="padding:3px 10px;font-size:11px" title="Voltar para a seleção de módulos" aria-label="Voltar para a seleção de módulos">←<span class="modules-btn-lbl"> Módulos</span></button>
      <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
        <button class="icon-btn" id="searchBtn" title="Gabarito (consultar resposta)" aria-label="Gabarito (consultar resposta)">🔍</button>
        <button class="icon-btn" id="glossBtn"  title="Glossário de siglas" aria-label="Glossário de siglas">📖</button>
        <button class="icon-btn" id="readyBtn"  title="Relatório de prontidão" aria-label="Relatório de prontidão">🎯</button>
        <button class="icon-btn" id="cdBtn"     title="Data da prova" aria-label="Configurar data da prova">📅</button>
        <button class="icon-btn theme-btn" title="Alternar tema claro/escuro" aria-label="Alternar tema claro/escuro">${darkMode ? '☀️' : '🌙'}</button>
      </div>
    </div>
    <div class="start-topbar">
      <div>
        <div class="module-label">CCNA v7</div>
        <h1 class="start-h">${titleSub}</h1>
      </div>
    </div>
    ${modDescHtml}

    ${renderCountdown()}
    ${resumeBanner}
    ${lastResult}
    ${renderPlanCard()}

    <p class="sec-hdr">Modo de Estudo</p>
    <div class="mode-grid">${modeCards}</div>
    ${topicChips}

    ${evoHtml}

    ${S.startMode === 'topic' ? '' : `
    <p class="sec-hdr" style="margin-top:4px">Tópicos — ${S.selectedMod ? (MOD_DEFS.find(d => d.mod === S.selectedMod) || {}).abbr || 'Módulo' : 'Revisão Completa'}</p>
    <div class="tgrid">
      ${topics.map(t => `<div class="tpill">
        <span class="tdot" style="background:${topicColor(t)}"></span>
        <span style="font-size:11px">${esc(t)}</span>
      </div>`).join('')}
    </div>`}

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
      <button class="btn" id="histBtnBottom" style="flex:1;min-width:100px" aria-label="Ver histórico">📋 Histórico</button>
      <button class="btn" id="statsBtn" style="flex:1;min-width:100px" aria-label="Estatísticas por questão">📊 Stats</button>
    </div>

    <div class="start-cta">
      <button class="btn pri" id="startBtn" style="width:100%;font-size:16px;padding:15px;border-radius:var(--radius)">
        ▶ Iniciar${S.startMode === 'timed' ? ' Prova' : S.startMode === 'topic' && S.selectedTopic ? ' — ' + S.selectedTopic : ''}
      </button>
    </div>
  </div>`;
}

function bindStart() {
  document.querySelector('.theme-btn')?.addEventListener('click', toggleTheme);

  document.getElementById('modulesBtn')?.addEventListener('click', () => { S.screen = 'modules'; render(); });

  document.getElementById('startBtn')?.addEventListener('click', startQuiz);

  document.getElementById('planBtn')?.addEventListener('click', () => {
    S.startMode = 'plan';
    S.planIds   = [];
    startQuiz();
  });

  document.getElementById('resumeBtn')?.addEventListener('click', resumeQuiz);
  document.getElementById('discardBtn')?.addEventListener('click', () => { clearProgress(); render(); });

  document.getElementById('histBtn')?.addEventListener('click', () => { S.screen = 'history'; render(); });
  document.getElementById('histBtnBottom')?.addEventListener('click', () => { S.screen = 'history'; render(); });

  document.getElementById('searchBtn')?.addEventListener('click', () => { S.screen = 'search'; render(); });
  document.getElementById('glossBtn')?.addEventListener('click', showGlossary);
  document.getElementById('readyBtn')?.addEventListener('click', showReadiness);
  document.getElementById('statsBtn')?.addEventListener('click', showQStats);

  document.getElementById('cdSet')?.addEventListener('click', promptExamDate);
  document.getElementById('cdEdit')?.addEventListener('click', promptExamDate);
  document.getElementById('cdBtn')?.addEventListener('click', promptExamDate);
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
      <div class="lv-bar" role="progressbar" aria-label="Progresso para o próximo nível" aria-valuenow="${lvPct}" aria-valuemin="0" aria-valuemax="100">
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
  <div class="pbar" role="progressbar" aria-label="Progresso da sessão" aria-valuenow="${S.qi}" aria-valuemin="0" aria-valuemax="${S.order.length}">
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
      <span class="qtag" style="background:${tagColor}22;color:var(--text);border:.5px solid ${tagColor}66;border-left:3px solid ${tagColor}">${esc(q.tp)}</span>
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
      addXpTotal(S.xp);
      if (S.correct + S.wrong > 0) saveHistory(buildHistoryEntry());
      clearProgress();
      if (getCode()) sbPush();
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

  const scoreColor = scoreColorUI(pct);
  const certBorder = scoreColor + '88';

  const certInfo  = certTipo(S.selectedMod);
  const isCert    = S.timerMode === 'timed' && pct >= CERT_MIN && [0, 1, 2, 3, 4].includes(S.selectedMod);
  const melhorPct = S.cert ? S.cert.melhor : bestCertPct(S.selectedMod);
  const recorde   = S.cert ? !!S.cert.novo : false;
  const certData = pct === 100 ? { rank: 'Mestre CCNA',    icon: '🏆', sub: 'Desempenho Perfeito!' }
    : pct >= 90              ? { rank: 'Expert em Redes',  icon: '🌟', sub: 'Resultado excepcional!' }
    : pct >= 80              ? { rank: 'CCNA Aprovado',    icon: '✅', sub: 'Pronto para o exame real!' }
    :                          { rank: 'Técnico de Redes', icon: '📡', sub: 'Aprovado no limite!' };

  const modLabel = certInfo.curso;
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
      <div class="topic-pct" style="color:${pctText(p)}">${p}%</div>
    </div>`;
  }).join('');

  const name = getStudent() || 'Aluno';

  const certInner = isCert ? `
      <div class="cert-top-label">${esc(modLabel)}</div>
      <div class="cert-icon" style="color:${scoreColor}">${certData.icon}</div>
      <div class="cert-title-sm">${esc(certInfo.titulo)}</div>
      <div class="cert-student">${esc(name)}</div>
      <div class="cert-rank" style="color:${scoreColor}">${esc(certData.rank)}</div>
      <div class="cert-sub">${esc(certData.sub)} · ${esc(datePT)}</div>
      <div class="cert-sub" style="margin-top:4px;font-weight:600">
        ${recorde
          ? '🎉 Novo recorde pessoal neste módulo'
          : (melhorPct && melhorPct > pct ? `Seu melhor neste módulo continua sendo ${melhorPct}%` : '')}
      </div>
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
  const tot  = S.correct + S.wrong;
  const pct  = tot > 0 ? Math.round(S.correct / tot * 100) : 0;
  const nome = getStudent() || 'Aluno';
  const cv   = certCanvas({ mod: S.selectedMod, pct, acertos: S.correct, erros: S.wrong, nome, dataStr: hojeISO() });
  const slug = certSlug(S.selectedMod);
  try {
    const a    = document.createElement('a');
    a.download = `certificado_${nome.replace(/\s+/g, '_')}_${slug}_${hojeISO()}.png`;
    a.href     = cv.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    showAlert('Não foi possível gerar o PNG. Tente capturar a tela manualmente.');
  }
}

function downloadCertFrom(mod, pct, acertos, total, dataStr) {
  const nome  = getStudent() || 'Aluno';
  const erros = total - acertos;
  const cv    = certCanvas({ mod, pct, acertos, erros, nome, dataStr });
  const slug  = certSlug(mod);
  const dFile = (dataStr || hojeISO()).slice(0, 10);
  try {
    const a    = document.createElement('a');
    a.download = `certificado_${nome.replace(/\s+/g, '_')}_${slug}_${dFile}.png`;
    a.href     = cv.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch {
    showAlert('Não foi possível gerar o PNG.');
  }
}

function shareCert(mod, pct, acertos, total, dataStr) {
  const nome  = getStudent() || 'Aluno';
  const erros = total - acertos;
  const cv    = certCanvas({ mod, pct, acertos, erros, nome, dataStr });
  cv.toBlob(blob => {
    const slug  = certSlug(mod);
    const dFile = (dataStr || hojeISO()).slice(0, 10);
    const file  = new File([blob], `certificado_${nome.replace(/\s+/g, '_')}_${slug}_${dFile}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'Meu certificado SubnetLab' }).catch(err => {
        if (err && err.name === 'AbortError') return;          // usuário cancelou: silêncio é correto
        downloadCertFrom(mod, pct, acertos, total, dataStr);   // sem alvo de compartilhamento: baixa o PNG
        showAlert('Não foi possível compartilhar direto neste aparelho — baixamos o PNG para você.');
      });
    } else {
      downloadCertFrom(mod, pct, acertos, total, dataStr);
      showAlert('Compartilhamento não disponível — baixamos o PNG para você.');
    }
  }, 'image/png');
}

function printCert(mod, pct, acertos, total, dataStr) {
  const nome    = getStudent() || 'Aluno';
  const erros   = total - acertos;
  const cv      = certCanvas({ mod, pct, acertos, erros, nome, dataStr });
  const dataUrl = cv.toDataURL('image/png');
  const win     = window.open('', '_blank');
  if (!win) {
    showAlert('Popup bloqueado — permita popups para imprimir o certificado.');
    return;
  }
  win.document.write(`<!DOCTYPE html><html><head><title>Certificado SubnetLab</title><style>
    *{margin:0;padding:0;box-sizing:border-box}body{background:#fff}img{width:100%;display:block}
    @media print{@page{margin:0}}
  </style></head><body><img src="${dataUrl}" onload="window.print()"></body></html>`);
  win.document.close();
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

  // Resposta do usuário (para mostrar "você marcou X" e pintar a escolha errada)
  const ua = (S.answers || {})[qKey(q)];
  const uaArr = Array.isArray(ua) ? ua : (ua === undefined || ua === null ? [] : [ua]);

  let optsHtml = '';
  if (q.ty === 'single') {
    optsHtml = q.opts.map((opt, i) => {
      const cls = i === q.cor ? 'opt correct' : (uaArr.includes(i) ? 'opt wrong' : 'opt dim');
      return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
    }).join('');
  } else if (q.ty === 'multi') {
    optsHtml = q.opts.map((opt, i) => {
      const cls = q.cor.includes(i) ? 'opt correct' : (uaArr.includes(i) ? 'opt wrong' : 'opt dim');
      return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
    }).join('');
  } else if (q.ty === 'match') {
    const uaPairs = Array.isArray(ua) ? ua : [];
    optsHtml = q.pairs.map((p, pi) => {
      const escolha = uaPairs[pi];
      const errou   = escolha && escolha !== p.r;
      return `<div class="match-row correct">
        <div class="match-left">${wrapAcronyms(esc(p.l))}</div>
        <div style="font-size:12px;color:var(--green-text)">✓ ${esc(p.r)}</div>
        ${errou ? `<div style="font-size:12px;color:var(--red-text);margin-top:4px">✗ Você associou: ${esc(escolha)}</div>` : ''}
      </div>`;
    }).join('');
  }

  // Linha "sua resposta" para single/multi
  const lettersAll = 'ABCDEFGHIJKLMNOP';
  let uaHtml = '';
  if (uaArr.length && q.ty !== 'match') {
    const acertou = q.ty === 'single' ? uaArr[0] === q.cor
                                      : uaArr.slice().sort().join() === q.cor.slice().sort().join();
    const rotulo  = uaArr.map(i => lettersAll[i]).join(', ');
    uaHtml = `<div style="margin:10px 0 2px;font-size:13px;color:var(--text2)">
      Sua resposta: <strong style="color:${acertou ? 'var(--green-text)' : 'var(--red-text)'}">${rotulo} ${acertou ? '✓' : '✗'}</strong>
    </div>`;
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
        <span class="qtag" style="background:${tagColor}22;color:var(--text);border:.5px solid ${tagColor}66;border-left:3px solid ${tagColor}">${esc(q.tp)}</span>
        <span class="qnum">#${q.id}</span>
      </div>
      <p class="qtext">${wrapAcronyms(esc(q.text))}</p>
      ${figHtml}
    </div>

    ${uaHtml}
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

// ── GABARITO / BUSCA ──────────────────────────────────────────────────
function _searchResults(q) {
  return q.length >= 2
    ? Q.filter(item =>
        item.text.toLowerCase().includes(q) ||
        (item.opts || []).some(o => o.toLowerCase().includes(q)) ||
        (item.why || '').toLowerCase().includes(q) ||
        item.tp.toLowerCase().includes(q)
      ).slice(0, 30)
    : [];
}

function renderSearch() {
  const q       = S.searchQuery.toLowerCase().trim();
  const results = _searchResults(q);

  // ── Detail / Gabarito view ──────────────────────────────────────────
  if (S.gabaritoId !== null) {
    const gq = Q.find(x => x.id === S.gabaritoId);
    if (gq) {
      const gabIdx   = results.findIndex(x => x.id === S.gabaritoId);
      const tagColor = topicColor(gq.tp);
      const letters  = 'ABCDEFGHIJKLMNOP';

      let optsHtml = '';
      if (gq.ty === 'single') {
        optsHtml = gq.opts.map((opt, i) => {
          const cls = i === gq.cor ? 'opt correct' : 'opt dim';
          return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
        }).join('');
      } else if (gq.ty === 'multi') {
        optsHtml = gq.opts.map((opt, i) => {
          const cls = gq.cor.includes(i) ? 'opt correct' : 'opt dim';
          return `<div class="${cls}"><span class="olet">${letters[i]}</span><span>${wrapAcronyms(esc(opt))}</span></div>`;
        }).join('');
      } else if (gq.ty === 'match') {
        optsHtml = gq.pairs.map(p =>
          `<div class="match-row correct">
            <div class="match-left">${wrapAcronyms(esc(p.l))}</div>
            <div style="font-size:12px;color:var(--green-text)">✓ ${esc(p.r)}</div>
          </div>`
        ).join('');
      }

      let figHtml = '';
      if (gq.code) {
        figHtml = `<pre class="qcode" aria-label="Tela de comandos da questão">${esc(gq.code)}</pre>`;
      } else if (gq.fig) {
        figHtml = `<div class="qfig" id="gab-qfig" role="button" tabindex="0" aria-label="Ampliar imagem">
          <img src="${esc(gq.fig)}" alt="${esc(gq.figAlt || '')}" decoding="async" style="max-width:100%">
        </div>`;
      }

      const whyHtml = gq.why ? `<div class="fb-why" style="margin-top:10px">
        <div class="fb-why-lbl">Explicação</div>
        ${wrapAcronyms(esc(gq.why))}
      </div>` : '';

      const prevDis = results.length === 0 || gabIdx <= 0 ? 'disabled' : '';
      const nextDis = results.length === 0 || gabIdx < 0 || gabIdx >= results.length - 1 ? 'disabled' : '';
      const counter = gabIdx >= 0 && results.length > 0 ? `${gabIdx + 1} / ${results.length}` : '';

      const navHtml = results.length > 1 ? `<div class="review-nav">
        <button class="btn" id="gabPrev" ${prevDis} aria-label="Questão anterior">← Anterior</button>
        <span class="review-ctr">${counter}</span>
        <button class="btn" id="gabNext" ${nextDis} aria-label="Próxima questão">Próxima →</button>
      </div>` : '';

      return `<div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <button class="btn" id="gabaritoBack" style="padding:5px 12px;font-size:12px" aria-label="Voltar para a busca">← Voltar para a busca</button>
          <h2 style="font-size:16px;font-weight:700">📖 Gabarito</h2>
        </div>
        <div style="position:relative;display:flex;align-items:center;margin-bottom:12px">
          <input class="search-box" id="searchInput" type="search" placeholder="Buscar questão, alternativa ou tópico…"
            value="${esc(S.searchQuery)}" autocomplete="off" aria-label="Campo de busca"
            style="flex:1;${S.searchQuery ? 'padding-right:44px' : ''}">
          ${S.searchQuery ? `<button id="clearSearch" style="position:absolute;right:0;top:0;bottom:0;width:44px;min-width:44px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text2);display:flex;align-items:center;justify-content:center" aria-label="Limpar busca">✕</button>` : ''}
        </div>
        ${navHtml}
        <div class="gabarito-badge">Somente consulta — não conta XP nem estatística</div>
        <div class="qcard">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="qtag" style="background:${tagColor}22;color:var(--text);border:.5px solid ${tagColor}66;border-left:3px solid ${tagColor}">${esc(gq.tp)}</span>
            <span class="qnum">#${gq.id}</span>
          </div>
          <p class="qtext">${wrapAcronyms(esc(gq.text))}</p>
          ${figHtml}
        </div>
        <div class="opts">${optsHtml}</div>
        ${whyHtml}
      </div>`;
    }
    // question not found — fall through to list
    S.gabaritoId = null;
  }

  // ── List view ──────────────────────────────────────────────────────
  const listHtml = results.length
    ? results.map(item => {
        const col   = topicColor(item.tp);
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
      <h2 style="font-size:16px;font-weight:700">📖 Gabarito</h2>
    </div>
    <div style="position:relative;display:flex;align-items:center;margin-bottom:0">
      <input class="search-box" id="searchInput" type="search" placeholder="Buscar questão, alternativa ou tópico…"
        value="${esc(S.searchQuery)}" autocomplete="off" aria-label="Campo de busca"
        style="flex:1;${S.searchQuery ? 'padding-right:44px' : ''}">
      ${S.searchQuery ? `<button id="clearSearch" style="position:absolute;right:0;top:0;bottom:0;width:44px;min-width:44px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text2);display:flex;align-items:center;justify-content:center" aria-label="Limpar busca">✕</button>` : ''}
    </div>
    <div id="searchResults">${listHtml}</div>
  </div>`;
}

function bindSearch() {
  // Gabarito navigation (detail view only)
  document.getElementById('gabaritoBack')?.addEventListener('click', () => { S.gabaritoId = null; render(); });

  document.getElementById('gabPrev')?.addEventListener('click', () => {
    const results = _searchResults(S.searchQuery.toLowerCase().trim());
    const idx = results.findIndex(x => x.id === S.gabaritoId);
    if (idx > 0) { S.gabaritoId = results[idx - 1].id; render(); }
  });

  document.getElementById('gabNext')?.addEventListener('click', () => {
    const results = _searchResults(S.searchQuery.toLowerCase().trim());
    const idx = results.findIndex(x => x.id === S.gabaritoId);
    if (idx >= 0 && idx < results.length - 1) { S.gabaritoId = results[idx + 1].id; render(); }
  });

  document.getElementById('gab-qfig')?.addEventListener('click', () => {
    const gq = Q.find(x => x.id === S.gabaritoId);
    if (gq?.fig) showLightbox(gq.fig, gq.figAlt);
  });

  // Acronym tooltips in detail view
  document.querySelectorAll('.acr').forEach(span => {
    span.addEventListener('click', e => {
      e.stopPropagation();
      showAlert(`${span.textContent}\n\n${span.dataset.def}`);
    });
  });

  // List view handlers
  document.getElementById('backFromSearch')?.addEventListener('click', () => { S.gabaritoId = null; S.screen = 'start'; render(); });

  document.getElementById('clearSearch')?.addEventListener('click', () => {
    S.searchQuery = '';
    S.gabaritoId = null;
    render();
  });

  const inp = document.getElementById('searchInput');
  if (inp) {
    inp.focus();
    inp.addEventListener('input', e => {
      S.searchQuery = e.target.value;
      // Leaving detail view on new input
      if (S.gabaritoId !== null) {
        S.gabaritoId = null;
        render();
        return;
      }
      const q       = S.searchQuery.toLowerCase().trim();
      const results = _searchResults(q);

      const listHtml = results.length
        ? results.map(item => {
            const c     = topicColor(item.tp);
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

      const clearBtn = document.getElementById('clearSearch');
      if (S.searchQuery && !clearBtn) {
        const wrapper = inp.parentElement;
        const btn = document.createElement('button');
        btn.id = 'clearSearch';
        btn.setAttribute('aria-label', 'Limpar busca');
        btn.style.cssText = 'position:absolute;right:0;top:0;bottom:0;width:44px;min-width:44px;background:none;border:none;cursor:pointer;font-size:16px;color:var(--text2);display:flex;align-items:center;justify-content:center';
        btn.textContent = '✕';
        btn.addEventListener('click', () => { S.searchQuery = ''; S.gabaritoId = null; render(); });
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
      if (!Q.some(x => x.id === id)) return;
      S.gabaritoId = id;
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
  mountModal(el);
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
  mountModal(el);
  el.querySelector('#confOk').onclick    = () => { el.remove(); onOk(); };
  el.querySelector('#confCancel').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
}


// ── ACESSIBILIDADE DOS MODAIS ───────────────────────────────────────
// Todo modal nasce de createElement + appendChild em body. Em vez de repetir
// atributos em vários lugares, mountModal() centraliza: role=dialog, nome
// acessível do título, foco preso dentro da caixa, Esc fecha e o foco volta
// para quem abriu. Sem isso o leitor de tela não anuncia que abriu uma janela.
function a11yModal(el) {
  const box = el.querySelector('.cmodal') || el;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  const titulo = box.querySelector('.cmodal-title');
  if (titulo) {
    if (!titulo.id) titulo.id = 'mt' + Math.random().toString(36).slice(2, 8);
    box.setAttribute('aria-labelledby', titulo.id);
  } else {
    box.setAttribute('aria-label', 'Janela');
  }
  box.setAttribute('tabindex', '-1');
  el._prevFocus = document.activeElement;

  const focaveis = () => [...box.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter(x => x.offsetParent !== null || x === document.activeElement);

  setTimeout(() => { const f = focaveis(); (f[0] || box).focus(); }, 30);

  el.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const fechar = box.querySelector('#confCancel, #notifOk, #alertOk, #rankClose, .cmodal-x');
      if (fechar) fechar.click(); else el.remove();
      return;
    }
    if (e.key === 'Tab') {
      const f = focaveis();
      if (!f.length) return;
      const primeiro = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });
}

function mountModal(el) {
  document.body.appendChild(el);
  a11yModal(el);
}

// Devolution do foco: quando o modal sai do DOM, volta para quem o abriu
new MutationObserver(muts => {
  muts.forEach(m => m.removedNodes.forEach(n => {
    if (n.nodeType === 1 && n._prevFocus && document.contains(n._prevFocus)) {
      try { n._prevFocus.focus(); } catch {}
    }
  }));
}).observe(document.body, { childList: true });

function copyFallback(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
  } catch { showAlert('Não foi possível copiar automaticamente.'); }
  document.body.removeChild(ta);
}

function showCodigoModal(allowSetSeen) {
  if (document.getElementById('code-modal-overlay')) return;
  const codigo = getCode();
  const dataStr = new Date().toLocaleDateString('pt-BR');
  const shareUrl = 'https://qi83.github.io/subnetlab/';
  const shareText = `Meu código de acesso do SubnetLab: ${codigo}\nGuarde para recuperar meu progresso em outro aparelho.\n${shareUrl}`;

  const el = document.createElement('div');
  el.className = 'code-modal-overlay';
  el.id = 'code-modal-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Seu código de acesso');
  el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;box-sizing:border-box';

  el.innerHTML = `<div class="cmodal" style="max-width:360px;width:100%">
    <div class="cmodal-title" style="font-size:17px">🔑 Seu código de acesso</div>
    <div style="text-align:center;margin:16px 0">
      <div style="font-size:22px;font-weight:700;letter-spacing:2px;padding:12px 8px;background:var(--bg2);border-radius:8px;font-family:monospace;color:var(--blue-text)">${esc(codigo)}</div>
    </div>
    <div class="cmodal-msg" style="margin-bottom:16px;font-size:13px">
      Guarde este código. É com ele que você recupera todo o seu progresso em outro celular ou computador — sem senha, sem e-mail, sem cadastro.<br><br>
      <strong>Se perder o código, não conseguimos recuperar seu histórico.</strong>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button class="btn" id="code-copy" style="flex:1" aria-label="Copiar código">📋 Copiar</button>
      <button class="btn" id="code-share" style="flex:1" aria-label="Compartilhar código">📤 Compartilhar</button>
    </div>
    <div style="margin-bottom:16px">
      <button class="btn" id="code-save" style="width:100%" aria-label="Salvar código em arquivo">⬇️ Salvar em arquivo</button>
    </div>
    <div>
      <button class="btn pri" id="code-seen" style="width:100%;font-size:14px;padding:12px" aria-label="Já guardei meu código">Já guardei meu código</button>
    </div>
  </div>`;

  mountModal(el);
  setTimeout(() => el.querySelector('#code-copy').focus(), 50);

  el.querySelector('#code-copy').onclick = () => {
    const btn = el.querySelector('#code-copy');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codigo)
        .then(() => { btn.textContent = '✓ Copiado'; setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000); })
        .catch(() => copyFallback(codigo, btn));
    } else {
      copyFallback(codigo, btn);
    }
  };

  el.querySelector('#code-share').onclick = () => {
    const btn = el.querySelector('#code-share');
    if (navigator.canShare && navigator.canShare({ text: shareText })) {
      navigator.share({ title: 'SubnetLab', text: shareText }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codigo).then(() => {
          btn.textContent = '✓ Copiado';
          setTimeout(() => { btn.textContent = '📤 Compartilhar'; }, 2000);
        }).catch(() => copyFallback(codigo, btn));
      } else {
        copyFallback(codigo, btn);
      }
      showAlert('Compartilhamento não disponível — código copiado.');
    }
  };

  el.querySelector('#code-save').onclick = () => {
    const content = [
      codigo,
      'Código de acesso SubnetLab — use para recuperar seu progresso em outro aparelho.',
      `Criado em: ${dataStr}`,
      shareUrl,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subnetlab-codigo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  el.querySelector('#code-seen').onclick = () => {
    if (allowSetSeen) localStorage.setItem('sl_code_seen', '1');
    el.remove();
    if (allowSetSeen) { S.screen = 'modules'; render(); }
  };
}

function showProfileModal() {
  if (document.getElementById('profile-modal-overlay')) return;
  const name = getStudent() || 'Estudante';
  const ini  = iniciais(name);
  const cor  = corDoNome(name);

  const el = document.createElement('div');
  el.className = 'cmodal-overlay';
  el.id = 'profile-modal-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Meu perfil');
  el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;box-sizing:border-box';

  el.innerHTML = `<div class="cmodal" style="max-width:340px;width:100%">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div class="cmodal-title">Meu perfil</div>
      <button id="profileClose" style="background:none;border:none;cursor:pointer;color:var(--text2);font-size:20px;line-height:1;padding:4px 8px" aria-label="Fechar">✕</button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px">
      <div style="width:48px;height:48px;border-radius:50%;background:${esc(cor)};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;flex-shrink:0">${esc(ini)}</div>
      <div style="font-size:16px;font-weight:600;color:var(--text)">${esc(name)}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn" id="profileChangeName" style="text-align:left;padding:12px 14px;font-size:14px">✏️ Alterar nome</button>
      <button class="btn" id="profileMyCode" style="text-align:left;padding:12px 14px;font-size:14px">🔑 Meu código de acesso</button>

      <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin:10px 0 2px">Backup do progresso</div>
      <p style="font-size:11.5px;line-height:1.5;color:var(--text3);margin:0 0 4px">
        O progresso já sobe sozinho pela nuvem. O arquivo serve para guardar uma cópia sua —
        útil se perder o código ou quiser levar sem internet.
      </p>
      <div style="display:flex;gap:8px">
        <button class="btn" id="profileExport" style="flex:1;padding:10px;font-size:13px">⬇️ Exportar</button>
        <label class="btn" style="flex:1;padding:10px;font-size:13px;cursor:pointer;text-align:center">
          ⬆️ Importar<input type="file" accept=".json" id="profileImport" style="display:none">
        </label>
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin:14px 0 4px">Meus certificados</div>
      <div id="profile-certs-list">${renderCertListHtml(getCerts())}</div>

      <button class="btn" id="profileDelete" style="text-align:left;padding:12px 14px;font-size:14px;color:var(--red-text);margin-top:10px"><span class="emoji-i">🗑</span> Apagar meus dados</button>
    </div>
  </div>`;

  mountModal(el);
  setTimeout(() => el.querySelector('#profileChangeName').focus(), 50);

  el.querySelector('#profileClose').onclick = () => el.remove();
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });

  el.querySelector('#profileExport')?.addEventListener('click', exportData);
  el.querySelector('#profileImport')?.addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) { el.remove(); importData(f); }
  });

  el.querySelector('#profileChangeName').onclick = () => {
    el.remove();
    S.screen = 'login';
    render();
  };

  el.querySelector('#profileMyCode').onclick = () => {
    el.remove();
    showCodigoModal(false);
  };

  el.querySelector('#profileDelete').onclick = () => {
    el.remove();
    const codigo = getCode();
    showConfirm(
      'Apagar dados da nuvem?',
      'Isso apaga o progresso salvo na nuvem. O deste aparelho continua.',
      () => {
        showConfirm(
          'Confirmar exclusão',
          'Esta ação não pode ser desfeita. Deseja continuar?',
          async () => {
            const ok = await sbDeleteCloud(codigo);
            showAlert(ok ? '✅ Dados da nuvem apagados.' : '❌ Erro ao apagar. Tente novamente.');
          }
        );
      }
    );
  };

  // Cert list: delegate clicks on the container so it still works after innerHTML refresh
  const certsList = el.querySelector('#profile-certs-list');
  if (certsList) {
    certsList.addEventListener('click', e => {
      const row = e.target.closest('.cert-list-row');
      if (!row) return;
      const mod     = parseInt(row.dataset.mod);
      const pct     = parseInt(row.dataset.pct);
      const acertos = parseInt(row.dataset.acertos);
      const total   = parseInt(row.dataset.total);
      const dataStr = row.dataset.data;
      if (e.target.closest('.cert-list-dl'))    downloadCertFrom(mod, pct, acertos, total, dataStr);
      else if (e.target.closest('.cert-list-share')) shareCert(mod, pct, acertos, total, dataStr);
      else if (e.target.closest('.cert-list-print')) printCert(mod, pct, acertos, total, dataStr);
    });
    sbCertList(getCode()).then(cloudCerts => {
      if (cloudCerts && document.body.contains(certsList)) {
        certsList.innerHTML = renderCertListHtml(mergeCerts(getCerts(), cloudCerts));
      }
    });
  }
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
  mountModal(el);
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
  mountModal(el);
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
  mountModal(el);

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
    mountModal(el);
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
        <span class="ready-tp-pct" style="color:${pctText(x.pct)}">${x.pct}%</span>
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

  mountModal(el);
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
            <span class="qstat-pct" style="color:${pctText(pct)}">${pct}%</span>
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

  mountModal(el);
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
  if (!('serviceWorker' in navigator)) return;

  // updateViaCache:'none' impede o navegador de servir o sw.js do cache HTTP —
  // sem isso, o aluno pode ficar dias preso na versão antiga após um deploy.
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
    .then(reg => {
      // Procura atualização a cada abertura do app
      reg.update().catch(() => {});
      // Quando um SW novo assume, recarrega uma vez para aplicar o código novo
      reg.addEventListener('updatefound', () => {
        const novo = reg.installing;
        if (!novo) return;
        novo.addEventListener('statechange', () => {
          if (novo.state === 'activated' && navigator.serviceWorker.controller) {
            if (!sessionStorage.getItem('sl_reloaded_for_sw')) {
              sessionStorage.setItem('sl_reloaded_for_sw', '1');
              location.reload();
            }
          }
        });
      });
    })
    .catch(err => console.warn('SW: falha no registro', err));
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

  // Silent background sync on boot — does not block first render
  if (getCode()) syncPullMerge();

  window.addEventListener('online', () => { if (getCode()) sbPush(); });

  // Auto-sync when user returns to the tab/window (throttled, never during quiz)
  function _maybeAutoSync() {
    if (S.screen === 'quiz') return;
    const now = Date.now();
    if (now - _lastAutoSync < 20000) return;
    _lastAutoSync = now;
    syncPullMerge();
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') _maybeAutoSync(); });
  window.addEventListener('focus', _maybeAutoSync);

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
    mountModal(el);
    setTimeout(() => el.remove(), 4000);
  });
});
