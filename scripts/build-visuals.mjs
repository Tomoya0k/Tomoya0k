import {writeFile} from 'node:fs/promises';
const esc=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const icons={
  gym:'<path d="M12 32h40M14 20v24M22 15v34M42 15v34M50 20v24"/>',
  digital:'<rect x="12" y="12" width="16" height="16" rx="4"/><rect x="36" y="12" width="16" height="16" rx="4"/><rect x="12" y="36" width="16" height="16" rx="4"/><path d="M36 44h16m-8-8v16"/>',
  sushi:'<ellipse cx="32" cy="32" rx="24" ry="16"/><ellipse cx="32" cy="32" rx="13" ry="8"/><path d="m45 6-9 17m20-13-12 17M8 32v10c0 21 48 21 48 0V32"/>',
  portfolio:'<rect x="6" y="10" width="52" height="44" rx="6"/><path d="M6 22h52m-42-6h1m7 0h1M25 32l-8 7 8 7m14-14 8 7-8 7"/>',
  stellar:'<circle cx="32" cy="32" r="19"/><path d="m6 46 52-28M6 38 58 10"/>',
  bot:'<rect x="10" y="20" width="44" height="34" rx="9"/><path d="M32 20V9m-5 0h10M4 32v12m56-12v12M22 32v4m20-4v4m-18 9h16"/>',
  profile:'<path d="m23 14-17 18 17 18m18-36 17 18-17 18M36 10 28 54"/>'
};
const cards=[
  ['gimnexa','Gimnexa','TRAINING / PROGRESS','Rutinas, sesiones y progreso.','TypeScript · React · Supabase','#b7ef76','gym','PRIVADO'],
  ['digital','Digital.A','DESIGN / OPERATIONS','Cotizaciones, gestión y producción.','JavaScript · React · Supabase','#ffb074','digital','PRIVADO'],
  ['sushi','FoodGate Sushi','FOOD / MOBILE FIRST','Un menú digital para explorar.','JavaScript · React · Vite','#ff85bb','sushi','PRIVADO'],
  ['portfolio','portafolio-web','DESIGN / PERSONAL SPACE','Proyectos, diseño y experimentos.','TypeScript · React · Tailwind','#6de1ff','portfolio','PRIVADO'],
  ['stellargate','StellarGate','FORK / STELLAR','Pasarela de pagos sobre Stellar.','Rust · Axum · SQLite','#b59aff','stellar','FORK'],
  ['open-stellar','Open-Stellar','FORK / AI EXPLORATION','Un bot con IA en la nube.','TypeScript · Cloudflare · Groq','#ffe08a','bot','FORK'],
  ['profile','Tomoya0k','YOU ARE HERE','El laboratorio visual de este perfil.','Markdown · SVG · JavaScript','#81f0d4','profile','PÚBLICO']
];
for(const [file,title,kicker,description,stack,color,icon,status] of cards){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="252" viewBox="0 0 480 252" role="img" aria-labelledby="title desc"><title id="title">${title} · ${status}</title><desc id="desc">${description} ${stack}</desc>
  <defs><radialGradient id="glow"><stop stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
  <rect x="1" y="1" width="478" height="250" rx="19" fill="#111827" stroke="#30344c"/><circle cx="421" cy="54" r="130" fill="url(#glow)"/>
  <path d="M26 2H454" stroke="${color}" stroke-width="3"/>
  <g font-family="Segoe UI,Arial,sans-serif"><text x="24" y="39" fill="${color}" font-size="11" letter-spacing="1.8">${kicker}</text>
  <g transform="translate(383 50)" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${icons[icon]}</g>
  <text x="24" y="96" fill="#f2f5ff" font-size="32" font-weight="750">${title}</text>
  <text x="24" y="132" fill="#acbad0" font-size="17">${description}</text><text x="24" y="164" fill="${color}" font-size="13">${stack}</text>
  <path d="M24 187H456" stroke="#2b354b"/><rect x="24" y="204" width="94" height="26" rx="13" fill="${color}" fill-opacity=".12"/>
  <text x="71" y="221" text-anchor="middle" fill="${color}" font-size="11" font-weight="700" letter-spacing="1">${status}</text><text x="437" y="224" fill="${color}" font-size="26">↗</text></g></svg>\n`;
  await writeFile(new URL(`../assets/project-${file}.svg`,import.meta.url),svg);
}
const tech=[['⚛','React','#6de1ff'],['TS','TypeScript','#85b5ff'],['JS','JavaScript','#f7dd76'],['S','Supabase','#84edbc'],['PG','PostgreSQL','#99baff'],['Py','Python','#f7cb79'],['API','FastAPI','#6ee3cd'],['BI','Power BI','#f9d970'],['CF','Cloudflare','#ffae7c'],['▲','Vercel','#dedaf3']];
await writeFile(new URL('../assets/tech-panel.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="265" viewBox="0 0 1000 265" role="img" aria-label="Panel de tecnologías: ${tech.map(t=>t[1]).join(', ')}"><rect x="1" y="1" width="998" height="263" rx="20" fill="#111827" stroke="#30344c"/><g font-family="Segoe UI,Arial,sans-serif"><text x="30" y="38" fill="#95a9cc" font-size="13" letter-spacing="3">TECH / LOADOUT</text>${tech.map(([symbol,label,color],i)=>{const x=30+(i%5)*190,y=57+Math.floor(i/5)*94;return `<g transform="translate(${x} ${y})"><rect width="180" height="80" rx="12" fill="#1b2337" stroke="#303b53"/><rect x="12" y="14" width="45" height="45" rx="11" fill="${color}" fill-opacity=".12"/><text x="34.5" y="43" fill="${color}" text-anchor="middle" font-size="${symbol.length>2?16:22}" font-weight="700">${esc(symbol)}</text><text x="68" y="41" fill="#e4e9f6" font-size="14" font-weight="600">${label}</text><path d="M68 52h88" stroke="${color}" stroke-opacity=".45" stroke-width="2"/></g>`;}).join('')}</g></svg>\n`);
console.log('Tarjetas de los siete repositorios y panel de tecnologías generados.');
