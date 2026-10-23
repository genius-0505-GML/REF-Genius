const V='15.18.1',D=`https://ddragon.leagueoflegends.com/cdn/${V}`,IMG='https://ddragon.leagueoflegends.com/cdn/img/champion';
const NA='Informação não disponível.';
// A Data Dragon não fornece dados de regiões: descrições e listas abaixo são dados de lore (Riot Universe) mantidos localmente.
const REG=[
['Demacia','Reino militarizado e ordeiro de Valoran, conhecido pela justiça, pela disciplina e pela proibição da magia.','Garen',['Garen','Lux','JarvanIV','Galio','Fiora','Sona','Poppy','Quinn','Shyvana','XinZhao','Vayne','Lucian','Kayle','Morgana','Sylas']],
['Noxus','Império expansionista e brutal que valoriza a força e o mérito de cada indivíduo.','Darius',['Darius','Draven','Katarina','Leblanc','Swain','Talon','Vladimir','Sion','Cassiopeia','Riven','Kled','Samira','Rell','Mordekaiser']],
['Ionia','Arquipélago de magia natural e equilíbrio espiritual, a leste de Valoran.','Ahri',['Ahri','Irelia','Yasuo','Yone','Karma','Akali','Jhin','Kayn','LeeSin','MasterYi','Shen','Zed','MonkeyKing','Syndra','Sett','Xayah','Rakan','Lillia','Ivern','Varus']],
['Freljord','Terra gelada ao norte, habitada por tribos que lutam para sobreviver.','Ashe',['Ashe','Braum','Gragas','Lissandra','Nunu','Olaf','Sejuani','Tryndamere','Udyr','Volibear','Anivia','Trundle','Gnar','Ornn']],
['Piltover','Cidade próspera de inovação, comércio e tecnologia hextec.','Caitlyn',['Caitlyn','Ezreal','Jayce','Vi','Orianna','Heimerdinger','Camille','Seraphine']],
['Zaun','Cidade subterrânea sob Piltover, marcada por indústria, química e contrastes sociais.','Jinx',['Blitzcrank','DrMundo','Ekko','Jinx','Singed','Twitch','Viktor','Warwick','Zac','Zeri','Renata','Urgot','Janna']],
['Shurima','Antigo império desértico ao sul, com ruínas e a lenda da Ascensão.','Azir',['Azir','Nasus','Renekton','Sivir','Skarner','Taliyah','Amumu','Xerath','Rammus','Akshan','Naafiri']],
['Targon','A montanha mais alta de Runeterra, ligada a celestiais e à busca por ascensão.','Leona',['Aphelios','Diana','Leona','Pantheon','Soraka','Taric','Zoe','AurelionSol']],
['Bilgewater','Cidade portuária de piratas, caçadores de monstros e contrabandistas.','MissFortune',['Fizz','Gangplank','Graves','Illaoi','MissFortune','Nautilus','Pyke','TahmKench','TwistedFate','Nilah']],
['Shadow Isles','Ilhas envoltas pela Névoa Negra, onde vivem os mortos e os amaldiçoados.','Thresh',['Elise','Gwen','Hecarim','Kalista','Karthus','Maokai','Thresh','Viego','Yorick','Vex']],
['Ixtal','Nação isolada de magos elementais na selva, a sudeste de Shurima.','Qiyana',['Milio','Neeko','Nidalee','Qiyana','Rengar','Zyra']],
['Bandle City','Terra dos yordles, cheia de magia e invenções, escondida do resto do mundo.','Teemo',['Corki','Kennen','Lulu','Rumble','Teemo','Tristana','Veigar','Yuumi','Ziggs']],
['Void','O Vazio: dimensão hostil de criaturas que ameaçam consumir Runeterra.','Chogath',['Chogath','Kaisa','Kassadin','Khazix','KogMaw','Malzahar','RekSai','Velkoz','Belveth']]
];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const clean=s=>{const t=String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();return t?esc(t):NA};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const j=async u=>{const r=await fetch(u);if(!r.ok)throw new Error(r.status);return r.json()};
let champs={},list=[],details={},allP=null,cur='home';
let favs=[];try{favs=JSON.parse(localStorage.getItem('lol-favs'))||[]}catch{}
const diffKey=d=>d<=3?'low':d<=7?'mid':'high';
const regCount=r=>r[3].filter(i=>champs[i]).length;

/* ---------- Tema ---------- */
function setTheme(t){document.body.classList.toggle('light',t==='light');$('#theme').textContent=t==='light'?'🌙 Dark Mode':'☀️ Light Mode';localStorage.setItem('theme',t)}
setTheme(localStorage.getItem('theme')||'dark');
$('#theme').onclick=()=>setTheme(document.body.classList.contains('light')?'dark':'light');
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('on');

/* ---------- Views ---------- */
function show(v){
  $$('.view').forEach(e=>e.classList.toggle('on',e.id===v));
  $$('nav a').forEach(a=>a.classList.toggle('on',a.dataset.view===v));
  if(v!=='search')cur=v;
  $('#nav').classList.remove('on');scrollTo(0,0);
  if(v==='skins'&&list.length&&!$('#skinGrid').innerHTML)renderSkins($('#skinChamp').value);
}

/* ---------- Cards ---------- */
const heart=id=>favs.includes(id)?'❤️':'♡';
const card=c=>`<article class="card"><div class="ph"><img loading="lazy" src="${IMG}/splash/${c.id}_0.jpg" alt="${esc(c.name)}"></div><div class="cb"><h3>${esc(c.name)}</h3><p class="t">${esc(c.title)}</p><p class="tags">${esc(c.tags.join(' / '))}</p><div class="row"><button class="btn" data-open="${c.id}">Ver detalhes</button><button class="fav" data-fav="${c.id}" aria-label="Favoritar">${heart(c.id)}</button></div></div></article>`;
function renderChamps(){
  const cl=$('#fClass').value,df=$('#fDiff').value;
  const l=list.filter(c=>(!cl||c.tags.includes(cl))&&(!df||diffKey(c.info.difficulty)===df));
  $('#count').textContent=`${l.length} campeões`;
  $('#grid').innerHTML=l.length?l.map(card).join(''):`<p class="na">${NA}</p>`;
}
function renderFavs(){
  const l=list.filter(c=>favs.includes(c.id));
  $('#favs').innerHTML=l.length?l.map(card).join(''):'<p class="na">Você ainda não favoritou nenhum campeão. Clique no ♡ em um card.</p>';
}
function renderRegions(){
  $('#regGrid').innerHTML=REG.map((r,i)=>`<article class="card"><div class="ph"><img loading="lazy" src="${IMG}/splash/${r[2]}_0.jpg" alt="${esc(r[0])}"><b>${esc(r[0])}</b></div><div class="cb"><p class="d">${esc(r[1])}</p><p class="tags">${regCount(r)} campeões relacionados</p><div class="row"><button class="btn" data-region="${i}">Ver região</button></div></div></article>`).join('');
}
async function renderSkins(id){
  const g=$('#skinGrid');g.innerHTML='<p class="load">Carregando...</p>';
  try{const d=await detail(id);g.innerHTML=skinsHtml(d)}catch{g.innerHTML='<p class="na">Não foi possível carregar os dados.<br>Tente novamente.</p>'}
}
const skinName=s=>s.name==='default'?'Original':s.name;
const skinsHtml=d=>d.skins.map(s=>`<article class="card skin" data-skin="${d.id}_${s.num}" data-name="${esc(skinName(s))}"><div class="ph"><img loading="lazy" src="${IMG}/splash/${d.id}_${s.num}.jpg" alt="${esc(skinName(s))}"></div><div class="cb"><h3>${esc(skinName(s))}</h3></div></article>`).join('');

/* ---------- Detalhes ---------- */
async function detail(id){
  if(!details[id]){const r=await j(`${D}/data/en_US/champion/${id}.json`);details[id]=r.data[id]}
  return details[id];
}
function openModal(html){$('#mBody').innerHTML=html;$('#modal').classList.add('on');$('#modal').scrollTop=0}
const fail='<p class="na">Não foi possível carregar os dados.<br>Tente novamente.</p>';
async function openChamp(id){
  openModal('<p class="load">Carregando...</p>');
  try{
    const d=await detail(id),c=champs[id],s=d.stats||{};
    const sp=[['PASSIVA',d.passive,`${D}/img/passive/${d.passive.image.full}`],...d.spells.map((x,i)=>['QWER'[i],x,`${D}/img/spell/${x.image.full}`])];
    const st=[['Vida',s.hp],['Mana',s.mp],['Armadura',s.armor],['Resist. mágica',s.spellblock],['Dano de ataque',s.attackdamage],['Vel. de ataque',s.attackspeed],['Vel. de movimento',s.movespeed],['Alcance',s.attackrange]];
    openModal(`<div class="banner" style="--bn:url('${IMG}/splash/${id}_0.jpg')"><div><h1>${esc(d.name)}</h1><p>${esc(d.title)}</p></div></div><div class="pad">
    <div class="info"><div><p>${d.tags.map(t=>`<span class="pill">${esc(t)}</span>`).join('')}<span class="pill">Dificuldade: ${c.info.difficulty??NA}/10</span></p>
    <p style="margin:10px 0">${clean(d.lore)}</p><button class="fav" data-fav="${id}">${heart(id)}</button></div>
    <div><h3>Estatísticas</h3><table>${st.map(([k,v])=>`<tr><td>${k}</td><td>${v??NA}</td></tr>`).join('')}</table></div></div>
    <h2>Habilidades</h2>${sp.map(([k,x,ic])=>`<div class="sp"><img src="${ic}" alt="${esc(x.name)}"><div><small>${k}</small><h4>${esc(x.name)}</h4><p>${clean(x.description)}</p></div></div>`).join('')}
    <h2>👕 SKINS</h2><p class="t" style="margin-bottom:10px">SKINS DE ${esc(d.name.toUpperCase())}</p><div class="grid">${skinsHtml(d)}</div></div>`);
  }catch{openModal(fail)}
}
function openRegion(i){
  const r=REG[i],ids=r[3].filter(x=>champs[x]);
  openModal(`<div class="banner" style="--bn:url('${IMG}/splash/${r[2]}_0.jpg')"><div><h1>${esc(r[0].toUpperCase())}</h1></div></div><div class="pad">
  <p>${esc(r[1])}</p>
  <table style="margin:14px 0"><tr><td>Facções</td><td>${NA}</td></tr><tr><td>Personagens relacionados</td><td>${NA}</td></tr><tr><td>Localização no mapa</td><td>${NA}</td></tr></table>
  <h2>Campeões da região (${ids.length})</h2><div class="grid">${ids.map(x=>card(champs[x])).join('')}</div></div>`);
}
function lightbox(src,name){$('#lbImg').src=`${IMG}/splash/${src}.jpg`;$('#lbImg').alt=name;$('#lbCap').textContent=name;$('#lightbox').classList.add('on')}

/* ---------- Busca ---------- */
function loadAll(){
  if(!allP)allP=(async()=>{
    const ids=list.map(c=>c.id).filter(i=>!details[i]);
    for(let i=0;i<ids.length;i+=25)await Promise.allSettled(ids.slice(i,i+25).map(detail));
  })();
  return allP;
}
async function search(){
  const raw=$('#q').value.trim(),q=norm(raw);
  if(!q){show(cur);return}
  show('search');
  const out=$('#results');
  out.innerHTML='<p class="load">Carregando...</p>';
  await loadAll();
  if(norm($('#q').value.trim())!==q)return;
  const C=list.filter(c=>norm(c.name).includes(q)||norm(c.title).includes(q));
  const R=REG.map((r,i)=>[r,i]).filter(([r])=>norm(r[0]).includes(q));
  const A=[],S=[];
  Object.values(details).forEach(d=>{
    [d.passive,...d.spells].forEach(x=>{if(norm(x.name).includes(q))A.push([d,x])});
    d.skins.forEach(s=>{const n=skinName(s);if(s.num&&norm(n).includes(q)||norm(n+' '+d.name).includes(q)&&s.num)S.push([d,s,n])});
  });
  const sec=(t,items)=>items.length?`<h2>${t}</h2>${items.join('')}`:'';
  const html=
   sec('CAMPEÕES',C.slice(0,40).map(c=>`<button class="res" data-open="${c.id}"><img src="${D}/img/champion/${c.image.full}" alt=""><span>${esc(c.name)}<small>${esc(c.title)}</small></span></button>`))+
   sec('REGIÕES',R.map(([r,i])=>`<button class="res" data-region="${i}"><span>${esc(r[0])}<small>${regCount(r)} campeões</small></span></button>`))+
   sec('HABILIDADES',A.slice(0,40).map(([d,x])=>`<button class="res" data-open="${d.id}"><img src="${D}/img/${x===d.passive?'passive':'spell'}/${x.image.full}" alt=""><span>${esc(x.name)}<small>${esc(d.name)}</small></span></button>`))+
   sec('SKINS',S.slice(0,40).map(([d,s,n])=>`<button class="res" data-skin="${d.id}_${s.num}" data-name="${esc(n)} ${esc(d.name)}"><img src="${IMG}/splash/${d.id}_${s.num}.jpg" alt=""><span>${esc(n)}<small>${esc(d.name)}</small></span></button>`));
  out.innerHTML=html||`<p class="na">Nenhum resultado para "${esc(raw)}".</p>`;
}
let tm;$('#q').oninput=()=>{clearTimeout(tm);tm=setTimeout(search,300)};

/* ---------- Eventos ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-view],[data-open],[data-region],[data-fav],[data-skin],[data-close],[data-load],[data-md],[data-del],[data-slot],[data-clear],[data-pick]');
  if(!t)return;
  const D_=t.dataset;
  if(D_.view){$('#q').value='';show(D_.view)}
  else if(D_.load){const t=saved[+D_.load];team={name:t.name,p:[...t.p]};$('#tName').value=t.name;saveTeam();renderTeam();scrollTo(0,0)}
  else if(D_.md)exportMd(saved[+D_.md]);
  else if(D_.del){saved.splice(+D_.del,1);saveList();renderSaved()}
  else if(D_.slot){slot=+D_.slot;renderTeam()}
  else if(D_.clear){team.p[+D_.clear]=null;slot=+D_.clear;saveTeam();renderTeam()}
  else if(D_.pick){team.p[slot]=D_.pick;slot=nextEmpty(slot);saveTeam();renderTeam()}
  else if(D_.fav){
    const id=D_.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];
    try{localStorage.setItem('lol-favs',JSON.stringify(favs))}catch{}
    $$(`[data-fav="${id}"]`).forEach(b=>b.textContent=heart(id));renderFavs();
  }
  else if(D_.open)openChamp(D_.open);
  else if(D_.region!==undefined)openRegion(+D_.region);
  else if(D_.skin)lightbox(D_.skin,D_.name||'');
  else if(t.hasAttribute('data-close')){$('#lightbox').classList.contains('on')?$('#lightbox').classList.remove('on'):$('#modal').classList.remove('on')}
});
$('#modal').addEventListener('mousedown',e=>{if(e.target.id==='modal')$('#modal').classList.remove('on')});
$('#lightbox').addEventListener('mousedown',e=>{if(e.target.id==='lightbox')$('#lightbox').classList.remove('on')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#lightbox').classList.contains('on')?$('#lightbox').classList.remove('on'):$('#modal').classList.remove('on')}});
$('#fClass').onchange=$('#fDiff').onchange=renderChamps;
$('#skinChamp').onchange=e=>renderSkins(e.target.value);

/* ---------- Home ---------- */
const icon=c=>`${D}/img/champion/${c.image.full}`;
const chip=c=>`<button class="chip" data-open="${c.id}"><img loading="lazy" src="${icon(c)}" alt="">${esc(c.name)}</button>`;
const renderHome=()=>{$('#homeGrid').innerHTML=list.map(chip).join('')};

/* ---------- Montar time ---------- */
const ROLES=[['Topo','TOP'],['Selva','JG'],['Meio','MID'],['Atirador','ADC'],['Suporte','SUP']];
const empty=()=>({name:'',p:Array(5).fill(null)});
let team=empty(),slot=0;
try{const t=JSON.parse(localStorage.getItem('team5'));if(t&&Array.isArray(t.p)&&t.p.length===5)team=t}catch{}
const saveTeam=()=>{try{localStorage.setItem('team5',JSON.stringify(team))}catch{}};
$('#tName').value=team.name||'';
let pickerInit=false;
const nextEmpty=from=>{for(let k=1;k<=5;k++){const i=(from+k)%5;if(!champs[team.p[i]])return i}return from};
function renderTeam(){
  if(!pickerInit){
    pickerInit=true;
    $('#pkc').innerHTML+=[...new Set(list.flatMap(c=>c.tags))].sort().map(t=>`<option>${t}</option>`).join('');
    $('#pkq').oninput=$('#pkc').onchange=drawPicker;
    const e=team.p.findIndex(id=>!champs[id]);if(e>=0)slot=e;
  }
  $('#tp').innerHTML=ROLES.map((r,i)=>{const c=champs[team.p[i]];
    return `<div class="slot${i===slot?' on':''}"><button class="pk" data-slot="${i}"><small>${r[0]}</small>${c?`<img src="${icon(c)}" alt="">${esc(c.name)}`:`<i>+</i>Escolher`}</button>${c?`<button class="x" data-clear="${i}" aria-label="Remover">✕</button>`:''}</div>`}).join('');
  $('#tCount').textContent=`${team.p.filter(id=>champs[id]).length}/5 escolhidos`;
  renderSaved();drawPicker();
}
let saved=[];try{saved=JSON.parse(localStorage.getItem('teams5'))||[]}catch{}
const saveList=()=>{try{localStorage.setItem('teams5',JSON.stringify(saved))}catch{}};
function renderSaved(){
  $('#tSaved').innerHTML=saved.length?saved.map((t,i)=>`<div class="sv"><div class="ic">${t.p.map(id=>champs[id]?`<img src="${icon(champs[id])}" alt="${esc(champs[id].name)}" title="${esc(champs[id].name)}">`:'').join('')}</div><b>${esc(t.name)}</b><button class="btn ghost" data-load="${i}">Carregar</button><button class="btn" data-md="${i}">Baixar .md</button><button class="x2" data-del="${i}" aria-label="Excluir">✕</button></div>`).join(''):'<p class="na">Nenhum time salvo ainda. Escolha os campeões e clique em "Salvar time".</p>';
}
function saveCurrent(){
  if(!team.p.some(id=>champs[id])){$('#tCount').textContent='Escolha ao menos um campeão para salvar.';return}
  const name=team.name.trim()||'Meu time',t={name,p:[...team.p]},k=saved.findIndex(x=>norm(x.name)===norm(name));
  k>=0?saved[k]=t:saved.unshift(t);saveList();renderSaved();
  $('#tCount').textContent='Time salvo ✔';setTimeout(renderTeam,1800);
}
function drawPicker(){
  $('#pickFor').textContent='→ '+ROLES[slot][0];
  const q=norm($('#pkq').value),cl=$('#pkc').value;
  $('#pkg').innerHTML=list.filter(c=>(!q||norm(c.name).includes(q))&&(!cl||c.tags.includes(cl))).map(c=>`<button class="chip" data-pick="${c.id}"${team.p.includes(c.id)&&team.p[slot]!==c.id?' disabled':''}><img loading="lazy" src="${icon(c)}" alt="">${esc(c.name)}</button>`).join('')||`<p class="na">${NA}</p>`;
}
function exportMd(t){
  const n=t.name.trim()||'Meu time';
  const md=`# ${n}\n\n`+ROLES.map((r,i)=>{const c=champs[t.p[i]];return `- **${r[0]}:** ${c?`${c.name} (${c.title})`:'não escolhido'}`}).join('\n')+'\n\n_Gerado no LOL Database_\n';
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md],{type:'text/markdown'}));
  a.download=(norm(n).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'time')+'.md';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
$('#tName').oninput=e=>{team.name=e.target.value;saveTeam()};
$('#tSave').onclick=saveCurrent;
$('#tClear').onclick=()=>{team=empty();$('#tName').value='';saveTeam();renderTeam()};
$('#tMd').onclick=()=>exportMd(team);

/* ---------- Início ---------- */
async function init(){
  const st=$('#status');st.textContent='Carregando...';
  try{
    const r=await j(`${D}/data/en_US/champion.json`);
    champs=r.data;list=Object.values(champs).sort((a,b)=>a.name.localeCompare(b.name));
    [...new Set(list.flatMap(c=>c.tags))].sort().forEach(t=>$('#fClass').insertAdjacentHTML('beforeend',`<option>${t}</option>`));
    $('#skinChamp').innerHTML=list.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const rnd=list[Math.floor(Math.random()*list.length)];
    $('.hero').style.setProperty('--hero',`url('${IMG}/splash/${rnd.id}_0.jpg')`);
    st.textContent='';renderChamps();renderHome();renderFavs();renderRegions();renderTeam();show(startView());
  }catch{
    st.innerHTML='Não foi possível carregar os dados.<br>Tente novamente.<br><br><button class="btn" id="retry">Tentar novamente</button>';
    $('#retry').onclick=init;
  }
}
const VIEWS=['home','champions','team','regions','skins'];
const startView=()=>{const h=location.hash.slice(1);return VIEWS.includes(h)?h:'home'};
addEventListener('hashchange',()=>show(startView()));
show(startView());init();
