/* shared.js - Firebase සැකසුම්, මෙනුව සහ පොදු උපකාරක (සියලු පිටු සඳහා එකම පිටපතක්) */

const CONFIG = {
  brand: 'English with Sudan Sir',
  brandSi: 'පන්ති කළමනාකරණ පද්ධතිය',
  contactPhone: '0706562952',
  contactWhatsapp: '0716562952',
  firebase: {
    apiKey: "AIzaSyAP97Utjqx54gmf9YaMsgWSK96TGTUCuSg",
    authDomain: "class-management-system-8c1a1.firebaseapp.com",
    databaseURL: "https://class-management-system-8c1a1-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "class-management-system-8c1a1",
    storageBucket: "class-management-system-8c1a1.firebasestorage.app",
    messagingSenderId: "759521896885",
    appId: "1:759521896885:web:ab834180d9ab45968791fc",
    measurementId: "G-XZW2VLFXT2"
  }
};

firebase.initializeApp(CONFIG.firebase);
const db = firebase.database();

/* දත්ත ගබඩාවේ සුරකින්නේ ඉංග්‍රීසි යතුරු (පරණ දත්ත නොකැඩෙන ලෙස); තිරයේ පෙන්වන්නේ සිංහල */
const MONTHS = [
  ['January', 'ජනවාරි'], ['February', 'පෙබරවාරි'], ['March', 'මාර්තු'], ['April', 'අප්‍රේල්'],
  ['May', 'මැයි'], ['June', 'ජූනි'], ['July', 'ජූලි'], ['August', 'අගෝස්තු'],
  ['September', 'සැප්තැම්බර්'], ['October', 'ඔක්තෝබර්'], ['November', 'නොවැම්බර්'], ['December', 'දෙසැම්බර්']
];
const MONTH_SI = Object.fromEntries(MONTHS);
const DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
const DAY_SI = { 'Day 1': '1 වන දිනය', 'Day 2': '2 වන දිනය', 'Day 3': '3 වන දිනය', 'Day 4': '4 වන දිනය' };
const STATUS_SI = { Paid: 'ගෙවා ඇත', Pending: 'ගෙවා නැත' };

const NAV = [
  { href: 'index.html', label: 'පැමිණීම', color: '#6f95ff' },
  { href: 'students_list.html', label: 'ශිෂ්‍ය ලැයිස්තුව', color: '#ff7a73' },
  { href: 'register.html', label: 'නව ලියාපදිංචිය', color: '#4fd18b' },
  { href: 'fee.html', label: 'ගාස්තු ගෙවීම', color: '#ffa94d' },
  { href: 'admin_fees.html', label: 'පරිපාලන පුවරුව', color: '#b887ff' },
  { href: 'teacher_dashboard.html', label: 'උපකරණ පුවරුව', color: '#6f95ff' }
];

/* ---------- කුඩා උපකාරක ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const currentMonthKey = () => MONTHS[new Date().getMonth()][0];
const studentPhone = s => (s && (s.phone || s.whatsapp || s.parentPhone || s.mobile)) || '';

function formatPhone(raw) {
  let p = String(raw || '').replace(/\D/g, '');
  if (p.startsWith('0')) p = '94' + p.substring(1);
  return p;
}
function waLink(rawPhone, msg) {
  const p = formatPhone(rawPhone);
  return p ? `https://wa.me/${p}?text=${encodeURIComponent(msg)}` : '';
}

function toast(msg, type = '') {
  let box = $('toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

function fillMonths(select, withPlaceholder = false) {
  select.innerHTML = (withPlaceholder ? '<option value="">මාසය තෝරන්න</option>' : '') +
    MONTHS.map(([en, si]) => `<option value="${en}">${si}</option>`).join('');
}

function feeBadge(status) {
  if (status === 'Paid') return `<span class="badge ok">${STATUS_SI.Paid}</span>`;
  if (status === 'Pending') return `<span class="badge bad">${STATUS_SI.Pending}</span>`;
  return '<span class="badge neutral">සටහනක් නැත</span>';
}

/* ---------- ශිෂ්‍යයා සෙවීම (admin / fee / card / parent portal සියල්ලටම එකම ක්‍රමය) ---------- */
async function findStudent(rawId) {
  const id = String(rawId || '').trim();
  if (!id || /[.#$\[\]\/]/.test(id)) return null;
  let snap = await db.ref('students/' + id).once('value');
  if (snap.exists()) return { key: id, data: snap.val() };
  // යතුර auto-generated නම් 'id' ක්ෂේත්‍රයෙන් සොයන්න
  snap = await db.ref('students').orderByChild('id').equalTo(id).once('value');
  let found = null;
  snap.forEach(c => { found = { key: c.key, data: c.val() }; return true; });
  return found;
}

function renderStudentBox(el, found) {
  if (!found) { el.innerHTML = ''; return; }
  const s = found.data, m = currentMonthKey();
  const phone = studentPhone(s);
  el.innerHTML = `<div class="stubox"><dl class="kv">
    <dt>නම</dt><dd>${esc(s.name || found.key)}</dd>
    <dt>ශ්‍රේණිය</dt><dd>${esc(s.grade || '-')}</dd>
    <dt>දුරකථන</dt><dd>${phone ? esc(phone) : 'සටහන් කර නැත'}</dd>
    <dt>${MONTH_SI[m]} ගාස්තුව</dt><dd>${feeBadge(s.fees && s.fees[m])}</dd>
  </dl></div>`;
}

/* ---------- ශීර්ෂය සහ මෙනුව (එක් වරක් පමණක් ලියා ඇත) ---------- */
function mountChrome({ nav = true } = {}) {
  const page = location.pathname.split('/').pop() || 'index.html';
  const tabs = nav ? `<nav class="tabs" aria-label="ප්‍රධාන මෙනුව">${NAV.map(n =>
    `<a class="tab${n.href === page ? ' active' : ''}" href="${n.href}" style="--dot:${n.color}"${n.href === page ? ' aria-current="page"' : ''}><i></i>${n.label}</a>`
  ).join('')}</nav>` : '';
  $('chrome').innerHTML = `<header class="top"><div class="top-inner">
    <div class="brand"><img src="logo.png" alt="${CONFIG.brand} ලාංඡනය">
      <div><h1>${CONFIG.brand}</h1><p>${CONFIG.brandSi}</p></div></div>${tabs}
  </div></header>`;
}

/* ---------- සතියේ දින (සිංහල) ---------- */
const WEEKDAYS_SI = ['ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා', 'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'];

/* ---------- පැමිණීම සුරැකීම (QR ස්කෑන් කිරීම සහ පරිපාලන පුවරුව දෙකටම එකම ශ්‍රිතය) ----------
   flags = { 'Day 1': true/false, ... }  - ශිෂ්‍යයාගේ පැමිණි දින.
   සුරකින්නේ: පැමිණීම, එක් එක් දිනයේ දිනය, දවසේ සටහන (attendance_log) සහ පරණ manual_attendance */
async function saveAttendance(found, flags) {
  const now = new Date();
  const date = localDate(now);
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const weekday = WEEKDAYS_SI[now.getDay()];
  const old = found.data.attendance || {};
  const s = found.data;

  const updates = {};
  DAYS.forEach(d => {
    updates['attendance/' + d] = !!flags[d];
    if (flags[d] && !old[d]) updates['attendanceDates/' + d] = date;
    if (!flags[d]) updates['attendanceDates/' + d] = null;
  });
  await db.ref('students/' + found.key).update(updates);

  await db.ref(`manual_attendance/${date}/${found.key}`).set({
    days: { day1: !!flags['Day 1'], day2: !!flags['Day 2'], day3: !!flags['Day 3'], day4: !!flags['Day 4'] }
  });
  const days = DAYS.filter(d => flags[d]);
  const logRef = db.ref(`attendance_log/${date}/${found.key}`);
  await (days.length
    ? logRef.set({ studentId: found.key, name: s.name || '', grade: s.grade || '', days, weekday, time })
    : logRef.remove());

  found.data.attendance = { ...flags };
  return { date, time, weekday };
}

/* ---------- ගාස්තු: ගෙවිය යුතු මාස ගණනය ----------
   පළමු සටහන් වූ මාසයේ සිට මේ මාසය දක්වා ගෙවා නැති මාස "due" ලෙස ලැබේ.
   next = ඊළඟට ගෙවිය යුතු (පැරණිතම ගෙවා නැති) මාසය. */
function feePlan(fees = {}) {
  const cur = new Date().getMonth();
  let start = MONTHS.findIndex(([en]) => fees[en] === 'Paid' || fees[en] === 'Pending');
  if (start < 0 || start > cur) start = cur;
  const due = [];
  for (let i = start; i <= cur; i++) if (fees[MONTHS[i][0]] !== 'Paid') due.push(MONTHS[i][0]);
  let next = due[0] || null;
  if (!next) {                                   // මේ මාසය දක්වා සියල්ල ගෙවා ඇත - ඉදිරි මාසයක් ඉදිරියෙන් ගෙවන්නේ නම්
    for (let i = cur + 1; i < 12; i++) if (fees[MONTHS[i][0]] !== 'Paid') { next = MONTHS[i][0]; break; }
  }
  return { due, next };
}

/* ---------- QR ස්කෑනරය (පැමිණීම සහ ගාස්තු පිටු දෙකටම පොදු) ---------- */
function mountScanner(containerId, { onScan, keepOpen = false }) {
  const IDLE = 'කැමරාවෙන් QR කේතය ස්කෑන් කරන්න';
  const box = $(containerId);
  box.innerHTML = `
    <button type="button" class="btn navy block" data-cam style="margin-bottom:14px"><span>${IDLE}</span></button>
    <div class="reader-box" hidden><div id="reader"></div></div>
    <div class="upload">
      <label class="label">කැමරාව අවහිර වී ඇත්නම් QR රූපයක් උඩුගත කරන්න</label>
      <input type="file" accept="image/*">
    </div>`;
  const btn = box.querySelector('[data-cam]'), label = btn.firstElementChild;
  const wrap = box.querySelector('.reader-box'), file = box.querySelector('input[type=file]');
  let qr = null, open = false, lastText = '', lastAt = 0;
  const getQr = () => qr || (qr = new Html5Qrcode('reader'));

  // එකම කේතය තත්පර 3ක් ඇතුළත නැවත ස්කෑන් වුවහොත් නොසලකයි
  const handle = raw => {
    const text = raw.trim(), now = Date.now();
    if (text === lastText && now - lastAt < 3000) return;
    lastText = text; lastAt = now;
    onScan(text);
  };

  async function close() {
    if (qr && open) await qr.stop().catch(() => {});
    wrap.hidden = true; label.textContent = IDLE; open = false;
  }

  btn.addEventListener('click', async () => {
    if (open) return close();
    const h = location.hostname;
    if (!(location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1')) {
      return toast('කැමරාව භාවිතයට ආරක්ෂිත (https) සම්බන්ධතාවයක් අවශ්‍යයි.', 'bad');
    }
    wrap.hidden = false; label.textContent = 'කැමරාව වසන්න'; open = true;
    try {
      const cams = await Html5Qrcode.getCameras();
      if (!cams.length) { toast('කැමරාවක් හමු නොවිණි.', 'bad'); return close(); }
      const back = cams.find(c => /back|environment/i.test(c.label)) || cams[0];
      await getQr().start(back.id, { fps: 10, qrbox: { width: 220, height: 220 } }, async text => {
        if (!keepOpen) await close();
        handle(text);
      }, () => {});
    } catch (err) {
      const n = err.name || String(err);
      toast(/NotAllowed|PermissionDenied/.test(n) ? 'කැමරාවට අවසර ලබා දෙන්න (අඩවි සැකසුම් තුළ).'
        : /NotReadable|TrackStart/.test(n) ? 'කැමරාව වෙනත් යෙදුමක භාවිතයේ ඇත. එම යෙදුම් වසන්න.'
        : 'කැමරා දෝෂයක්: ' + (err.message || err), 'bad');
      close();
    }
  });

  file.addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { handle(await getQr().scanFile(f, true)); }
    catch { toast('රූපයෙන් QR කේතය කියවීමට නොහැකි විය.', 'bad'); }
    e.target.value = '';
  });

  return { close };
}
