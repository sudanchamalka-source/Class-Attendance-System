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
(async()=>{
if(!CFG||!CFG.apiKey||/^YOUR/i.test(CFG.apiKey)){console.info('Cloud sync off: firebase-config.js සකසා නැත');return}
const ft=document.querySelector('#ft'),sy=document.createElement('div'),so=document.createElement('button');
sy.style.cssText='margin-top:8px;font-size:12px';so.className='sb';so.textContent='ඉවත් වන්න (Sign out)';so.hidden=true;ft.append(sy,so);
const st=t=>sy.textContent=t;
let Ap,Au,Fs;try{[Ap,Au,Fs]=await Promise.all([import(FB+'firebase-app.js'),import(FB+'firebase-auth.js'),import(FB+'firebase-firestore.js')])}catch(e){st('⚠️ Cloud පූරණය නොවීය – දත්ත මෙම උපාංගයේ පමණක් සුරැකේ');return}
const app=Ap.initializeApp(CFG),auth=Au.getAuth(app),db=Fs.initializeFirestore(app,{localCache:Fs.persistentLocalCache({tabManager:Fs.persistentMultipleTabManager()})});
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
  if(!inflight)st('☁️ සමමුහුර්ත කළා');return}
 if(own||timer||inflight)return;
 const loc=localMap(D);let same=loc.size==r.size;if(same)for(const[k,j]of loc)if(r.get(k)!==j){same=false;break}
 last=r;if(!same)adopt(build(r));if(!inflight)st('☁️ සමමුහුර්ත කළා')}
function listen(){COLS.forEach(c=>unsubs.push(Fs.onSnapshot(Fs.collection(db,c),sn=>{const m=new Map();sn.forEach(d=>m.set(d.id,d.data().j));rem[c]=m;recon(sn.metadata.hasPendingWrites)},
 err=>st('⛔ '+(err.code=='permission-denied'?'ප්‍රවේශය නැත – ඔබේ ඊමේල් firestore.rules හි ඇතුළත් කර ඇතිදැයි බලන්න':err.code)))))}
window.cloudDirty=()=>{if(!ready||!auth.currentUser)return;clearTimeout(timer);timer=setTimeout(()=>{timer=null;push()},700)};
const M={'auth/invalid-credential':'ඊමේල් හෝ මුරපදය වැරදියි.','auth/invalid-email':'ඊමේල් ලිපිනය වලංගු නොවේ.','auth/too-many-requests':'උත්සාහ ගණන වැඩියි. මද වේලාවකින් නැවත උත්සාහ කරන්න.','auth/network-request-failed':'අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.'};
function showLogin(){if(document.querySelector('#lg'))return;const o=document.createElement('div');o.className='ov';o.id='lg';o.style.zIndex=100;
 o.innerHTML='<div class="mb"><h3>English with Sudan Sir – පිවිසෙන්න</h3><label class="ml">ඊමේල්<input id="le" class="in" type="email" autocomplete="username"></label><label class="ml" style="margin-top:10px">මුරපදය<input id="lp" class="in" type="password" autocomplete="current-password"></label><div id="lm"></div><div class="row"><button class="b bl" id="lb">පිවිසෙන්න</button></div></div>';
 document.body.appendChild(o);
 const go2=()=>{const b=o.querySelector('#lb');b.disabled=true;Au.signInWithEmailAndPassword(auth,o.querySelector('#le').value.trim(),o.querySelector('#lp').value).catch(e=>{o.querySelector('#lm').innerHTML='<div class="ms er">'+(M[e.code]||e.code)+'</div>'}).finally(()=>b.disabled=false)};
 o.querySelector('#lb').onclick=go2;o.onkeydown=e=>{if(e.key=='Enter')go2()}}
so.onclick=()=>Au.signOut(auth);
Au.onAuthStateChanged(auth,u=>{
 if(u){const o=document.querySelector('#lg');o&&o.remove();so.hidden=false;st('🔄 සම්බන්ධ වෙමින්...');if(!unsubs.length)listen()}
 else{unsubs.forEach(f=>f());unsubs=[];rem={};ready=false;so.hidden=true;st('');showLogin()}});
})();
