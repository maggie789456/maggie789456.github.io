const state = {
  page: "home",
  category: "shirt",
  platform: "generic",
  keywordData: null,
  titleRules: null,
  imageRules: null,
  config: null,
  keywordPage: 1,
  keywordPageSize: 12
};

const DIMENSIONS = {
  category: "品类(Category)",
  pattern: "图案/花色(Pattern)",
  occasion: "场景(Occasion)",
  pack_set: "套装规格(Pack/Set)",
  season: "季节(Season)",
  fit: "版型(Fit)",
  target: "目标人群(Target)",
  detail: "细节(Detail)",
  waist: "腰型(Waist)",
  sleeve: "袖长(Sleeve)",
  length: "长度(Length)",
  closure: "闭合方式(Closure)",
  material: "面料/材质(Material)",
  neckline: "领型(Neckline)",
  color: "颜色(Color)",
  style: "风格(Style)",
  feature: "功能特性(Feature)"
};

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

async function loadData(){
  try{
    const [k,r,i,c] = await Promise.all([
      fetch("./data/keyword_library.json").then(x=>x.json()),
      fetch("./data/title_rules.json").then(x=>x.json()),
      fetch("./data/image_rules.json").then(x=>x.json()),
      fetch("./data/product_optimizer_config.json").then(x=>x.json())
    ]);
    state.keywordData=k; state.titleRules=r; state.imageRules=i; state.config=c;
    $("#keywordCount").textContent = k.keywords.length;
    initTitleForm();
    initKeywordTable();
    renderRecent();
  }catch(err){
    console.error(err);
    showToast("数据加载失败，请确认 data 文件夹已上传。");
  }
}

function showToast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.classList.remove("show"),2200);
}

function go(page){
  state.page=page;
  $$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const names={home:"工作台",title:"标题优化",analyze:"标题诊断",keywords:"关键词库",image:"图片优化"};
  $("#pageTitle").textContent=names[page]||"工作台";
  window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click", e=>{
  const goEl=e.target.closest("[data-go]");
  if(goEl){ go(goEl.dataset.go); return; }
  const nav=e.target.closest(".nav-item");
  if(nav){ go(nav.dataset.page); return; }
});

function initTitleForm(){
  $$("#categorySwitch .category-card").forEach(btn=>{
    btn.onclick=()=>{
      state.category=btn.dataset.category;
      $$("#categorySwitch .category-card").forEach(x=>x.classList.toggle("active",x===btn));
      renderAttributeFields();
      renderRuleFlow();
      clearTitleResult();
    };
  });
  $$("#platformSwitch .platform").forEach(btn=>{
    btn.onclick=()=>{
      state.platform=btn.dataset.platform;
      $$("#platformSwitch .platform").forEach(x=>x.classList.toggle("active",x===btn));
    };
  });
  renderAttributeFields();
  renderRuleFlow();
}

function getRule(){
  return state.titleRules?.category_rules?.[state.category];
}

function keywordOptionsForDimension(dimension){
  const label = DIMENSIONS[dimension] || dimension;
  return (state.keywordData?.keywords||[]).filter(k=>k.dimension===label);
}

function renderAttributeFields(){
  const rule=getRule();
  if(!rule) return;
  const order = [...(rule.required||[]),...(rule.high_priority_supplements||[]),...(rule.optional_extensions||[])];
  const seen=new Set();
  const fields=[];
  order.forEach(x=>{
    const dimName=x.dimension;
    if(seen.has(dimName)) return;
    seen.add(dimName);
    const key=Object.keys(DIMENSIONS).find(k=>DIMENSIONS[k]===dimName);
    if(!key) return;
    const opts=keywordOptionsForDimension(key);
    fields.push({key,label:dimName,opts,priority:x.priority});
  });

  $("#attributeFields").innerHTML=fields.map(f=>{
    const options=f.opts.map(o=>`<option value="${escapeHtml(o.en)}">${escapeHtml(o.en)}</option>`).join("");
    return `<div class="field">
      <label>${escapeHtml(f.label)} <span style="color:#bbb">· ${f.priority||""}</span></label>
      <select data-dim="${f.key}">
        <option value="">请选择</option>${options}
      </select>
    </div>`;
  }).join("");
}

function renderRuleFlow(){
  const rule=getRule();
  if(!rule) return;
  const all=[...(rule.required||[]),...(rule.high_priority_supplements||[]),...(rule.optional_extensions||[])];
  $("#currentRule").innerHTML=all.map(x=>{
    const key=Object.keys(DIMENSIONS).find(k=>DIMENSIONS[k]===x.dimension);
    return `<span class="rule-item">${escapeHtml(key?key:x.dimension)}</span>`;
  }).join("");
}

function collectAttributes(){
  const values={};
  $$("#attributeFields select").forEach(s=>{
    if(s.value) values[s.dataset.dim]=s.value;
  });
  return values;
}

function buildBaseTitle(attrs){
  const rule=getRule();
  const values=[];
  const seen=new Set();
  const ordered=[...(rule.required||[]),...(rule.high_priority_supplements||[]),...(rule.optional_extensions||[])];
  for(const item of ordered){
    const key=Object.keys(DIMENSIONS).find(k=>DIMENSIONS[k]===item.dimension);
    if(key && attrs[key] && !seen.has(attrs[key])){
      values.push({key,value:attrs[key],label:item.dimension,priority:item.priority});
      seen.add(attrs[key]);
    }
  }
  // Put category first and make a natural English title.
  const parts=[];
  const category=attrs.category || (state.category==="shirt"?"Shirt":"Jacket");
  if(state.category==="shirt"){
    const audience = attrs.target ? attrs.target + " " : "Men's ";
    parts.push(audience + category);
    ["pattern","neckline","occasion","sleeve","style","material","closure","color"].forEach(k=>{
      if(attrs[k] && !parts.some(p=>p.toLowerCase()===attrs[k].toLowerCase())) parts.push(attrs[k]);
    });
  }else{
    const audience = attrs.target ? attrs.target + " " : "Men's ";
    parts.push(audience + category);
    ["occasion","closure","season","fit","style","material","feature","color","neckline","detail"].forEach(k=>{
      if(attrs[k]) parts.push(attrs[k]);
    });
  }
  let title=parts.join(" ");
  // Light grammar cleanup
  title=title.replace(/\s+/g," ").trim();
  return {title, values};
}

function platformLimit(){
  const p=state.titleRules?.platforms?.[state.platform];
  return p?.max_length_default || 140;
}

function scoreTitle(title, attrs){
  const rule=getRule();
  const total=Object.keys(attrs).filter(Boolean).length;
  const required=(rule.required||[]).map(x=>Object.keys(DIMENSIONS).find(k=>DIMENSIONS[k]===x.dimension)).filter(Boolean);
  const requiredHit=required.filter(k=>attrs[k]).length;
  let score=50;
  score += Math.min(24, requiredHit*8);
  score += Math.min(18, Math.max(0,total-requiredHit)*4);
  const len=title.length, limit=platformLimit();
  if(len<=limit) score+=8; else score-=Math.min(18,Math.ceil((len-limit)/5));
  if(/\b(best|cheap|free|newest|guaranteed)\b/i.test(title)) score-=8;
  return Math.max(0,Math.min(100,score));
}

function variantsFromBase(base){
  const clean=base.replace(/\s+/g," ").trim();
  const words=clean.split(" ");
  const unique=[...new Set(words)];
  const candidates=[
    clean,
    reorderForReadability(clean),
    unique.slice(0,Math.min(unique.length,11)).join(" ")
  ];
  return [...new Set(candidates)].slice(0,3);
}

function reorderForReadability(t){
  return t.replace(/\s+/g," ").trim();
}

function generateTitle(){
  const attrs=collectAttributes();
  if(!attrs.category){
    showToast("请至少选择「品类」后再生成。"); return;
  }
  const {title,values}=buildBaseTitle(attrs);
  const notes=$("#productNotes").value.trim();
  const candidates=variantsFromBase(title);
  const scored=candidates.map((x,i)=>({title:x,score:scoreTitle(x,attrs),primary:i===0}));
  renderTitleResults(scored,values);
  saveHistory(scored[0], attrs);
  showToast("标题已生成。");
}

function renderTitleResults(results,values){
  const max=Math.max(...results.map(x=>x.score));
  $("#scoreValue").textContent=max;
  $("#resultHint").textContent=`已生成 ${results.length} 个候选标题`;
  $("#titleResults").className="title-results";
  $("#titleResults").innerHTML=results.map((r,i)=>`
    <div class="result-card ${i===0?"primary":""}">
      <div class="result-card-top"><span class="result-label">${i===0?"推荐标题":"候选标题 "+(i+1)}</span><span style="font-size:10px;color:${r.score>=80?"#1f9d62":"#d87846"};font-weight:800">${r.score}</span></div>
      <h3>${escapeHtml(r.title)}</h3>
      <div class="result-actions">
        <button class="small-btn copy-title" data-title="${escapeAttr(r.title)}">复制标题</button>
        <button class="small-btn diagnose-title" data-title="${escapeAttr(r.title)}">诊断</button>
      </div>
    </div>
  `).join("");
  $("#structureBox").classList.remove("hidden");
  $("#structureTags").innerHTML=values.map(v=>`<span class="tag">${escapeHtml(v.key)} · ${escapeHtml(v.value)}</span>`).join("");
  $$(".copy-title").forEach(b=>b.onclick=()=>copyText(b.dataset.title));
  $$(".diagnose-title").forEach(b=>b.onclick=()=>{
    $("#analyzeInput").value=b.dataset.title;
    go("analyze"); runAnalyze();
  });
}

function clearTitleResult(){
  $("#titleResults").className="title-results empty-state";
  $("#titleResults").innerHTML=`<div class="empty-icon">T</div><h3>等待生成</h3><p>选择商品属性后，点击「生成标题」。</p>`;
  $("#scoreValue").textContent="—";
  $("#resultHint").textContent="填写左侧属性后生成";
  $("#structureBox").classList.add("hidden");
}

function resetTitle(){
  $$("#attributeFields select").forEach(s=>s.value="");
  $("#productNotes").value="";
  clearTitleResult();
}

$("#generateTitle").onclick=generateTitle;
$("#resetTitle").onclick=resetTitle;

function saveHistory(result, attrs){
  const history=JSON.parse(localStorage.getItem("productOptimizerHistory")||"[]");
  history.unshift({title:result.title,score:result.score,category:state.category,platform:state.platform,time:new Date().toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})});
  localStorage.setItem("productOptimizerHistory",JSON.stringify(history.slice(0,12)));
  renderRecent();
}

function renderRecent(){
  const list=$("#recentList"); if(!list)return;
  const history=JSON.parse(localStorage.getItem("productOptimizerHistory")||"[]");
  if(!history.length){
    list.innerHTML=`<div class="empty-state" style="padding:28px"><p>还没有优化记录。生成第一个标题后会显示在这里。</p></div>`;
    return;
  }
  list.innerHTML=history.slice(0,6).map(h=>`
    <div class="recent-item">
      <div class="recent-left"><div class="recent-mark">${h.category==="shirt"?"S":"J"}</div><div><b>${escapeHtml(h.title)}</b><div class="recent-meta">${h.category==="shirt"?"衬衫":"夹克外套"} · ${escapeHtml(h.platform)} · ${escapeHtml(h.time)}</div></div></div>
      <div class="recent-score">${h.score}</div>
    </div>`).join("");
}
$("#clearHistory").onclick=()=>{localStorage.removeItem("productOptimizerHistory");renderRecent();showToast("历史记录已清空。")};

function initKeywordTable(){
  const dims=[...new Set(state.keywordData.keywords.map(k=>k.dimension))];
  $("#dimensionFilter").innerHTML=`<option value="">全部维度</option>`+dims.map(d=>`<option value="${escapeAttr(d)}">${escapeHtml(d)}</option>`).join("");
  $("#keywordSearch").oninput=()=>{state.keywordPage=1;renderKeywordTable()};
  $("#dimensionFilter").onchange=()=>{state.keywordPage=1;renderKeywordTable()};
  $("#categoryKeywordFilter").onchange=()=>{state.keywordPage=1;renderKeywordTable()};
  renderKeywordTable();
}

function renderKeywordTable(){
  const q=$("#keywordSearch").value.trim().toLowerCase();
  const dim=$("#dimensionFilter").value;
  let rows=state.keywordData.keywords.filter(k=>{
    const text=[k.dimension,k.zh,k.en,(k.variants||[]).join(" ")].join(" ").toLowerCase();
    return (!q||text.includes(q))&&(!dim||k.dimension===dim);
  });
  const pageCount=Math.max(1,Math.ceil(rows.length/state.keywordPageSize));
  state.keywordPage=Math.min(state.keywordPage,pageCount);
  const start=(state.keywordPage-1)*state.keywordPageSize;
  const pageRows=rows.slice(start,start+state.keywordPageSize);
  $("#keywordResultCount").textContent=rows.length;
  $("#keywordTable").innerHTML=pageRows.map(k=>`
    <tr>
      <td><span class="dim-pill">${escapeHtml(k.dimension)}</span></td>
      <td>${escapeHtml(k.zh)}</td>
      <td><b>${escapeHtml(k.en)}</b></td>
      <td class="variants">${escapeHtml((k.variants||[]).join(" / ")||"—")}</td>
    </tr>`).join("");
  $("#keywordPagination").innerHTML=Array.from({length:pageCount},(_,i)=>`<button class="page-btn ${i+1===state.keywordPage?"active":""}" data-page="${i+1}">${i+1}</button>`).join("");
  $$("#keywordPagination .page-btn").forEach(b=>b.onclick=()=>{state.keywordPage=Number(b.dataset.page);renderKeywordTable();});
}

$("#useDemoTitle").onclick=()=>{
  $("#analyzeInput").value="Men's Striped Button Down Shirt Long Sleeve Casual Business Cotton Blue";
};
$("#runAnalyze").onclick=runAnalyze;

function runAnalyze(){
  const title=$("#analyzeInput").value.trim();
  if(!title){showToast("请先输入标题。");return;}
  const lower=title.toLowerCase();
  const checks=[
    {key:"category",name:"品类",dims:["品类(Category)"]},
    {key:"pattern",name:"图案/花色",dims:["图案/花色(Pattern)"]},
    {key:"neckline",name:"领型",dims:["领型(Neckline)"]},
    {key:"occasion",name:"场景",dims:["场景(Occasion)"]},
    {key:"sleeve",name:"袖长",dims:["袖长(Sleeve)"]},
    {key:"style",name:"风格",dims:["风格(Style)"]},
    {key:"material",name:"面料",dims:["面料/材质(Material)"]},
    {key:"closure",name:"闭合方式",dims:["闭合方式(Closure)"]},
    {key:"color",name:"颜色",dims:["颜色(Color)"]}
  ];
  const result=checks.map(c=>{
    const words=state.keywordData.keywords.filter(k=>c.dims.includes(k.dimension));
    const hit=words.some(k=>[k.en,...(k.variants||[])].some(v=>lower.includes(v.toLowerCase())));
    return {...c,hit};
  });
  const hit=result.filter(x=>x.hit).length;
  const len=title.length;
  let score=Math.round(45+(hit/result.length)*45+(len>0&&len<=platformLimit()?10:0));
  score=Math.min(100,score);
  $("#diagnosticEmpty").classList.add("hidden");
  $("#diagnosticResult").classList.remove("hidden");
  $("#diagnosticResult").innerHTML=`
    <div class="diag-score">
      <div class="big-score">${score}</div>
      <div style="flex:1"><div class="score-label">标题健康度</div><div class="progress"><i style="width:${score}%"></i></div><div class="score-label" style="margin-top:8px">字符数 ${len} · 当前平台建议上限 ${platformLimit()}</div></div>
    </div>
    <div class="diag-grid">${result.map(r=>`<div class="diag-item"><span>${r.name}</span><span class="${r.hit?"ok":"miss"}">${r.hit?"✓ 已覆盖":"△ 待补充"}</span></div>`).join("")}</div>
    <div class="diag-advice">${score>=85?"整体信息比较完整，可以继续做语言自然度和平台规则优化。":"建议优先补充未覆盖的核心属性，尤其是品类、图案/领型、场景等，再进行AI润色。"}${len>platformLimit()?` 当前标题超过配置长度上限 ${platformLimit()}，建议缩短。`:""}</div>
  `;
}

function copyText(text){
  navigator.clipboard?.writeText(text).then(()=>showToast("标题已复制。")).catch(()=>showToast("复制失败，请手动复制。"));
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,"&#96;");}

loadData();
