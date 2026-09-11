import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {frame,pixelText} from './pixel-art.mjs';

export function parseCalendar(html) {
  const tips=new Map([...html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)].map(([,attrs,text])=>[attrs.match(/\bfor="([^"]+)"/)?.[1],text.replace(/<[^>]+>/g,'').trim()]));
  const days=[...html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)].map(([,attrs])=>{
    const attr=name=>attrs.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
    const date=attr('data-date'),id=attr('id'),level=Number(attr('data-level'));
    const tip=tips.get(id)??'';
    const count=/^No contributions?\b/i.test(tip)?0:Number(tip.match(/^([\d,]+) contributions?\b/i)?.[1]?.replaceAll(',',''));
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(count)||count<0||!Number.isInteger(level)||level<0||level>4)throw new Error('Calendario público incompleto: se conserva el SVG anterior.');
    return {date,count,level};
  }).sort((a,b)=>a.date.localeCompare(b.date));
  if(days.length<350||days.length>380||new Set(days.map(day=>day.date)).size!==days.length)throw new Error('Número de días inesperado; no se sobrescribe la actividad.');
  for(let i=1;i<days.length;i++)if(Date.parse(days[i].date)-Date.parse(days[i-1].date)!==86400000)throw new Error('Faltan días en el calendario.');
  return days;
}

export function renderCalendar(days) {
  const total=days.reduce((sum,day)=>sum+day.count,0),active=days.filter(day=>day.count>0).length,peak=Math.max(...days.map(day=>day.count));
  const colors=['#241218','#65162a','#a51d3d','#df2b50','#ff657c'];
  const statColors=['#ff657c','#ef405d','#ff91a1'];
  const start=Date.parse(days[0].date),offset=new Date(start).getUTCDay();
  const weeks=Math.ceil((offset+days.length)/7),step=Math.min(16.8,886/weeks),left=72,top=160;
  const months=['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const labels=[];
  const squares=days.map((day,index)=>{
    const date=new Date(`${day.date}T00:00:00Z`),week=Math.floor((index+offset)/7),weekday=date.getUTCDay();
    if(date.getUTCDate()===1)labels.push(pixelText(months[date.getUTCMonth()],left+week*step,138,1.5,'#c6a5ad'));
    return `<rect x="${Math.round(left+week*step)}" y="${top+weekday*18}" width="12" height="12" fill="${colors[day.count?day.level||1:0]}" opacity="1"><title>${day.date}: ${day.count} contribuciones</title></rect>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="350" viewBox="0 0 1000 350" role="img" aria-labelledby="title desc">
  <title id="title">Actividad pública de Tomoya0k: ${total} contribuciones</title><desc id="desc">Calendario del ${days[0].date} al ${days.at(-1).date}. ${active} días activos. La intensidad del carmesí indica actividad.</desc>
  ${frame(1000,350,'#b91c3b','#09090b')}
  ${pixelText('ACTIVIDAD',36,28,3,'#fff1f3')}
  ${[[total,'CONTRIBUCIONES'],[active,'DIAS ACTIVOS'],[peak,'MAX DIARIO']].map(([value,label],i)=>pixelText(value,36+i*315,70,4,statColors[i])+pixelText(label,36+i*315,108,1.5,'#c6a5ad')).join('')}
  ${labels.join('')}${[['LUN',178],['MIE',214],['VIE',250]].map(([label,y])=>pixelText(label,28,y,1.5,'#c6a5ad')).join('')}
  <g shape-rendering="crispEdges">${squares}</g>
  <path d="M36 297H964" stroke="#342027" stroke-width="2"/>
  ${pixelText(days.at(-1).date,36,316,1.5,'#c6a5ad')}
  ${pixelText('-',752,315,2,'#c6a5ad')}${colors.map((color,i)=>`<rect x="${781+i*22}" y="315" width="14" height="14" fill="${color}" opacity="1"/>`).join('')}${pixelText('+',906,315,2,'#c6a5ad')}
  </svg>\n`;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  // No authentication: only the same activity available to a signed-out visitor.
  const response=await fetch('https://github.com/users/Tomoya0k/contributions',{headers:{'User-Agent':'Tomoya0k-profile-art','Accept-Language':'en'},signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`GitHub respondió ${response.status}; se conserva el calendario anterior.`);
  const days=parseCalendar(await response.text());
  await writeFile(new URL('../assets/activity.svg',import.meta.url),renderCalendar(days));
  console.log(JSON.stringify({days:days.length,total:days.reduce((sum,day)=>sum+day.count,0),through:days.at(-1).date}));
}
