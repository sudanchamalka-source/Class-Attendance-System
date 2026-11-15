/* Firestore sync + login – NEXORA TECHNOLOGY */
const FB='https://www.gstatic.com/firebasejs/10.14.1/',CFG=window.FIREBASE_CONFIG;
//#pure
const eid=x=>encodeURIComponent(String(x)).replace(/\./g,'%2E');
const localMap=D=>{const m=new Map(),r={};
 for(const k in D)if(!['s','a','f'].includes(k))r[k]=D[k];
 m.set('cfg/main',JSON.stringify(r));
 (D.s||[]).forEach(s=>m.set('students/'+eid(s.id),JSON.stringify(s)));
 for(const mo in D.a||{})for(const c in D.a[mo])for(const d in D.a[mo][c]){const v=D.a[mo][c][d];if(v&&v.length)m.set('att/'+eid(mo)+'_'+eid(c)+'_'+eid(d),JSON.stringify({mo,c,d,v}))}
 for(const mo in D.f||{})for(const c in D.f[mo]){const v=D.f[mo][c];if(v&&Object.keys(v).length)m.set('fees/'+eid(mo)+'_'+eid(c),JSON.stringify({mo,c,v}))}
 return m};
const build=remote=>{let nd={};try{nd=JSON.parse(remote.get('cfg/main')||'{}')}catch(e){}
 nd.s=[];nd.a={};nd.f={};
 remote.forEach((j,k)=>{try{const o=JSON.parse(j);
  if(k.startsWith('students/'))nd.s.push(o);
  else if(k.startsWith('att/')){nd.a[o.mo]=nd.a[o.mo]||{};nd.a[o.mo][o.c]=nd.a[o.mo][o.c]||{};nd.a[o.mo][o.c][o.d]=o.v}
  else if(k.startsWith('fees/')){nd.f[o.mo]=nd.f[o.mo]||{};nd.f[o.mo][o.c]=o.v}}catch(e){}});
 nd.s.sort((x,y)=>String(x.id).localeCompare(String(y.id),undefined,{numeric:true}));return nd};
//#endpure
const LOCK=()=>document.documentElement.classList;
let au=null,deny='',failed=false;
(async()=>{
if(!CFG||!CFG.apiKey||/^YOUR/i.test(CFG.apiKey)){console.info('Cloud/login off: firebase-config.js සකසා නැත');return}
const css=document.createElement('style');css.textContent=`#lg{position:fixed;inset:0;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;overflow:auto;background:linear-gradient(160deg,#14246a,#1f4fd8);font-family:"Poppins","Yaldevi","Noto Sans Sinhala",system-ui,sans-serif}
#lg .lc{width:min(400px,100%);background:#fff;color:#14246a;border-radius:20px;border-top:6px solid #ffd21f;padding:26px 22px;box-shadow:0 20px 60px #0006;box-sizing:border-box}
#lg .lo{width:72px;height:72px;margin:0 auto 10px;border-radius:50%;background:#ffd21f;border:4px solid #14246a;display:grid;place-items:center;font-size:34px;overflow:hidden}#lg .lo img{width:100%;height:100%;object-fit:cover}
#lg h2{margin:0;text-align:center;font-size:20px}#lg p{margin:2px 0 14px;text-align:center;color:#6b7490;font-size:13px}
#lg label{display:block;font-weight:600;font-size:14px;margin-top:12px}
#lg input{width:100%;box-sizing:border-box;border:1px solid #cfd6ee;border-radius:12px;padding:13px 14px;font:inherit;font-size:16px;margin-top:6px;background:#fff;color:#14246a}
#lg .pw{position:relative}#lg .pw button{position:absolute;right:4px;top:6px;border:0;background:none;font-size:18px;padding:8px;cursor:pointer}
#lg .go{width:100%;margin-top:18px;border:0;border-radius:12px;background:#1f4fd8;color:#fff;font:700 16px inherit;font-family:inherit;padding:14px;cursor:pointer}#lg .go:disabled{opacity:.6}
#lg .fp{display:block;margin:14px auto 0;border:0;background:none;color:#1f4fd8;font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}
#lg .pb{text-align:center;margin-top:16px;color:#fff;font-size:12px;opacity:.85}`;document.head.appendChild(css);
const ft=document.querySelector('#ft'),sy=document.createElement('div'),so=document.createElement('button');
sy.style.cssText='margin-top:8px;font-size:12px';so.textContent='⎋ ඉවත් වන්න';so.hidden=true;
so.style.cssText='margin-left:8px;flex:none;border:0;border-radius:999px;padding:8px 14px;background:rgba(255,255,255,.18);color:#fff;font:600 13px inherit;font-family:inherit;cursor:pointer';
ft.append(sy);(document.querySelector('header .top')||ft).append(so);
const st=t=>sy.textContent=t+(au&&au.currentUser?' · '+au.currentUser.email:'');
const card=(inner)=>{let o=document.querySelector('#lg');if(!o){o=document.createElement('div');o.id='lg';document.body.appendChild(o)}LOCK().add('lock');
 let lo;try{lo=lg()}catch(e){lo='📚'}
 o.innerHTML='<div class="lc"><div class="lo">'+lo+'</div><h2>'+(()=>{let n='English with Sudan Sir';try{n=localStorage.getItem('esk_nm')||n}catch(e){}return n.replace(/[<>&"]/g,'')})()+'</h2><p>පරිපාලක පිවිසුම (Admin Login)</p>'+inner+'</div><div class="pb">Powered by NEXORA TECHNOLOGY</div>';return o};
let Ap,Au,Fs;
try{[Ap,Au,Fs]=await Promise.all([import(FB+'firebase-app.js'),import(FB+'firebase-auth.js'),import(FB+'firebase-firestore.js')])}
catch(e){card('<div class="ms er">⚠️ අන්තර්ජාල සම්බන්ධතාවය නැත. සම්බන්ධ වී නැවත උත්සාහ කරන්න.</div><button class="go" id="rl">නැවත උත්සාහ කරන්න</button>').querySelector('#rl').onclick=()=>location.reload();return}
const app=Ap.initializeApp(CFG),auth=Au.getAuth(app);au=auth;
const db=Fs.initializeFirestore(app,{localCache:Fs.persistentLocalCache({tabManager:Fs.persistentMultipleTabManager()})});
const COLS=['cfg','students','att','fees'];let unsubs=[],rem={},ready=false,last=new Map(),timer=null,inflight=0;
const flat=()=>{const m=new Map();COLS.forEach(c=>(rem[c]||new Map()).forEach((j,id)=>m.set(c+'/'+id,j)));return m};
function adopt(nd){D=nd;mig();try{localStorage.setItem('esk',JSON.stringify(D))}catch(e){}
 try{setLogo()}catch(e){}
 const a=document.activeElement;if(!document.querySelector('#ov')&&!stream&&!(a&&/INPUT|SELECT|TEXTAREA/.test(a.tagName)))go(S.t)}
function push(){const loc=localMap(D),ops=[];loc.forEach((j,k)=>{if(last.get(k)!==j)ops.push([k,j])});last.forEach((j,k)=>{if(!loc.has(k))ops.push([k,null])});last=loc;
 for(let i=0;i<ops.length;i+=400){const b=Fs.writeBatch(db);
  ops.slice(i,i+400).forEach(([k,j])=>{const p=k.indexOf('/'),ref=Fs.doc(db,k.slice(0,p),k.slice(p+1));j===null?b.delete(ref):b.set(ref,{j})});
  inflight++;st('⏳ සුරකිමින්...');
  b.commit().then(()=>{inflight--;if(!inflight)st('☁️ සමමුහුර්ත කළා');recon(false)}).catch(e=>{inflight--;last=flat();st('⛔ සුරැකීම අසාර්ථකයි: '+(e.code||e.message))})}}
function recon(own){if(!COLS.every(c=>rem[c]))return;const r=flat();
 if(!ready){ready=true;
  if(!r.size){last=new Map();push()}
  else{try{localStorage.setItem('esk_backup',localStorage.getItem('esk')||'')}catch(e){}last=r;adopt(build(r))}
  const o=document.querySelector('#lg');o&&o.remove();LOCK().remove('lock');
  if(!inflight)st('☁️ සමමුහුර්ත කළා');return}
 if(own||timer||inflight)return;
 const loc=localMap(D);let same=loc.size==r.size;if(same)for(const[k,j]of loc)if(r.get(k)!==j){same=false;break}
 last=r;if(!same)adopt(build(r));if(!inflight)st('☁️ සමමුහුර්ත කළා')}
function listen(){COLS.forEach(c=>unsubs.push(Fs.onSnapshot(Fs.collection(db,c),sn=>{const m=new Map();sn.forEach(d=>m.set(d.id,d.data().j));rem[c]=m;recon(sn.metadata.hasPendingWrites)},
 err=>{if(err.code=='permission-denied'){if(!deny){deny='⛔ මෙම ගිණුමට පද්ධතියට ප්‍රවේශය නැත. පරිපාලකයා සමඟ සම්බන්ධ වන්න.';Au.signOut(auth)}}else st('⛔ '+err.code)})))}
window.cloudDirty=()=>{if(!ready||!auth.currentUser)return;clearTimeout(timer);timer=setTimeout(()=>{timer=null;push()},700)};
const M={'auth/invalid-credential':'ඊමේල් හෝ මුරපදය වැරදියි.','auth/wrong-password':'ඊමේල් හෝ මුරපදය වැරදියි.','auth/user-not-found':'ඊමේල් හෝ මුරපදය වැරදියි.','auth/invalid-email':'ඊමේල් ලිපිනය වලංගු නොවේ.','auth/user-disabled':'මෙම ගිණුම අක්‍රිය කර ඇත.','auth/too-many-requests':'උත්සාහ ගණන වැඩියි. මද වේලාවකින් නැවත උත්සාහ කරන්න.','auth/network-request-failed':'අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.'};
function showLogin(m){
 const o=card('<div id="lm"></div><label>ඊමේල් ලිපිනය<input id="le" type="email" inputmode="email" autocomplete="username" autocapitalize="none" placeholder="admin@example.com"></label><label>මුරපදය<div class="pw"><input id="lp" type="password" autocomplete="current-password" placeholder="••••••••"><button type="button" id="ls" aria-label="පෙන්වන්න">👁</button></div></label><button class="go" id="lb">පිවිසෙන්න</button><button class="fp" id="lf" type="button">මුරපදය අමතකද?</button>');
 const $$o=q=>o.querySelector(q),msg=(t,ok)=>$$o('#lm').innerHTML=t?'<div class="ms '+(ok?'ok':'er')+'">'+t+'</div>':'';
 if(m)msg(m);
 $$o('#ls').onclick=()=>{const p=$$o('#lp');p.type=p.type=='password'?'text':'password'};
 const go2=()=>{const e=$$o('#le').value.trim(),p=$$o('#lp').value;if(!e||!p)return msg('ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.');const b=$$o('#lb');b.disabled=true;b.textContent='පිවිසෙමින්...';msg('');
  Au.signInWithEmailAndPassword(auth,e,p).then(()=>{msg('🔄 දත්ත පූරණය වෙමින්...',1)}).catch(x=>{msg(M[x.code]||x.code);b.disabled=false;b.textContent='පිවිසෙන්න'})};
 $$o('#lb').onclick=go2;o.onkeydown=e=>{if(e.key=='Enter')go2()};
 $$o('#lf').onclick=()=>{const e=$$o('#le').value.trim();if(!e)return msg('මුලින් ඔබේ ඊමේල් ලිපිනය ඇතුළත් කරන්න.');Au.sendPasswordResetEmail(auth,e).then(()=>msg('✔ මුරපදය ප්‍රතිසැකසුම් ලින්කුව ඊමේල් වෙත යවා ඇත. (Spam ෆෝල්ඩරයත් බලන්න)',1)).catch(x=>msg(M[x.code]||x.code))};
 setTimeout(()=>$$o('#le').focus(),50)}
so.onclick=()=>Au.signOut(auth);
Au.onAuthStateChanged(auth,u=>{
 if(u){so.hidden=false;st('🔄 සම්බන්ධ වෙමින්...');if(!unsubs.length)listen()}
 else{unsubs.forEach(f=>f());unsubs=[];rem={};ready=false;last=new Map();so.hidden=true;st('');const m=deny;deny='';showLogin(m)}});
})();
