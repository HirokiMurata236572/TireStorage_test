const KEY='dunlop-tags-v1';

const STAFF_KEY='dunlop-staff-v1';
let staffMembers=JSON.parse(localStorage.getItem(STAFF_KEY)||'null')||['担当者A','担当者B','担当者C','管理者'];
function saveStaff(){localStorage.setItem(STAFF_KEY,JSON.stringify(staffMembers));syncServer()}
function refreshStaffSelects(preferred=''){document.querySelectorAll('.staff-select').forEach(sel=>{let current=preferred||sel.value;sel.innerHTML='<option value="">選択してください</option>'+staffMembers.map(n=>`<option>${escapeHtml(n)}</option>`).join('');if(staffMembers.includes(current))sel.value=current});renderStaffList()}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function showStaffManager(){const input=document.getElementById('newStaffName');input.value='';refreshStaffSelects();document.getElementById('staffManager').classList.remove('hidden');input.focus()}
function renderStaffList(){const list=document.getElementById('staffList');if(!list)return;list.innerHTML=staffMembers.map((n,i)=>`<li><span>${escapeHtml(n)}</span><button type="button" class="danger small" onclick="deleteStaff(${i})">削除</button></li>`).join('')}
function deleteStaff(index){const name=staffMembers[index];if(!name)return;const used=data.some(item=>(item.history||[]).some(row=>row[3]===name));const msg=used?`「${name}」は過去の更新履歴で使用されています。\n担当者候補から削除しても、過去履歴の氏名は保持されます。削除しますか？`:`「${name}」を担当者候補から削除しますか？`;if(!confirm(msg))return;staffMembers.splice(index,1);saveStaff();refreshStaffSelects();toastMsg('担当者を削除しました')}
function addStaff(){const input=document.getElementById('newStaffName');let name=input.value.trim().replace(/\s+/g,' ');if(!name)return alert('担当者名を入力してください');if(staffMembers.some(n=>n.toLowerCase()===name.toLowerCase()))return alert('同じ担当者名がすでに登録されています');staffMembers.push(name);saveStaff();refreshStaffSelects(name);input.value='';toastMsg('担当者を追加しました')}
const seed=[{id:'TAG-A7F3C9',brand:'WINTER MAXX 03',season:'冬',width:'195',ratio:'65',rim:'15',load:'91',speed:'Q',free:4,reserved:4,sold:4,hold:0,updated:'2026/10/19 11:20',history:[['2026/10/19 11:20','ステータス変更','-4','担当者A','フリー → 売上予定'],['2026/10/19 09:10','入庫','+12','管理者','初期登録']]},{id:'TAG-B2D8E1',brand:'ENASAVE EC204',season:'夏',width:'185',ratio:'65',rim:'15',load:'88',speed:'S',free:8,reserved:0,sold:0,hold:0,updated:'2026/10/18 16:40',history:[['2026/10/18 16:40','入庫','+8','担当者B','入荷']]},{id:'TAG-C4F6A2',brand:'WINTER MAXX 03',season:'冬',width:'205',ratio:'60',rim:'16',load:'92',speed:'Q',free:0,reserved:4,sold:0,hold:0,updated:'2026/10/17 14:05',history:[['2026/10/17 14:05','ステータス変更','-4','担当者C','フリー → 売上予定']]}];
let data=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
// Older prototype histories had 4 columns: date, action, count, note.
// Migrate them once so the old note never appears in the staff column.
let historyMigrated=false;
data.forEach(item=>{item.history=(item.history||[]).map(row=>{if(row.length===4){historyMigrated=true;return [row[0],row[1],row[2],'未設定',row[3]]}return row.slice(0,5)})});
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));syncServer()};
if(historyMigrated)save();
const size=x=>`${x.width}/${x.ratio}R${x.rim}${x.load?' '+x.load:''}${x.speed||''}`; const physical=x=>+x.free + +x.reserved + +x.sold + +x.hold;
function show(page,id){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));document.querySelector('#page-'+page).classList.remove('hidden');if(page==='list')renderList();if(page==='detail')renderDetail(id);scrollTo(0,0)}
document.addEventListener('click',e=>{let b=e.target.closest('[data-page]');if(b)show(b.dataset.page,b.dataset.id);let c=e.target.closest('[data-id]');if(c&&!c.dataset.page)show('detail',c.dataset.id)});
function renderList(){let q=search.value.toLowerCase(),s=season.value,f=stockFilter.value;let rows=data.filter(x=>(x.brand+' '+size(x)+' '+x.id).toLowerCase().includes(q)&&(!s||x.season===s)&&(!f||(f==='free'?x.free>0:x.free===0)));cards.innerHTML=`<div class="list-head"><span>商品</span><span>販売可能</span><span>在庫内訳</span><span>最終更新</span><span></span></div>`+rows.map(x=>`<article class="list-row" data-id="${x.id}"><div class="list-product"><div><span class="badge">${x.season}</span><span class="muted list-id">${x.id}</span></div><strong>${x.brand}</strong><div class="list-size">${size(x)}</div></div><div class="list-free"><span class="mobile-label">販売可能</span><b>${x.free}本</b></div><div class="list-breakdown"><span>物理在庫 <b>${physical(x)}本</b></span><span>売上予定 ${x.reserved}本</span><span>売上済み ${x.sold}本</span><span>保留 ${x.hold}本</span></div><div class="list-updated"><span class="mobile-label">最終更新</span>${x.updated}</div><div class="list-arrow">›</div></article>`).join('');empty.style.display=rows.length?'none':'block'}
['search','season','stockFilter'].forEach(id=>document.getElementById(id).addEventListener('input',renderList));
newForm.onsubmit=e=>{e.preventDefault();let id='TAG-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(16).slice(0,6).toUpperCase();let now=new Date().toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});let x={id,brand:brand.value.trim(),season:newSeason.value,width:width.value,ratio:ratio.value,rim:rim.value,load:load.value.trim(),speed:speed.value.trim().toUpperCase(),free:+free.value,reserved:0,sold:0,hold:0,updated:now,history:[[now,'初期登録','+'+(+free.value),newStaff.value,'QRコード作成']]};data.unshift(x);save();newForm.reset();show('detail',id);toastMsg('QRコードと電子荷票を作成しました')};
function renderDetail(id){let x=data.find(v=>v.id===id);if(!x){show('list');return}detail.innerHTML=`<div class="detail-toolbar"><button class="secondary" data-page="list">← 一覧へ</button><button class="danger" onclick="deleteTag(\'${id}\')">電子荷票を削除</button></div><div class="hero" style="margin-top:14px"><div class="detailhead"><div><span class="badge">${x.season}</span><h1 style="margin-top:12px">${x.brand}</h1><div class="size">${size(x)}</div><div class="muted" style="color:#bbc1c8">管理番号 ${x.id}　最終更新 ${x.updated}</div></div><div><div class="qrbox" id="print-label"><div class="print-brand">${x.brand}</div><div class="print-size">${size(x)}</div><canvas id="qr"></canvas><div class="print-id">管理番号 ${x.id}</div><div class="print-guide">スマートフォンで電子荷票を表示</div></div><button class="primary print-button" onclick="printQrLabel()">QR識別票を印刷</button></div></div></div><div class="stockgrid"><div class="stockbox freebox">フリー<b>${x.free}本</b></div><div class="stockbox">売上予定・未払い<b>${x.reserved}本</b></div><div class="stockbox">売上済み・未出庫<b>${x.sold}本</b></div><div class="stockbox">販売保留<b>${x.hold}本</b></div></div><div class="panel"><b>物理在庫：${physical(x)}本</b><div class="manage"><button class="primary" onclick="adjust('${id}','in')">入庫</button><button class="secondary" onclick="adjust('${id}','out')">出庫</button><button class="secondary" onclick="adjust('${id}','reserve')">売上予定へ</button><button class="secondary" onclick="adjust('${id}','sold')">売上済みへ</button></div></div><h2>更新履歴</h2><table class="history"><thead><tr><th>日時</th><th>処理</th><th>本数</th><th>担当者</th><th>摘要</th></tr></thead><tbody>${x.history.map(h=>`<tr>${h.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;let url=location.origin+'/tag/'+encodeURIComponent(x.id);if(window.QRCode)QRCode.toCanvas(document.getElementById('qr'),url,{width:150,margin:1});}
let pendingAdjustment=null;
function adjust(id,type){
 const titles={in:'入庫',out:'出庫',reserve:'売上予定へ変更',sold:'売上済みへ変更'};
 pendingAdjustment={id,type};modalTitle.textContent=titles[type]+'の入力';modalCount.value=1;modalStaff.value='';modalNote.value='';stockModal.classList.remove('hidden');modalCount.focus();
}
modalCancel.onclick=()=>{stockModal.classList.add('hidden');pendingAdjustment=null};
modalSubmit.onclick=()=>{
 if(!pendingAdjustment)return;let {id,type}=pendingAdjustment,x=data.find(v=>v.id===id),n=+modalCount.value,staff=modalStaff.value,note=modalNote.value.trim();
 if(!Number.isInteger(n)||n<=0)return alert('1以上の整数で本数を入力してください');
 if(!staff)return alert('担当者を選択してください');
 let label='',desc='',delta='';
 if(type==='in'){x.free+=n;label='入庫';desc='フリーへ入庫';delta='+'+n}
 else if(type==='out'){if(x.sold<n)return alert('売上済み・未出庫の本数が不足しています');x.sold-=n;label='出庫';desc='売上済み在庫を出庫';delta='-'+n}
 else if(type==='reserve'){if(x.free<n)return alert('フリー在庫が不足しています');x.free-=n;x.reserved+=n;label='ステータス変更';desc='フリー → 売上予定';delta='-'+n}
 else{if(x.reserved<n)return alert('売上予定在庫が不足しています');x.reserved-=n;x.sold+=n;label='ステータス変更';desc='売上予定 → 売上済み';delta='±'+n}
 let now=new Date().toLocaleString('ja-JP');x.updated=now;x.history.unshift([now,label,delta,staff,note?desc+'／'+note:desc]);save();stockModal.classList.add('hidden');pendingAdjustment=null;renderDetail(id);toastMsg('在庫を更新しました');
}
function deleteTag(id){
 const item=data.find(x=>x.id===id);if(!item)return;
 const qty=physical(item);
 const warning=qty>0?`この電子荷票には物理在庫が${qty}本あります。\n削除すると在庫情報と更新履歴を確認できなくなります。\n\n銘柄：${item.brand}\nサイズ：${size(item)}\n\n本当に削除しますか？`:`電子荷票「${item.brand} ${size(item)}」を削除しますか？\n更新履歴も削除されます。`;
 if(!confirm(warning))return;
 if(qty>0){const typed=prompt('誤削除防止のため、管理番号を入力してください。\n'+id);if(typed!==id)return alert('管理番号が一致しないため削除を中止しました')}
 data=data.filter(x=>x.id!==id);save();location.hash='';show('list');toastMsg('電子荷票を削除しました');
}
function toastMsg(t){toast.textContent=t;toast.style.display='block';setTimeout(()=>toast.style.display='none',1800)}
document.getElementById('openStaffManager').addEventListener('click',showStaffManager);document.querySelectorAll('.add-staff-button').forEach(b=>b.addEventListener('click',showStaffManager));document.getElementById('staffManagerClose').onclick=()=>document.getElementById('staffManager').classList.add('hidden');document.getElementById('staffAddSubmit').onclick=addStaff;document.getElementById('newStaffName').addEventListener('keydown',e=>{if(e.key==='Enter')addStaff()});refreshStaffSelects();
async function syncServer(){if(location.protocol==='file:')return;try{await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({tags:data,staff:staffMembers})})}catch(e){console.error('同期失敗',e)}}
async function loadServer(){if(location.protocol==='file:')return startRoute();try{const r=await fetch('/api/state',{cache:'no-store'});if(r.ok){const v=await r.json();if(Array.isArray(v.tags)&&v.tags.length)data=v.tags;if(Array.isArray(v.staff))staffMembers=v.staff;refreshStaffSelects()}}catch(e){console.error('共有データ読込失敗',e)}startRoute()}
function startRoute(){const m=location.pathname.match(/^\/tag\/([^/]+)/);const id=m?decodeURIComponent(m[1]):location.hash.slice(1);data.some(x=>x.id===id)?show('detail',id):show('list')}
loadServer();
function printQrLabel(){document.body.classList.add('printing-qr');window.print();setTimeout(()=>document.body.classList.remove('printing-qr'),300)}
window.addEventListener('afterprint',()=>document.body.classList.remove('printing-qr'));
