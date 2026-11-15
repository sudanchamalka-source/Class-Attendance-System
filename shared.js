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
