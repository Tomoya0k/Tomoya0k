import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

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
  const colors=['#61dcff','#8585ff','#bb87ff','#ef83c6','#ffba72','#d4ea79'];
  const start=Date.parse(days[0].date),offset=new Date(start).getUTCDay();
  const weeks=Math.ceil((offset+days.length)/7),step=Math.min(16.8,886/weeks),left=65,top=165;
  const months=['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const labels=[];
  const squares=days.map((day,index)=>{
    const date=new Date(`${day.date}T00:00:00Z`),week=Math.floor((index+offset)/7),weekday=date.getUTCDay();
    if(date.getUTCDate()===1)labels.push(`<text x="${left+week*step}" y="149">${months[date.getUTCMonth()]}</text>`);
    const hue=colors[Math.min(colors.length-1,Math.floor(week/weeks*colors.length))];
    return `<rect x="${left+week*step}" y="${top+weekday*18}" width="12.5" height="12.5" rx="3" fill="${day.count?hue:'#242b40'}" opacity="${day.count?[0,.4,.6,.8,1][day.level]||.4:1}"><title>${day.date}: ${day.count} contribuciones</title></rect>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="370" viewBox="0 0 1000 370" role="img" aria-labelledby="title desc">
  <title id="title">Actividad pública de Tomoya0k: ${total} contribuciones</title><desc id="desc">Calendario del ${days[0].date} al ${days.at(-1).date}. ${active} días activos. Los colores representan semanas y su intensidad indica actividad.</desc>
  <defs><linearGradient id="edge"><stop stop-color="#61dcff"/><stop offset=".45" stop-color="#bb87ff"/><stop offset=".7" stop-color="#ef83c6"/><stop offset="1" stop-color="#d4ea79"/></linearGradient></defs>
  <rect x="1" y="1" width="998" height="368" rx="20" fill="#111827" stroke="#30344c"/>
  <path d="M25 2H975" stroke="url(#edge)" stroke-width="3"/>
  <g font-family="Segoe UI,Arial,sans-serif"><text x="36" y="43" fill="#93a5c9" font-size="13" letter-spacing="3">ACTIVITY / SPECTRUM</text>
  ${[[total,'CONTRIBUCIONES'],[active,'DÍAS ACTIVOS'],[peak,'MÁXIMO EN UN DÍA']].map(([value,label],i)=>`<text x="${36+i*315}" y="89" fill="${colors[i*2]}" font-size="34" font-weight="700">${value}</text><text x="${36+i*315}" y="114" fill="#9aaac5" font-size="12" letter-spacing="1.4">${label}</text>`).join('')}
  <g fill="#91a2be" font-size="11">${labels.join('')}<text x="28" y="194">LUN</text><text x="28" y="230">MIÉ</text><text x="28" y="266">VIE</text></g>
  ${squares}
  <path d="M36 308H964" stroke="#2b354b"/>
  <text x="36" y="337" fill="#9aaac5" font-size="12">Actividad real visible en GitHub · ${days.at(-1).date}</text>
  <text x="660" y="337" fill="#9aaac5" font-size="12">menos</text>${[0,.4,.6,.8,1].map((opacity,i)=>`<rect x="${712+i*21}" y="325" width="13" height="13" rx="3" fill="${opacity?'#bb87ff':'#242b40'}" opacity="${opacity||1}"/>`).join('')}<text x="824" y="337" fill="#9aaac5" font-size="12">más actividad</text>
  </g></svg>\n`;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  // No authentication: only the same activity available to a signed-out visitor.
  const response=await fetch('https://github.com/users/Tomoya0k/contributions',{headers:{'User-Agent':'Tomoya0k-profile-art','Accept-Language':'en'},signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw new Error(`GitHub respondió ${response.status}; se conserva el calendario anterior.`);
  const days=parseCalendar(await response.text());
  await writeFile(new URL('../assets/activity.svg',import.meta.url),renderCalendar(days));
  console.log(JSON.stringify({days:days.length,total:days.reduce((sum,day)=>sum+day.count,0),through:days.at(-1).date}));
}
