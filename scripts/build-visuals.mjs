import {writeFile} from 'node:fs/promises';
import {pixelText, sprite, frame, heart, star} from './pixel-art.mjs';

const icons={
  gym:'...11......11.../..111......111../..111......111../1111111111111111/1111111111111111/..111......111../..111......111../...11......11...',
  digital:'111111..111111/122221..122221/122221..122221/122221..122221/111111..111111/............../111111....11../122221....11../122221..111111/122221....11../111111....11..',
  sushi:'...........11./..........11../....1111111.../..11222222211./.1223333322221/12233333332221/12223333322221/.122222222221./.111111111111./.122222222221./..1111111111..',
  portfolio:'.111111111111./11222222222211/12121222222221/11111111111111/12222222222221/12212222212221/12122222221221/12212222212221/12222222222221/.111111111111.',
  stellar:'......111...../....112211..11/...1222221111./..1222221111../..12221112221./..12111222221./..11122222221./.11122222221../11..1222221.../.....11111....',
  bot:'......11....../.....1111...../......11....../..1111111111../.112222222211./11223322332211/11223322332211/11222222222211/.122333333221./..1111111111../...11....11...',
  profile:'.....11......./..11.11..11.../.11..11...11../11...11....11./.11..11...11../..11.11..11.../.....11.......'
};
const cards=[
  ['gimnexa','GIMNEXA','#ff526c','gym','PRIVADO'],
  ['digital','DIGITAL.A','#ef405d','digital','PRIVADO'],
  ['sushi','FOODGATE SUSHI','#f43f5e','sushi','PRIVADO'],
  ['portfolio','PORTAFOLIO-WEB','#ff7185','portfolio','PRIVADO'],
  ['stellargate','STELLARGATE','#df3554','stellar','FORK'],
  ['open-stellar','OPEN-STELLAR','#ff8796','bot','FORK'],
  ['profile','TOMOYA0K','#f25370','profile','PUBLICO']
];
const wrap=(w,h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
for(const [file,title,color,icon,status] of cards){
  await writeFile(new URL(`../assets/project-${file}.svg`,import.meta.url),wrap(480,224,`${title} · ${status}`,
    frame(480,224,color)+
    '<path d="M24 136H456" stroke="#342027" stroke-width="2"/><path d="M316 28H456V66H316Z" fill="#211016"/>'+
    sprite(icons[icon],28,30,7,{'1':color,'2':'#260e16','3':'#fff1f3'})+
    pixelText(status,328,40,1.5,color)+pixelText(title,28,160,3)+pixelText('>',432,164,3,color)
  ));
}

const tech=[['REACT','#ff7185'],['TYPESCRIPT','#ff8293'],['JAVASCRIPT','#ff627b'],['SUPABASE','#f87185'],['POSTGRESQL','#ff7185'],['PYTHON','#ff8796'],['FASTAPI','#ff647d'],['POWER BI','#fb7185'],['CLOUDFLARE','#ff8192'],['VERCEL','#ffe0e6']];
await writeFile(new URL('../assets/tech-panel.svg',import.meta.url),wrap(1000,230,'Tecnologías',
  frame(1000,230)+pixelText('INVENTARIO',30,26,2,'#ff8293')+
  tech.map(([label,color],i)=>{
    const x=30+(i%5)*190,y=65+Math.floor(i/5)*76;
    return `<g transform="translate(${x} ${y})">${frame(180,60,'#3e1924','#130c10')}<rect x="12" y="17" width="8" height="8" fill="${color}"/><rect x="16" y="25" width="8" height="8" fill="${color}"/>${pixelText(label,32,23,2,color)}</g>`;
  }).join('')
));

const robot='......1111....../......1221....../.......11......./..111111111111../.11222222222211./1122222222222211/1222332222332221/1222332222332221/1222222222222221/1222223333222221/.11222222222211./..111111111111../....11....11..../...111....111...';
await writeFile(new URL('../assets/profile-header.svg',import.meta.url),wrap(1000,320,'Tomoya0k · 8-bit',
  '<style>.float{animation:hop 3s steps(2,end) infinite}.blink{animation:blink 2s steps(2,end) infinite}@keyframes hop{50%{transform:translateY(-8px)}}@keyframes blink{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.float,.blink{animation:none}}</style>'+
  frame(1000,320,'#b91c3b')+
  '<path d="M28 64H972M28 268H972" stroke="#3e1924" stroke-width="4"/>'+
  pixelText('PLAYER 01',32,28,2,'#c6a5ad')+
  [0,1,2].map(i=>sprite(heart,854+i*38,26,4,{'1':'#f43f5e'})).join('')+
  pixelText('TOMOYA0K',44,113,10,'#65162a')+pixelText('TOMOYA0K',40,107,10,'#fff1f3')+
  `<g class="blink">${pixelText('>',40,208,3,'#ff526c')}</g>`+pixelText('PRESS START',74,208,3,'#ff526c')+
  `<g class="float">${sprite(robot,764,104,9,{'1':'#dc2449','2':'#320d1a','3':'#ffe0e6'})}</g>`+
  sprite(star,681,99,4,{'1':'#ff8796'})+sprite(star,944,218,3,{'1':'#ff7185'})+
  Array.from({length:23},(_,i)=>`<rect x="${32+i*41}" y="287" width="25" height="6" fill="${['#ff7185','#df3554','#f43f5e','#ff8796','#ff526c'][Math.floor(i/5)]}"/>`).join('')
));
console.log('Portada, siete tarjetas e inventario 8-bit generados.');
