import fs from 'node:fs';
const P=new URL('../',import.meta.url).pathname;
const proto=fs.readFileSync(P+'src/legacy/prototype.js','utf8');
const store=fs.readFileSync(P+'src/state/store.tsx','utf8');
const css=fs.readFileSync(P+'src/styles/app.css','utf8');
const tsx=fs.readdirSync(P+'src/components').filter(f=>f.endsWith('.tsx'))
  .map(f=>fs.readFileSync(P+'src/components/'+f,'utf8')).join('\n');
const all=proto+'\n'+tsx;
const out=[];
const H=t=>out.push('\n### '+t);

/* A. data-атрибуты: есть в разметке, но никто не обрабатывает — и наоборот */
const mk=new Set(), hd=new Set();
for(const m of all.matchAll(/data-([a-z0-9-]+)\s*=/g)) mk.add(m[1]);
for(const m of all.matchAll(/data-([a-z0-9-]+)[>\s}]/g)) mk.add(m[1]);
for(const m of store.matchAll(/\[data-([a-z0-9-]+)\]/g)) hd.add(m[1]);
for(const m of store.matchAll(/dataset\.([a-zA-Z0-9]+)/g)) hd.add(m[1].replace(/[A-Z]/g,c=>'-'+c.toLowerCase()));
/* Читаются не как триггер, а как модификатор рядом стоящего действия */
const REACT=new Set(['close','tip','chart','theme','sel','over']);
H('A. data-* без обработчика');
[...mk].sort().forEach(k=>{ if(!hd.has(k)&&!REACT.has(k)) out.push('  ! data-'+k); });
H('A2. обработчик без разметки');
[...hd].sort().forEach(k=>{ if(!mk.has(k)) out.push('  ? data-'+k); });

/* B. оси сценариев, которые ни на что не влияют */
const axes=[...proto.matchAll(/^\s{2}([a-z0-9]+):\{g:'/gm)].map(m=>m[1]);
H('B. оси сценариев без влияния на разметку');
axes.forEach(a=>{
  const uses=(all.match(new RegExp('S\\.'+a+'\\b','g'))||[]).length
    +(store.match(new RegExp("S\\.current\\.'?"+a+'\\b','g'))||[]).length
    +(store.match(new RegExp("\\b"+a+":",'g'))||[]).length;
  /* Ось может жить не в разметке, а в оболочке: тема, плотность, размер текста */
  const real=(all.match(new RegExp('S\\.'+a+'\\b','g'))||[]).length
    +(store.match(new RegExp('S\\.current\\.'+a+'\\b','g'))||[]).length;
  if(!real) out.push('  ! '+a+' — S.'+a+' не читается в разметке');
});
out.push('  всего осей: '+axes.length);
/* B2. группа осей, забытая в AXCAT: её оси не попадают в панель */
H('B2. группы осей вне категорий AXCAT');
{
  const cat=proto.slice(proto.indexOf('const AXCAT=['),proto.indexOf('const AXES={'));
  const inCat=new Set([...cat.matchAll(/'([^']+)'/g)].map(m=>m[1]));
  /* только блок AXES: {g:'…'} встречается ещё и у пунктов сайдбара */
  const block=proto.slice(proto.indexOf('const AXES={'),proto.indexOf('/* Готовые связки состояний'));
  const groups=new Set([...block.matchAll(/\{g:'([^']+)'/g)].map(m=>m[1]));
  const lost=[...groups].filter(g=>!inCat.has(g));
  lost.forEach(g=>out.push('  ! «'+g+'» — нет в AXCAT, оси не видны в панели'));
  if(!lost.length) out.push('  все группы на месте');
}

/* C. экраны: есть V.x, но никуда не ведёт data-go / NAV */
const screens=[...proto.matchAll(/^V\.([a-zA-Z0-9]+)=/gm)].map(m=>m[1]);
const gos=new Set([...all.matchAll(/data-go="([a-zA-Z0-9$.{}\[\]']+)"/g)].map(m=>m[1]));
const titles=proto.slice(proto.indexOf('const TITLES='),proto.indexOf('const GROUP_OF='));
H('C. экраны без входа');
screens.forEach(s=>{
  const inNav=proto.includes("id:'"+s+"'")||proto.includes("['"+s+"',");
  const inTitles=new RegExp('[,{\\s]'+s+':').test(titles);
  if(!gos.has(s)&&!inNav) out.push('  ! V.'+s+' — нет data-go и нет в NAV'+(inTitles?' (есть в TITLES → доступен из панели)':' (и нет в TITLES!)'));
  else if(!inTitles) out.push('  ~ V.'+s+' — нет в TITLES: пустой заголовок вкладки');
});
out.push('  всего экранов: '+screens.length);

/* D. модалки: объявлены, но не открываются */
const mods=[...proto.matchAll(/^\s{2}([a-zA-Z0-9]+):\{(?:t:|ok:|img:)/gm)].map(m=>m[1]);
const opens=new Set([...all.matchAll(/data-modal="([a-zA-Z0-9${}?:'.\[\]]+)"/g)].map(m=>m[1]));
H('D. модалки без точки входа');
mods.forEach(k=>{ if(!opens.has(k)&&!all.includes("'"+k+"'")) out.push('  ! MODALS.'+k); });
out.push('  всего модалок: '+mods.length+', открываются из разметки: '+[...opens].length);

/* E. токены: пиксельные размеры шрифта и хардкод цвета вне палитры */
H('E. font-size в пикселях мимо токенов');
const tokenBlock=css.slice(0,css.indexOf('/* тёмная тема'));
for(const m of css.matchAll(/([^{}]+)\{[^}]*font-size:\s*(\d+)px/g)){
  if(tokenBlock.includes(m[0].slice(0,40))) continue;
  out.push('  ! '+m[1].trim().split('\n').pop().slice(0,60)+' → '+m[2]+'px');
}
for(const m of all.matchAll(/font-size:\s*(\d+)px/g)) out.push('  ! inline '+m[1]+'px');
H('E2. цвета мимо палитры в app.css (вне блока токенов и тёмной темы)');
const body=css.slice(css.indexOf('/* misc blocks */')>0?0:0);
const pal=new Set(['#fff','#ffffff','#000','#111827','#6b7280','#9ca3af','#f3f4f6','#e5e7eb','#7086fc','#22c55e','#f59e0b','#ef4444','#3b82f6','#1a1a1a','#f7f7fa']);
const seen=new Map();
for(const m of css.matchAll(/#[0-9a-fA-F]{3,8}/g)){const c=m[0].toLowerCase();
  if(pal.has(c)||c.length>7)continue; seen.set(c,(seen.get(c)||0)+1);}
[...seen].sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([c,n])=>out.push('  '+c+' ×'+n));
/* F. связность панели сценариев: оси ↔ DEF ↔ Scenario, значения связок */
H('F. панель сценариев: связность осей');
{
  const types=fs.readFileSync(P+'src/state/types.ts','utf8');
  const cut=(a,b)=>proto.slice(proto.indexOf(a),proto.indexOf(b));
  const axBlock=cut('const AXES={','/* Готовые связки состояний');
  const AX={};
  for(const m of axBlock.matchAll(/^\s{2}([a-z0-9]+):\{g:'([^']+)',label:'([^']+)'([\s\S]*?)(?=\n\s{2}[a-z0-9]+:\{g:'|\n};)/gm))
    AX[m[1]]={opts:[...m[4].matchAll(/\['([^']*)','([^']*)'\]/g)].map(o=>o[1]),free:/free:'/.test(m[4])};
  const DEFK={};
  for(const m of cut('const DEF={','let S={...DEF}').matchAll(/([a-z0-9]+):'([^']*)'/g)) DEFK[m[1]]=m[2];
  const tkeys=[...types.slice(types.indexOf('export interface Scenario'),types.indexOf('export interface Ui'))
    .matchAll(/^\s{2}([a-z0-9]+):\s*string/gm)].map(m=>m[1]);
  const ax=Object.keys(AX);
  ax.forEach(k=>{ if(!(k in DEFK)) out.push('  ! '+k+' — нет значения в DEF'); });
  Object.keys(DEFK).forEach(k=>{ if(!AX[k]) out.push('  ! DEF.'+k+' — нет такой оси'); });
  ax.forEach(k=>{ if(!tkeys.includes(k)) out.push('  ! '+k+' — нет в интерфейсе Scenario'); });
  tkeys.forEach(k=>{ if(!AX[k]) out.push('  ! Scenario.'+k+' — нет такой оси'); });
  ax.forEach(k=>{ const d=DEFK[k];
    if(d!==undefined&&!AX[k].opts.includes(d)&&!AX[k].free) out.push('  ! '+k+" — DEF='"+d+"' мимо значений оси"); });
  ax.forEach(k=>{ const o=AX[k].opts, dup=o.filter((v,i)=>o.indexOf(v)!==i);
    if(dup.length) out.push('  ! '+k+' — повтор значения '+[...new Set(dup)].join(',')); });
  for(const m of cut('const PRESETS=[','const DEF={').matchAll(/\['([^']+)','([^']*)',\s*\{([\s\S]*?)\},'([^']+)'\]/g))
    for(const pp of m[3].matchAll(/([a-z0-9]+):'([^']*)'/g)){
      if(!AX[pp[1]]) { out.push('  ! связка «'+m[1]+'» — оси '+pp[1]+' нет'); continue; }
      if(!AX[pp[1]].opts.includes(pp[2])&&!AX[pp[1]].free)
        out.push('  ! связка «'+m[1]+'» — у '+pp[1]+" нет значения '"+pp[2]+"'");
    }
  for(const [name,blockEnd] of [['AX_OWN','const AX_STYLE'],['AX_STYLE','const AXES={']])
    for(const m of cut('const '+name+'=new Set(',blockEnd).matchAll(/'([a-z0-9]+)'/g))
      if(!AX[m[1]]) out.push('  ! '+name+'.'+m[1]+' — оси нет');
  out.push('  осей '+ax.length+', из них оформление 5, придуманных '
    +[...cut('const AX_OWN=new Set(','const AX_STYLE').matchAll(/'[a-z0-9]+'/g)].length);
}

console.log(out.join('\n'));
