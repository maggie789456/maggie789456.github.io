const $=(s)=>document.querySelector(s);const $$=(s)=>[...document.querySelectorAll(s)];
let notices=[],categories=[],keywords=[],rules={},product='shirt',selected={};
async function load(){
 const urls=['data/notices.json','data/category_guide.json','data/keyword_library.json','data/title_rules.json'];
 const [n,c,k,r]=await Promise.all(urls.map(u=>fetch(u).then(x=>x.json())));notices=n.notices||[];categories=c.items||[];keywords=k.items||[];rules=r.rules||{};
 const d=new Date();$('#today').textContent=d.toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'});
 renderTickers();renderCategories();renderTitle();bind();
}
function sortedNotices(){return [...notices].sort((a,b)=>String(b.date).localeCompare(String(a.date)))}
function renderTickers(){const list=sortedNotices();const hot=list.find(x=>x.type==='热搜词');const other=list.find(x=>x.type!=='热搜词');$('#hotTicker').textContent=hot?`${hot.date}｜${hot.title}：${hot.content}`:'暂无热搜词';$('#noticeTicker').textContent=other?`${other.date}｜${other.type}：${other.title}｜${other.content}`:'暂无近期通知'}
function bind(){
 $$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
 $$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCategories(b.dataset.cat)}));
 $$('.product-tab').forEach(b=>b.addEventListener('click',()=>{product=b.dataset.product;$$('.product-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderTitle()}));
 document.addEventListener('click',e=>{const btn=e.target.closest('[data-copy]');if(btn){const el=document.getElementById(btn.dataset.copy);copyText(el?el.innerText:btn.dataset.text,btn)}})
}
function go(id){$$('.page').forEach(p=>p.classList.remove('active'));$('#'+id)?.classList.add('active');$$('.nav-item').forEach(n=>n.classList.remove('active'));window.scrollTo({top:0,behavior:'smooth'})}
function renderCategories(filter='全部'){const cats=['全部',...new Set(categories.map(x=>x.category))];$('#categoryFilters').innerHTML=cats.map(x=>`<button class="filter ${x===filter?'active':''}" data-cat="${x}">${x}</button>`).join('');const arr=filter==='全部'?categories:categories.filter(x=>x.category===filter);$('#categoryList').innerHTML=arr.map((x,i)=>`<div class="path-item"><div class="path-top"><b>${x.tag}</b><span>${x.category} · ${x.season||'—'}</span></div><div class="path-text" id="path-${i}">${x.path}</div><button class="mini-copy" data-copy="path-${i}">一键复制</button></div>`).join('');$$('.filter').forEach(b=>b.addEventListener('click',()=>{renderCategories(b.dataset.cat)}))}
const dimMap={target:'目标人群(Target)',category:'品类(Category)',pattern:'图案/花色(Pattern)',neckline:'领型(Neckline)',occasion:'场景(Occasion)',sleeve:'袖长(Sleeve)',style:'风格(Style)',material:'面料/材质(Material)',closure:'闭合方式(Closure)',color:'颜色(Color)',fit:'版型(Fit)'};
function getOptions(key){return keywords.filter(x=>x.key===key)}
function renderTitle(){const rule=rules[product];if(!rule)return;selected={};$('#dimensionForm').innerHTML=rule.order.map(key=>{const arr=getOptions(key);if(!arr.length)return '';const type=rule.required.includes(key)?'required':rule.high.includes(key)?'high':'extra';const badge=type==='required'?'必选维度':type==='high'?'高优补充':'额外拓展';return `<div class="dim-block"><div class="dim-head"><b>${dimMap[key]||key}</b><span class="dim-badge ${type}">${badge}</span></div><div class="options">${arr.slice(0,60).map(o=>`<button class="opt" data-key="${key}" data-idx="${o.id}">${o.zh}<br><small>${o.en}</small></button>`).join('')}</div></div>`}).join('');$$('#dimensionForm .opt').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.key,id=+b.dataset.idx;if(selected[key]===id){delete selected[key];b.classList.remove('selected')}else{$$(`#dimensionForm .opt[data-key="${key}"]`).forEach(x=>x.classList.remove('selected'));selected[key]=id;b.classList.add('selected')}updateResult()}));updateResult()}
function chosen(key){const id=selected[key];return keywords.find(x=>x.id===id)}
function updateResult(){const rule=rules[product];let zh=[],en=[];rule.order.forEach(k=>{const x=chosen(k);if(x){zh.push(x.zh);en.push((x.variants||x.en).split(',')[0].trim())}});$('#zhOutput').textContent=zh.length?zh.join(' '):'请选择词语';$('#enOutput').textContent=en.length?en.join(' '):'Select keywords';const done=rule.order.filter(k=>selected[k]).length;const req=rule.required.filter(k=>selected[k]).length;const score=Math.min(100,Math.round(25+done/rule.order.length*55+req/rule.required.length*20));$('#score').textContent=`${score} / 100`;$('#coverage').innerHTML=rule.order.map(k=>`<span class="${selected[k]?'ok':''}">${dimMap[k]} ${selected[k]?'✓':'未选'}</span>`).join('')}
async function copyText(text,btn){try{await navigator.clipboard.writeText(text);const old=btn.innerText;btn.innerText='已复制 ✓';setTimeout(()=>btn.innerText=old,1200)}catch(e){alert('复制失败，请手动复制。')}}
load();
