/* Offline dashboard. All metrics are recomputed from the same filtered contact set. */
'use strict';
const DATA=JSON.parse(document.getElementById('dashboard-data').textContent);
const MONTHS={'2026-08':'Agosto','2026-09':'Setembro','2026-10':'Outubro','2026-11':'Novembro'};
const OUTCOMES=[
  {name:'Pedido realizado',short:'Pedidos',color:'#38967a',bg:'#edf7f3',ink:'#328069'},
  {name:'Avanço',short:'Avanço',color:'#4070a2',bg:'#edf3fa',ink:'#4070a2'},
  {name:'Em negociação',short:'Negociação',color:'#df9937',bg:'#fcf5e8',ink:'#b48432'},
  {name:'Em aberto',short:'Em aberto',color:'#a4afbd',bg:'#f0f3f7',ink:'#8290a2'},
  {name:'Perdido',short:'Perdido',color:'#ca7277',bg:'#fbf0f1',ink:'#b5636b'},
  {name:'Outro',short:'Outro',color:'#8b78b5',bg:'#f3eff9',ink:'#8b78b5'}
];
const TITLES={overview:['Visão geral','Entenda como os contatos avançam e o que influencia a decisão.'],outcomes:['Desfechos','Compare os resultados de cada mês e de cada origem.'],objections:['Objeções','Explore as barreiras que aparecem nas conversas comerciais.'],losses:['Perdas e outros','Entenda os encerramentos e as situações que pedem outra leitura.'],contacts:['Contatos','Explore cada oportunidade, sua análise e as evidências.']};
Object.assign(TITLES,{ads:['Anúncios','As peças atuais de Google e Meta, com propostas de alteração.'],segmentation:['Segmentação','Públicos, localizações, interesses e termos configurados, separados das ações propostas.'],landing:['Landing page','O que a página atual entrega e quais melhorias vale testar.'],commercial:['Comercial','Ações para transformar intenção em proposta e contratação.']});
TITLES.utilization=['Aproveitamento dos leads','Interação observada, confiabilidade dos dados e ações a acompanhar com a cliente.'];
TITLES.icp=['ICP e oferta','Cadastro estratégico confrontado com as conversas, com revisões propostas e evidências.'];
const PATHS={
 overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 chart:'<path d="M4 20V11m8 9V4m8 16v-6M2 21h20"/>',
 chat:'<path d="M21 11a8.5 8.5 0 0 1-9 8H5l-3 3v-6a8.5 8.5 0 0 1-1-5 9 9 0 0 1 20 0Z"/><path d="M7 9h10M7 13h6"/>',
 loss:'<path d="m4 5 6 6 4-4 7 8m-6 0h6V9M4 20h16"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m3 3a6 6 0 0 1 2 4v3"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 check:'<path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="10"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 empty:'<path d="M3 7h7l2 2h9v11H3ZM3 7V4h7l2 3"/><path d="M9 14h6"/>'
};
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normal=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]||PATHS.info}</svg>`;
const nf=new Intl.NumberFormat('pt-BR');
const percent=(n,total)=>total?((100*n/total).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%'):'0%';
const count=(rows,category)=>rows.filter(r=>r.outcome===category).length;
const byId=new Map(DATA.map(r=>[r.id,r]));
const originValues=[...new Set(DATA.map(r=>r.origin))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
TITLES.profile=['Sem perfil','Investigue incompatibilidades da demanda, separadas do resultado comercial.'];
const defaults={view:'overview',month:'',origin:'',category:'',confidence:'',profile:'',base:'',search:'',drill:null,scale:'count',group:'month',sort:'name',dir:1,page:1};
let state={...defaults};
let current=[];
let toastTimer;

function setIcons(root=document){root.querySelectorAll('[data-icon]').forEach(e=>{e.insertAdjacentHTML('afterbegin',icon(e.dataset.icon));e.removeAttribute('data-icon');});}
function empty(title,description='Experimente ampliar ou limpar os filtros para explorar outros contatos.'){
  return `<div class="empty">${icon('empty')}<strong>${esc(title)}</strong><p>${esc(description)}</p></div>`;
}
function tally(rows,kind){
  const result=new Map();
  rows.forEach(r=>{
    const items=kind==='profile'?(r.unfit?[r.fitReason]:[]):kind==='objection'?r.objections:kind==='loss'?(r.outcome==='Perdido'?[r.loss||'Causa não registrada']:[]):(r.outcome==='Outro'?[r.other]:[]);
    new Set(items).forEach(value=>result.set(value,(result.get(value)||0)+1));
  });
  return [...result.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR'));
}
function filterRows(){
  const q=normal(state.search.trim());
  return DATA.filter(r=>(!state.month||r.month===state.month)&&(!state.origin||r.origin===state.origin)&&(!state.category||r.outcome===state.category)&&(!state.confidence||r.confidence===state.confidence)&&(!state.base||r.base===state.base)&&(!state.profile||(state.profile==='unfit'?r.unfit:!r.unfit))&&(!q||normal(r.name+' '+r.code).includes(q))&&(!state.drill||(state.drill.kind==='profile'?(r.unfit&&r.fitReason===state.drill.value):state.drill.kind==='objection'?r.objections.includes(state.drill.value):state.drill.kind==='loss'?(r.outcome==='Perdido'&&(r.loss||'Causa não registrada')===state.drill.value):(r.outcome==='Outro'&&r.other===state.drill.value))));
}
function saveState(){
  const params=new URLSearchParams();
  for(const k of ['view','month','origin','category','confidence','profile','base','search','scale','group'])if(state[k]&&state[k]!==defaults[k])params.set(k,state[k]);
  if(state.view==='utilization'&&window.vesperReviewPane)params.set('review',window.vesperReviewPane);
  if(state.drill){params.set('facet',state.drill.kind);params.set('value',state.drill.value);}
  history.replaceState(null,'',params.size?'#'+params.toString():location.pathname+location.search);
}
function readState(){
  const p=new URLSearchParams(location.hash.slice(1));state={...defaults};
  if(p.has('view')&&TITLES[p.get('view')])state.view=p.get('view');
  if(p.has('month')&&MONTHS[p.get('month')])state.month=p.get('month');
  if(originValues.includes(p.get('origin')))state.origin=p.get('origin');
  if(OUTCOMES.some(c=>c.name===p.get('category')))state.category=p.get('category');
  if(['Alta','Média'].includes(p.get('confidence')))state.confidence=p.get('confidence');
  state.search=p.get('search')||'';
  if(['unfit','unknown'].includes(p.get('profile')))state.profile=p.get('profile');
  if(['Listas enviadas','Adicionado do Tintim','Vínculo recuperado'].includes(p.get('base')))state.base=p.get('base');
  if(p.get('scale')==='share')state.scale='share';
  if(p.get('group')==='origin')state.group='origin';
  if(['objection','loss','other','profile'].includes(p.get('facet'))&&p.get('value'))state.drill={kind:p.get('facet'),value:p.get('value')};
}
function update(next,options={}){
  state={...state,...next};if(!('page' in next))state.page=1;
  render();saveState();
  if(options.top)window.scrollTo({top:0,behavior:'instant'});
}
function badge(category){const c=OUTCOMES.find(o=>o.name===category);return `<span class="status" style="--status-bg:${c.bg};--status-color:${c.ink}">${esc(c.name)}</span>`;}
function confidence(r){return `<span class="confidence ${r.confidence==='Média'?'probable':''}">${r.confidence==='Média'?'Provável':'Alta confiança'}</span>`;}

function renderKpis(rows){
  const wins=count(rows,'Pedido realizado'),advance=count(rows,'Avanço'),negotiations=count(rows,'Em negociação'),losses=count(rows,'Perdido'),probable=rows.filter(r=>r.confidence==='Média').length;
  const items=[
    {label:'Contatos no recorte',number:rows.length,icon:'people',className:'',bottom:`${nf.format(probable)} vínculos prováveis`,pill:`${percent(rows.length,DATA.length)} da base`},
    {label:'Pedidos realizados',number:wins,icon:'check',className:'green',bottom:'do recorte',pill:percent(wins,rows.length)},
    {label:'Em andamento',number:advance+negotiations,icon:'chart',className:'orange',bottom:`${advance} avanços · ${negotiations} negociações`,pill:''},
    {label:'Perdas documentadas',number:losses,icon:'loss',className:'red',bottom:'do recorte',pill:percent(losses,rows.length)},
    {label:'Sem perfil confirmado',number:rows.filter(r=>r.unfit).length,icon:'info',className:'orange',bottom:'demanda atual · dimensão independente',pill:percent(rows.filter(r=>r.unfit).length,rows.length)}
  ];
  $('kpis').innerHTML=items.map((k,i)=>`<article class="kpi ${k.className}" data-kpi="${i}"><div class="kpi-top">${k.label}<span class="kpi-icon">${icon(k.icon)}</span></div><div class="kpi-number">${nf.format(k.number)}</div><div class="kpi-bottom">${k.pill?`<span class="pill">${k.pill}</span>`:''}${k.bottom}</div></article>`).join('');
}
function renderOutcomes(rows){
  const values=OUTCOMES.map(c=>({...c,n:count(rows,c.name)}));
  $('outcome-stack').innerHTML=values.filter(c=>c.n).map(c=>`<button data-action="category" data-value="${esc(c.name)}" style="width:${100*c.n/rows.length}%;background:${c.color}" title="${esc(c.name)}: ${c.n} (${percent(c.n,rows.length)})" aria-label="Filtrar ${esc(c.name)}: ${c.n} contatos"></button>`).join('');
  $('outcome-legend').innerHTML=values.map(c=>`<button class="outcome-item" data-action="category" data-value="${esc(c.name)}" aria-pressed="${state.category===c.name}"><span class="outcome-label"><span class="color-dot" style="background:${c.color}"></span>${c.short}</span><span class="outcome-value">${c.n}</span><span class="outcome-share">${percent(c.n,rows.length)} do recorte</span></button>`).join('');
}
function renderMonths(rows){
  if(!rows.length){$('monthly-chart').innerHTML=empty('Nenhum contato no recorte');return;}
  const totals=Object.keys(MONTHS).map(m=>rows.filter(r=>r.month===m).length),max=Math.max(...totals,1);
  $('monthly-chart').innerHTML=Object.entries(MONTHS).map(([m,label],i)=>{
    const group=rows.filter(r=>r.month===m),base=state.scale==='share'?group.length:max;
    return `<div class="month-row"><button class="month-name" data-action="month" data-value="${m}" title="Filtrar ${label}">${label.slice(0,3)}</button><div class="month-track">${OUTCOMES.map(c=>{
      const n=count(group,c.name),width=base?100*n/base:0;
      return n?`<button data-action="month-category" data-month="${m}" data-value="${esc(c.name)}" style="width:${width}%;background:${c.color}" title="${label} · ${esc(c.name)}: ${n} (${percent(n,group.length)})" aria-label="Filtrar ${label}, ${esc(c.name)}, ${n} contatos">${width>9?(state.scale==='share'?percent(n,group.length):n):''}</button>`:'';
    }).join('')}</div><span class="month-total">${totals[i]}</span></div>`;
  }).join('')+`<div class="month-scale"><span>0</span><span>${state.scale==='share'?'100%':max+' contatos'}</span></div>`;
}
function renderSources(rows){
  const groups=originValues.map(o=>[o,rows.filter(r=>r.origin===o).length]).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR'));
  if(!groups.length){$('source-chart').innerHTML=empty('Nenhuma origem no recorte');return;}
  $('source-chart').innerHTML=groups.map(([o,n])=>`<button class="source-row" data-action="origin" data-value="${esc(o)}" title="${esc(o)}: ${n} contatos. Clique para filtrar."><span class="source-name">${esc(o)}</span><span class="source-track"><span class="source-fill" style="width:${100*n/groups[0][1]}%"></span></span><span class="source-total">${n}</span></button>`).join('');
}
function ranking(container,rows,kind,limit=Infinity){
  const all=tally(rows,kind),items=all.slice(0,limit);
  if(!items.length){
    const title=kind==='profile'?'Nenhum caso de falta de perfil confirmado':kind==='objection'?'Nenhuma objeção explícita no recorte':kind==='loss'?'Nenhuma perda documentada no recorte':'Nenhum contato em “Outro”';
    const description=kind==='objection'?'Os textos acessíveis não registram uma barreira explícita para este grupo.':kind==='loss'?'Projetos adiados e contatos em aberto continuam separados das perdas.':'Explore outro mês ou origem para comparar as situações.';
    $(container).innerHTML=empty(title,description);return;
  }
  const denominator=kind==='profile'?rows.filter(r=>r.unfit).length:kind==='loss'?count(rows,'Perdido'):kind==='other'?count(rows,'Outro'):rows.length;
  $(container).innerHTML=items.map(([t,n])=>`<button class="rank-row ${kind}" data-action="drill" data-kind="${kind}" data-value="${esc(t)}" title="Ver os ${n} contatos deste tema"><span class="rank-head"><span class="rank-title">${esc(t)}</span><span class="rank-number">${n} <small>${percent(n,denominator)}</small></span></span><span class="rank-track"><span class="rank-fill" style="width:${100*n/items[0][1]}%"></span></span></button>`).join('');
}
function renderMatrix(rows){
  $('group-title').textContent=state.group==='month'?'mês':'origem';
  const groups=state.group==='month'?Object.keys(MONTHS).filter(m=>rows.some(r=>r.month===m)):originValues.filter(o=>rows.some(r=>r.origin===o)).sort((a,b)=>rows.filter(r=>r.origin===b).length-rows.filter(r=>r.origin===a).length);
  if(!groups.length){$('outcome-matrix').innerHTML=empty('Nenhum desfecho no recorte');return;}
  const firstHeader=state.group==='month'?'Mês':'Origem';
  $('outcome-matrix').innerHTML=`<table class="matrix"><thead><tr><th>${firstHeader}</th>${OUTCOMES.map(c=>`<th><span class="color-dot" style="background:${c.color};margin-right:5px"></span>${c.short}</th>`).join('')}<th>Total</th></tr></thead><tbody>${groups.map(g=>{
    const selected=rows.filter(r=>r[state.group]===g);
    return `<tr><td><button class="matrix-name" data-action="matrix" data-group="${state.group}" data-value="${esc(g)}">${esc(state.group==='month'?MONTHS[g]:g)}</button></td>${OUTCOMES.map(c=>{
      const n=count(selected,c.name);return `<td>${n?`<button class="matrix-value" data-action="matrix" data-group="${state.group}" data-value="${esc(g)}" data-category="${esc(c.name)}" title="Ver ${n} contatos: ${esc(c.name)} em ${esc(state.group==='month'?MONTHS[g]:g)}">${n}</button>`:'<span class="matrix-zero">—</span>'}</td>`;
    }).join('')}<td><strong>${selected.length}</strong></td></tr>`;
  }).join('')}<tr class="table-total"><td>Total</td>${OUTCOMES.map(c=>`<td>${count(rows,c.name)}</td>`).join('')}<td>${rows.length}</td></tr></tbody></table>`;
}
function renderProfile(rows){
  const bad=rows.filter(r=>r.unfit),lost=bad.filter(r=>r.outcome==='Perdido').length;
  $('profile-coverage').textContent=bad.length+' · '+percent(bad.length,rows.length)+' do recorte';
  $('profile-summary').innerHTML=`<strong>${bad.length} sem perfil</strong><span>${lost} com desfecho Perdido</span><span>${bad.length-lost} com outros desfechos</span><span>${rows.length-bad.length} sem falta de perfil confirmada</span>`;
  ranking('profile-reasons',rows,'profile');
  for(const group of ['month','origin']){
    const vals=group==='month'?Object.keys(MONTHS):originValues.filter(o=>rows.some(r=>r.origin===o));
    $('profile-'+group).innerHTML=`<table><thead><tr><th>${group==='month'?'Mês':'Origem'}</th><th>Total</th><th>Sem perfil</th><th>%</th></tr></thead><tbody>${vals.map(v=>{
      const selected=rows.filter(r=>r[group]===v),n=selected.filter(r=>r.unfit).length;
      return `<tr><td>${esc(group==='month'?MONTHS[v]:v)}</td><td>${selected.length}</td><td><button class="matrix-value" data-action="profile-group" data-group="${group}" data-value="${esc(v)}" ${n?'':'disabled'}>${n}</button></td><td>${percent(n,selected.length)}</td></tr>`;
    }).join('')}</tbody></table>`;
  }
  const origins=originValues.filter(o=>rows.some(r=>r.origin===o));
  $('profile-cross').innerHTML=origins.length?`<table class="matrix"><thead><tr><th>Origem</th>${Object.values(MONTHS).map(m=>`<th>${m}</th>`).join('')}<th>Total</th></tr></thead><tbody>${origins.map(o=>`<tr><td>${esc(o)}</td>${Object.keys(MONTHS).map(m=>{
    const n=bad.filter(r=>r.month===m&&r.origin===o).length;
    return `<td>${n?`<button class="matrix-value" data-action="profile-cross" data-month="${m}" data-value="${esc(o)}">${n}</button>`:'0'}</td>`;
  }).join('')}<td><strong>${bad.filter(r=>r.origin===o).length}</strong></td></tr>`).join('')}<tr class="table-total"><td>Total</td>${Object.keys(MONTHS).map(m=>`<td>${bad.filter(r=>r.month===m).length}</td>`).join('')}<td>${bad.length}</td></tr></tbody></table>`:empty('Nenhum contato no recorte');
}
function sortedContacts(rows){
  const order=r=>state.sort==='outcome'?OUTCOMES.findIndex(c=>c.name===r.outcome):r[state.sort];
  return [...rows].sort((a,b)=>{
    const x=order(a),y=order(b);
    return state.dir*(typeof x==='number'?x-y:String(x).localeCompare(String(y),'pt-BR',{numeric:true}));
  });
}
function renderContacts(rows){
  const sorted=sortedContacts(rows),size=15,pages=Math.max(1,Math.ceil(sorted.length/size));
  state.page=Math.max(1,Math.min(state.page,pages));
  const offset=(state.page-1)*size,items=sorted.slice(offset,offset+size);
  $('contact-count').textContent=nf.format(rows.length)+' contatos';
  $('previous').disabled=state.page===1;$('next').disabled=state.page>=pages;
  $('page-context').textContent=rows.length?`${offset+1}–${Math.min(offset+size,rows.length)} de ${nf.format(rows.length)} · página ${state.page}/${pages}`:'Nenhum contato no recorte';
  if(!items.length){$('contacts-table').innerHTML=empty('Nenhum contato encontrado');return;}
  const head=(key,label)=>`<th aria-sort="${state.sort===key?(state.dir===1?'ascending':'descending'):'none'}"><button class="sort-button" data-action="sort" data-value="${key}">${label}<span aria-hidden="true">${state.sort===key?(state.dir===1?'↑':'↓'):'↕'}</span></button></th>`;
  $('contacts-table').innerHTML=`<table><thead><tr>${head('name','Contato')}${head('month','Mês')}${head('origin','Origem')}${head('outcome','Desfecho')}<th>Vínculo</th><th><span class="sr-only">Abrir</span></th></tr></thead><tbody>${items.map(r=>{
    const initials=r.name.replace(/[^\p{L}\p{N} ]/gu,'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
    return `<tr><td><button class="contact-name" data-action="lead" data-id="${r.id}" title="Abrir análise de ${esc(r.name)}"><span class="avatar">${esc(initials)}</span><span><span class="contact-name-text">${esc(r.name)}</span><span class="contact-code">${esc(r.code||r.base)}${r.unfit?'<br><span class="profile-tag">Sem perfil · '+esc(r.fitReason)+'</span>':''}</span></span></button></td><td>${MONTHS[r.month].slice(0,3)}</td><td>${esc(r.origin)}</td><td>${badge(r.outcome)}</td><td>${confidence(r)}</td><td><button class="row-open" data-action="lead" data-id="${r.id}" aria-label="Abrir análise de ${esc(r.name)}">↗</button></td></tr>`;
  }).join('')}</tbody></table>`;
}
function render(){
  current=filterRows();
  for(const k of ['month','origin','category','confidence','profile','base','search'])if($(k).value!==state[k])$(k).value=state[k];
  document.querySelectorAll('#navigation [data-view]').forEach(b=>{if(b.dataset.view===state.view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='view-'+state.view);
  $('view-title').textContent=TITLES[state.view][0];$('view-description').textContent=TITLES[state.view][1];
  $('scope-title').textContent=(state.month?MONTHS[state.month]+' de 2026':'Todos os meses')+' · '+(state.origin||'todas as origens');
  $('filter-context').innerHTML=`<strong>${nf.format(current.length)}</strong> de ${nf.format(DATA.length)} contatos no recorte`;
  $('nav-count').textContent=current.length;
  const hasFilters=['month','origin','category','confidence','profile','base','search'].some(k=>state[k])||state.drill;
  $('reset').disabled=!hasFilters;
  $('drill-chip').hidden=!state.drill;
  if(state.drill){const labels={profile:'Motivo de falta de perfil',objection:'Objeção',loss:'Motivo de perda',other:'Situação de Outro'};$('drill-chip').innerHTML=`<div class="drill-tag"><span>${labels[state.drill.kind]}: <b>${esc(state.drill.value)}</b></span><button data-action="clear-drill" aria-label="Remover filtro de tema">×</button></div>`;}
  renderKpis(current);renderOutcomes(current);renderMonths(current);renderSources(current);
  ranking('top-objections',current,'objection',4);ranking('top-losses',current,'loss',4);
  renderMatrix(current);ranking('other-chart',current,'other');$('others-count').textContent=count(current,'Outro');
  ranking('objection-chart',current,'objection');$('objection-coverage').textContent=current.filter(r=>r.objections.length).length+' contatos com temas registrados';
  ranking('loss-chart',current,'loss');ranking('loss-other-chart',current,'other');$('loss-coverage').textContent=count(current,'Perdido')+' perdas documentadas';
  $('historical-note').hidden=!current.some(r=>r.id==='100072'&&r.outcome==='Perdido');
  renderContacts(current);
  renderProfile(current);
  if(window.renderVesperStrategy)window.renderVesperStrategy(state,current);
  for(const [id,yes] of [['scale-count',state.scale==='count'],['scale-share',state.scale==='share'],['group-month',state.group==='month'],['group-origin',state.group==='origin']])$(id).setAttribute('aria-pressed',String(yes));
}
function evidenceText(value){
  const marker={audioMessage:'Áudio sem conteúdo acessível.',imageMessage:'Imagem sem conteúdo acessível.',videoMessage:'Vídeo sem conteúdo acessível.',stickerMessage:'Figurinha sem conteúdo acessível.',unsupportedMessageType:'Anexo ou formato sem conteúdo acessível.'};
  return marker[value]||value;
}
function openLead(id){
  const r=byId.get(id);if(!r)return;
  const safe=/^vesper-leads-agosto-novembro\/conversas\/\d+\.html$/.test(r.conversation)?r.conversation:'';
  const date=value=>new Date(value).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'});
  $('lead-content').innerHTML=`<div class="dialog-header"><div><span class="eyebrow">ANÁLISE DO CONTATO</span><h2 id="lead-heading">${esc(r.name)}</h2><small>${esc(r.code||r.base)}</small></div><button class="icon-button" data-action="close-lead" aria-label="Fechar contato">${icon('close')}</button></div><div class="lead-body"><div class="lead-tags">${badge(r.outcome)}${confidence(r)}</div><p class="lead-summary">${esc(r.summary)}</p><div class="fact-grid"><div><small>MÊS ATRIBUÍDO</small><strong>${MONTHS[r.month]} de 2026</strong></div><div><small>ORIGEM ATUAL</small><strong>${esc(r.origin)}</strong></div></div>${r.loss?`<section class="lead-section"><h3>Motivo de perda</h3><p>${esc(r.loss)}</p></section>`:''}${r.other?`<section class="lead-section"><h3>Por que está em “Outro”?</h3><p>${esc(r.other)}</p></section>`:''}<section class="lead-section"><h3>Objeções e barreiras</h3>${r.objections.length?r.objections.map(t=>`<span class="topic-tag">${esc(t)}</span>`).join(''):'<p>Nenhuma objeção explícita identificada no texto acessível.</p>'}</section><section class="lead-section"><h3>Perfil da demanda</h3><p><strong>${r.unfit?'Sem perfil · '+esc(r.fitReason):'Falta de perfil não confirmada'}</strong></p><p>${esc(r.fitSummary)}</p>${r.fitEvidence.length?`<p>Evidências de perfil: ${r.fitEvidence.map(n=>`<a href="${safe}#m-${n}" target="_blank" rel="noopener">m-${n}</a>`).join(' · ')}</p>`:''}<p class="media-note">Base: ${esc(r.base)} · Origem no Tintim: ${esc(r.trackingOrigin)}</p></section><section class="lead-section"><h3>Como este vínculo foi identificado</h3><p>${esc(r.identity)}</p></section><section class="lead-section"><h3>Evidências da conversa</h3>${r.evidence.length?r.evidence.map(e=>`<article class="evidence-card"><small><span>${e.team?'Vésper':'Contato'} · ${esc(date(e.date))}</span><span>Mensagem ${e.n}</span></small><blockquote>${esc(evidenceText(e.text))}</blockquote><a href="${safe}#m-${e.n}" target="_blank" rel="noopener">Ver indicação de evidência ↗</a></article>`).join(''):'<p>Transcrições omitidas na versão pública; consulte a versão interna para verificar o histórico.</p>'}</section><p class="media-note">${r.messages} registros de mensagem · ${r.audio} áudios sem conteúdo acessível. Imagens e anexos também não foram interpretados.</p>${safe?`<a class="button primary" href="${safe}" target="_blank" rel="noopener">Abrir resumo público ${icon('arrow')}</a>`:''}<section class="lead-section"><details class="source-details"><summary>Histórico das fontes e origens</summary><ul>${r.sources.map(s=>`<li><strong>${esc(s.mes||'')} · ${esc(s.origem||'')}</strong><br>${esc(s.codigo||s.tipo||'Lista inicial')}${s.etapa?'<br>Etapa na lista: '+esc(s.etapa):''}</li>`).join('')}</ul></details></section></div>`;
  $('lead-dialog').showModal();$('lead-dialog').scrollTop=0;
}
function notify(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2600);}
function exportCurrent(){
  const headers=['Nome','Código','Mês','Origem','Desfecho','Confiança do vínculo','Resumo','Objeções','Motivo de perda','Situação de Outro','Base','Origem Tintim','Sem perfil','Motivo sem perfil','Justificativa de perfil','Conversa'];
  function cell(value){let text=String(value??'');if(/^[=+\-@\t\r]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';}
  const body=[headers,...sortedContacts(current).map(r=>[r.name,r.code,MONTHS[r.month]+' 2026',r.origin,r.outcome,r.confidence==='Média'?'Provável':'Alta confiança',r.summary,r.objections.join(' | '),r.loss,r.other,r.base,r.trackingOrigin,r.unfit?'Sim':'Não confirmado',r.fitReason,r.fitSummary,r.conversation])].map(line=>line.map(cell).join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+body],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='vesper-recorte-2026-11-17.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(current.length+' contatos exportados no recorte atual.');
}

$('origin').insertAdjacentHTML('beforeend',originValues.map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join(''));
$('category').insertAdjacentHTML('beforeend',OUTCOMES.map(c=>`<option>${esc(c.name)}</option>`).join(''));
setIcons();
for(const key of ['month','origin','category','confidence','profile','base'])$(key).addEventListener('change',e=>update({[key]:e.target.value}));
$('search').addEventListener('input',e=>update({search:e.target.value}));
$('reset').addEventListener('click',()=>update({month:'',origin:'',category:'',confidence:'',profile:'',base:'',search:'',drill:null}));
$('scale-count').addEventListener('click',()=>update({scale:'count'}));$('scale-share').addEventListener('click',()=>update({scale:'share'}));
$('group-month').addEventListener('click',()=>update({group:'month'}));$('group-origin').addEventListener('click',()=>update({group:'origin'}));
$('previous').addEventListener('click',()=>update({page:state.page-1}));$('next').addEventListener('click',()=>update({page:state.page+1}));
$('export').addEventListener('click',exportCurrent);
for(const id of ['about','method'])$(id).addEventListener('click',()=>$('method-dialog').showModal());
document.querySelector('.close-method').addEventListener('click',()=>$('method-dialog').close());
for(const id of ['lead-dialog','method-dialog'])$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();}});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();state={...defaults};render();saveState();window.scrollTo({top:0,behavior:'instant'});});
document.addEventListener('click',e=>{
  const navigation=e.target.closest('[data-view]');if(navigation){update({view:navigation.dataset.view},{top:true});return;}
  const button=e.target.closest('[data-action]');if(!button)return;
  const value=button.dataset.value;
  switch(button.dataset.action){
    case 'category':update({category:state.category===value?'':value});break;
    case 'month':update({month:state.month===value?'':value});break;
    case 'origin':update({origin:state.origin===value?'':value});break;
    case 'month-category':update({month:button.dataset.month,category:value});break;
    case 'matrix':update({[button.dataset.group]:value,category:button.dataset.category||state.category,view:'contacts'},{top:true});break;
    case 'profile-group':update({[button.dataset.group]:value,profile:'unfit',view:'contacts'},{top:true});break;
    case 'profile-cross':update({month:button.dataset.month,origin:value,profile:'unfit',view:'contacts'},{top:true});break;
    case 'drill':update({drill:{kind:button.dataset.kind,value},view:'contacts'},{top:true});break;
    case 'clear-drill':update({drill:null});break;
    case 'sort':update({sort:value,dir:state.sort===value?-state.dir:1});break;
    case 'lead':openLead(button.dataset.id);break;
    case 'close-lead':$('lead-dialog').close();break;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('search').focus();}});
window.addEventListener('hashchange',()=>{readState();render();});
readState();render();
