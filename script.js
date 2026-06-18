
// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── FLEXBOX PLAYGROUND ──
function updateFlex() {
  const j = document.getElementById('sel-j').value;
  const a = document.getElementById('sel-a').value;
  const d = document.getElementById('sel-d').value;
  const s = document.getElementById('flex-stage');
  s.style.justifyContent = j;
  s.style.alignItems = a;
  s.style.flexDirection = d;
  document.getElementById('lj').textContent = j;
  document.getElementById('la').textContent = a;
  document.getElementById('ld').textContent = d;
}

// ── DESIGN TABS ──
function showTab(id, el) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  el.classList.add('active');
}

// ── COPY CODE ──
function copyCode(btn, id) {
  const el = document.getElementById(id);
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'copied ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = 'copied ✓';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// ── DOM EVENT LOG ──
let evCount = 0;
function logEvent(type, desc) {
  const log = document.getElementById('ev-log');
  if (evCount === 0) log.innerHTML = '';
  evCount++;
  const time = new Date().toLocaleTimeString('th', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = document.createElement('div');
  entry.className = 'ev-entry';
  entry.innerHTML = `<span class="ev-time">${time}</span><span class="ev-name">${type}</span><span style="color:var(--muted);margin-left:8px;">${desc}</span>`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

// ── FETCH DEMO ──
async function runFetch() {
  const out = document.getElementById('fetch-result');
  out.className = 'fetch-result loading';
  out.textContent = '// กำลังโหลด...';
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    out.className = 'fetch-result success';
    out.innerHTML = formatJSON(data);
  } catch (e) {
    out.className = 'fetch-result error';
    out.textContent = `// Error: ${e.message}`;
  }
}

function formatJSON(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') return `<span class="json-str">"${obj}"</span>`;
    if (typeof obj === 'number') return `<span class="json-num">${obj}</span>`;
    if (typeof obj === 'boolean') return `<span class="json-bool">${obj}</span>`;
    return String(obj);
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(v => pad + '  ' + formatJSON(v, indent + 1));
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  const keys = Object.keys(obj);
  const items = keys.map(k => `${pad}  <span class="json-key">"${k}"</span>: ${formatJSON(obj[k], indent + 1)}`);
  return `{\n${items.join(',\n')}\n${pad}}`;
}

// ── MINI CONSOLE ──
function runConsole() {
  const input = document.getElementById('console-input');
  const out = document.getElementById('console-out');
  const code = input.value.trim();
  if (!code) return;

  const inputDiv = document.createElement('div');
  inputDiv.innerHTML = `<span class="c-prompt">›</span> <span class="c-log">${escHTML(code)}</span>`;
  out.appendChild(inputDiv);

  try {
    const origLog = console.log;
    const origWarn = console.warn;
    const logs = [];
    console.log = (...a) => { logs.push({ t: 'log', v: a }); origLog(...a); };
    console.warn = (...a) => { logs.push({ t: 'warn', v: a }); origWarn(...a); };

    const result = eval(code);
    console.log = origLog; console.warn = origWarn;

    logs.forEach(l => {
      const d = document.createElement('div');
      d.innerHTML = `<span class="${l.t === 'warn' ? 'c-warn' : 'c-out'}">← ${escHTML(l.v.map(formatVal).join(' '))}</span>`;
      out.appendChild(d);
    });

    if (result !== undefined) {
      const rd = document.createElement('div');
      rd.innerHTML = `<span class="c-out">← ${escHTML(formatVal(result))}</span>`;
      out.appendChild(rd);
    }
  } catch (e) {
    const ed = document.createElement('div');
    ed.innerHTML = `<span class="c-err">✗ ${escHTML(e.message)}</span>`;
    out.appendChild(ed);
  }

  input.value = '';
  out.scrollTop = out.scrollHeight;
}

function formatVal(v) {
  if (v === null) return 'null';
  if (v === undefined) return 'undefined';
  if (typeof v === 'object') {
    try { return JSON.stringify(v, null, 2); } catch { return String(v); }
  }
  return String(v);
}

function escHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── ACTIVE NAV & SCROLL EFFECTS ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const progressBar = document.getElementById('progress-bar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  // 1. Active Nav
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });

  // 2. Scroll Progress Bar
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";

  // 3. Scroll To Top Button Visibility
  if (scrollTopBtn) {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
}, { passive: true });
