/* Plano geral: todas as ações em duas colunas (Vésper e Unidcom), com filtro por pilar. Somente leitura local. */
(()=>{'use strict';
const S=JSON.parse(document.getElementById('strategy-data').textContent),q=id=>document.getElementById(id),e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),norm=x=>String(x??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const chip=(t,orange=false)=>`<span class="strategy-chip ${orange?'orange':''}">${e(t)}</span>`;
const PILLARS=['Dados e CRM','ICP e oferta','Anúncios','Segmentação','Landing page','Comercial'];
const AREA={'Dados':'Dados e CRM','Integração':'Dados e CRM','Origem':'Dados e CRM','Gestão':'Dados e CRM','Ferramenta':'Dados e CRM','Anúncios':'Anúncios','Segmentação':'Segmentação','Landing page':'Landing page','Comercial':'Comercial'};
const TAB={'Dados e CRM':'Aproveitamento','ICP e oferta':'ICP e oferta','Anúncios':'Anúncios','Segmentação':'Segmentação','Landing page':'Landing page','Comercial':'Comercial'};
const items=[
 ...S.review.actions.map(a=>({id:a.id,pillar:AREA[a.area]||'Dados e CRM',view:'utilization',open:a.id,title:a.title,priority:a.priority,party:a.party,text:a.action,extra:a.owner})),
 ...S.icpReview.actions.map(a=>({pillar:'ICP e oferta',view:'icp',title:a.title,priority:a.priority,party:a.party,text:a.action,extra:a.owner})),
 ...S.ads_actions.map(a=>({pillar:'Anúncios',view:'ads',title:a.title,priority:a.priority,party:a.party,text:a.action,extra:a.measure})),
 ...S.segmentation_actions.map(a=>({pillar:'Segmentação',view:'segmentation',title:a.title,priority:a.priority,party:a.party,text:a.action,extra:a.measure})),
 ...S.landing_actions.map(a=>({pillar:'Landing page',view:'landing',title:a.title,priority:a.priority,party:a.party,text:a.action+(a.wix?' No Wix: '+a.wix:''),extra:a.measure})),
 ...S.commercial_actions.map(a=>({pillar:'Comercial',view:'commercial',title:a.title,priority:a.priority,party:a.party,text:a.action,extra:a.measure}))
].map((a,i)=>({...a,n:i}));
const rank={P0:0,P1:1,P2:2};
let pillar='';
function visible(){const pr=q('plan-priority').value,s=q('plan-search').value;return items.filter(a=>(!pillar||a.pillar===pillar)&&(!pr||a.priority===pr)&&norm([a.title,a.text,a.id].join(' ')).includes(norm(s))).sort((x,y)=>rank[x.priority]-rank[y.priority]||PILLARS.indexOf(x.pillar)-PILLARS.indexOf(y.pillar)||x.n-y.n);}
function card(a,col){const shared=a.party==='Ambos',other=col==='Vésper'?'Unidcom':'Vésper';
 const open=a.open?`<button type="button" class="button secondary plan-open" data-review-open-action="${e(a.open)}">Abrir ação ↗</button>`:`<button type="button" class="button secondary plan-open" data-p0-view="${e(a.view)}">Abrir em ${e(TAB[a.pillar])} ↗</button>`;
 return `<article class="plan-card${a.priority==='P0'?' plan-p0':''}"><div class="plan-chips">${chip(a.priority,a.priority==='P0')}${chip(a.pillar)}${a.id?chip(a.id):''}${shared?`<span class="strategy-chip party party-ambos">Compartilhada com a ${e(other)}</span>`:''}</div><h3>${e(a.title)}</h3><details><summary>Ver a ação</summary><p>${e(a.text)}</p>${a.extra?`<p class="review-mini">${e(a.extra)}</p>`:''}</details>${open}</article>`;}
function render(){const rows=visible();
 for(const [col,id] of [['Vésper','plan-vesper'],['Unidcom','plan-unidcom']]){const mine=rows.filter(a=>a.party===col||a.party==='Ambos'),shared=mine.filter(a=>a.party==='Ambos').length;
  q(id).innerHTML=mine.map(a=>card(a,col)).join('')||'<p class="strategy-empty">Nenhuma ação para estes filtros.</p>';
  q('plan-count'+id.slice(4)).textContent=`${mine.length} ${mine.length===1?'ação':'ações'} · ${mine.filter(a=>a.priority==='P0').length} P0 · ${shared} compartilhadas`;}
 const only=col=>rows.filter(a=>a.party===col).length;
 q('plan-context').textContent=`${rows.length} de ${items.length} ações no recorte: ${only('Vésper')} só da Vésper, ${only('Unidcom')} só da Unidcom e ${rows.filter(a=>a.party==='Ambos').length} compartilhadas (aparecem nas duas colunas).`;
 q('plan-pillars').innerHTML=[['','Todos',items.length],...PILLARS.map(p=>[p,p,items.filter(a=>a.pillar===p).length])].map(([v,l,n])=>`<button type="button" class="plan-pillar" data-plan-pillar="${e(v)}" aria-pressed="${pillar===v}">${e(l)} <b>${n}</b></button>`).join('');}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-plan-pillar]');if(!b)return;pillar=b.dataset.planPillar;render();});
for(const id of ['plan-priority','plan-search'])q(id).addEventListener('input',render);
q('plan-export').onclick=()=>{const rows=visible(),cell=x=>'"'+String(x??'').replace(/"/g,'""')+'"',head=['responsavel','pilar','prioridade','id','titulo','acao'],t='﻿'+[head.map(cell).join(';'),...rows.map(a=>[a.party==='Ambos'?'Vésper + Unidcom':a.party,a.pillar,a.priority,a.id||'',a.title,a.text].map(cell).join(';'))].join('\r\n'),url=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'})),l=document.createElement('a');l.href=url;l.download='vesper-plano-geral.csv';l.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
render();
})();
