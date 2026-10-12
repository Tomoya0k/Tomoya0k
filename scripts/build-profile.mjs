import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'assets');
const dataFile = path.join(root, 'data', 'languages.json');

const groups = {
  own: ['SkNesting', 'SkLed', 'Digital.A', 'OZPA', 'portafolio-web', 'foodgate-sushi-menu', 'Gimnexa'],
  openSource: ['Open-Stellar', 'StellarGate'],
};

const projects = [
  { file: 'sknesting', name: 'SkNesting', status: 'Público', accent: '#51B7EF', icon: 'nest', lines: ['Acomodo de piezas SVG y EPS en hojas,', 'con giros, concavidades y agujeros.'], stack: 'TypeScript  ·  SVG  ·  Clipper' },
  { file: 'skled', name: 'SkLed', status: 'Público', accent: '#6CD5B1', icon: 'led', lines: ['Lectura de contornos SVG y preparación', 'de recorridos y módulos LED.'], stack: 'TypeScript  ·  React  ·  SVG' },
  { file: 'profile', name: 'Tomoya0k', status: 'Público', accent: '#B7A1F5', icon: 'profile', lines: ['Este perfil, sus tarjetas y visualizaciones', 'generadas a partir de mis repositorios.'], stack: 'JavaScript  ·  SVG  ·  GitHub API' },
  { file: 'gimnexa', name: 'Gimnexa', status: 'Privado', accent: '#E2A86D', icon: 'gym', lines: ['Rutinas, sesiones, progreso y estadísticas', 'en una aplicación de entrenamiento.'], stack: 'TypeScript  ·  React  ·  Supabase' },
  { file: 'digital', name: 'Digital.A', status: 'Privado', accent: '#70B5ED', icon: 'digital', lines: ['Web, cotizaciones y portales de gestión', 'y producción para Grupo Digital.'], stack: 'JavaScript  ·  React  ·  Supabase' },
  { file: 'ozpa', name: 'OZPA', status: 'Privado', accent: '#79D4C4', icon: 'ozpa', lines: ['Gestión de clientes y expedientes con', 'escritorio, API y base de datos.'], stack: 'Java  ·  JavaFX  ·  Spring Boot' },
  { file: 'portfolio', name: 'Portafolio web', status: 'Privado', accent: '#B9AAF3', icon: 'portfolio', lines: ['Selección de proyectos y trabajo visual', 'en una web personal.'], stack: 'TypeScript  ·  React  ·  Tailwind' },
  { file: 'sushi', name: 'FoodGate Sushi', status: 'Privado', accent: '#F08E80', icon: 'sushi', lines: ['Menú digital para móvil con búsqueda,', 'categorías y vista de cada platillo.'], stack: 'JavaScript  ·  React  ·  Vite' },
  { file: 'open-stellar', name: 'Open-Stellar', status: 'Fork', accent: '#96A9F5', icon: 'star', lines: ['Fork público de un bot con IA ejecutado', 'sobre Cloudflare Workers.'], stack: 'TypeScript  ·  Cloudflare Workers' },
  { file: 'stellargate', name: 'StellarGate', status: 'Fork', accent: '#D8BC87', icon: 'gate', lines: ['Fork público de una pasarela de pagos', 'para la red Stellar.'], stack: 'Rust  ·  Axum  ·  SQLite' },
];

const escapeXml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);

const icons = {
  nest: '<path d="M31 54 45 30l21 8-14 24-21-8Zm8-3 10-16m4 24 9-16"/>',
  led: '<path d="M31 49h13l7-15h14M31 37h10l7 15h17"/><circle cx="31" cy="49" r="3"/><circle cx="65" cy="34" r="3"/><circle cx="65" cy="52" r="3"/>',
  profile: '<circle cx="48" cy="39" r="9"/><path d="M30 62c3-10 10-15 18-15s15 5 18 15"/>',
  gym: '<path d="M33 42h30M31 34v16m-5-19v22m39-19v16m5-19v22"/>',
  digital: '<rect x="29" y="31" width="17" height="17" rx="3"/><rect x="50" y="31" width="17" height="17" rx="3"/><rect x="39" y="51" width="18" height="13" rx="3"/><path d="M48 48v3"/>',
  ozpa: '<path d="M29 37h15l4 5h19v20H29V37Zm8-6h22v11"/><path d="M38 50h20m-20 6h15"/>',
  portfolio: '<rect x="28" y="31" width="40" height="33" rx="5"/><path d="M28 40h40m-27 7-6 6 6 6m14-12 6 6-6 6"/>',
  sushi: '<circle cx="48" cy="48" r="17"/><circle cx="48" cy="48" r="8"/><path d="m32 28 24-7m-21 12 24-7"/>',
  star: '<path d="m48 25 5.2 16 16.8 0-13.6 9.8 5.2 16L48 57l-13.6 9.8 5.2-16L26 41h16.8L48 25Z"/><circle cx="48" cy="48" r="24" stroke-dasharray="4 6"/>',
  gate: '<circle cx="48" cy="48" r="18"/><path d="M37 43h25m-28 9h25m-5-16 8 7-8 7"/>',
};

function card(project) {
  const title = escapeXml(project.name);
  const accent = project.accent;
  const status = escapeXml(project.status);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="218" viewBox="0 0 600 218" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${escapeXml(project.lines.join(' '))} ${status}.</desc>
<rect x="1" y="1" width="598" height="216" rx="20" fill="#0E1726" stroke="#2A3B50" stroke-width="2"/>
<path d="M20 2h155" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
<rect x="24" y="24" width="55" height="55" rx="14" fill="${accent}" fill-opacity=".13" stroke="${accent}" stroke-opacity=".35"/>
<g fill="none" stroke="${accent}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${icons[project.icon]}</g>
<text x="95" y="60" fill="#F4F7FB" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="30">${title}</text>
<rect x="490" y="28" width="86" height="28" rx="14" fill="${accent}" fill-opacity=".12" stroke="${accent}" stroke-opacity=".5"/>
<text x="533" y="47" text-anchor="middle" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700">${status}</text>
<text x="27" y="119" fill="#D4DFEB" font-family="Arial,Helvetica,sans-serif" font-size="19">${escapeXml(project.lines[0])}</text>
<text x="27" y="146" fill="#D4DFEB" font-family="Arial,Helvetica,sans-serif" font-size="19">${escapeXml(project.lines[1])}</text>
<path d="M27 170h546" stroke="#29374A"/>
<circle cx="33" cy="191" r="4" fill="${accent}"/>
<text x="47" y="197" fill="#AFC1D4" font-family="Arial,Helvetica,sans-serif" font-size="17">${escapeXml(project.stack)}</text>
</svg>\n`;
}

async function refreshData() {
  const repositories = {};
  for (const repo of [...groups.own, ...groups.openSource]) {
    repositories[repo] = JSON.parse(execFileSync('gh', ['api', `repos/Tomoya0k/${repo}/languages`], { encoding: 'utf8' }));
  }
  await writeFile(dataFile, `${JSON.stringify({ fetchedOn: new Date().toISOString().slice(0, 10), groups, repositories }, null, 2)}\n`);
}

function summarize(data, group) {
  const totals = new Map();
  for (const repo of data.groups[group]) {
    for (const [language, bytes] of Object.entries(data.repositories[repo])) {
      totals.set(language, (totals.get(language) ?? 0) + bytes);
    }
  }
  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);
  const ordered = [...totals].sort((a, b) => b[1] - a[1]);
  const rows = ordered.slice(0, 4).map(([name, bytes]) => ({ name, bytes, percent: bytes / total * 100 }));
  rows.push({ name: 'Otros', bytes: ordered.slice(4).reduce((sum, [, bytes]) => sum + bytes, 0), percent: ordered.slice(4).reduce((sum, [, bytes]) => sum + bytes, 0) / total * 100 });
  return { total, rows };
}

const languageStyle = {
  TypeScript: { icon: 'typescript', color: '#62B7FF', label: 'TypeScript' },
  JavaScript: { icon: 'javascript', color: '#F2D46B', label: 'JavaScript' },
  PLpgSQL: { icon: 'postgresql', color: '#80B5E4', label: 'PostgreSQL SQL' },
  CSS: { icon: 'css', color: '#BCA8F3', label: 'CSS' },
  Java: { icon: 'openjdk', color: '#E39D76', label: 'Java' },
  Rust: { icon: 'rust', color: '#E4AF87', label: 'Rust' },
  Shell: { icon: 'gnubash', color: '#9FD5B6', label: 'Shell' },
  Otros: { icon: null, color: '#71839B', label: 'Otros' },
};

async function chartIcon(name, x, y, color) {
  if (!name) return `<circle cx="${x + 13}" cy="${y + 13}" r="8" fill="${color}"/>`;
  const svg = await readFile(path.join(assets, 'icons', `${name}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"\/>/)?.[1];
  if (!d) throw new Error(`No SVG path in icon ${name}`);
  return `<g transform="translate(${x} ${y}) scale(1.08)"><path d="${d}" fill="${color}"/></g>`;
}

async function chart(data) {
  const own = summarize(data, 'own');
  const openSource = summarize(data, 'openSource');
  const panels = [
    { title: 'PROYECTOS PROPIOS', count: data.groups.own.length, x: 27, rows: own.rows },
    { title: 'CÓDIGO ABIERTO · FORKS', count: data.groups.openSource.length, x: 491, rows: openSource.rows },
  ];
  let content = '';
  let rowIndex = 0;
  for (const panel of panels) {
    content += `<rect x="${panel.x}" y="124" width="442" height="393" rx="18" fill="#121F31" stroke="#2A3B50"/>`;
    content += `<text x="${panel.x + 24}" y="163" fill="#F3F7FB" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700">${panel.title}</text>`;
    content += `<text x="${panel.x + 24}" y="187" fill="#AABBD0" font-family="Arial,Helvetica,sans-serif" font-size="15">${panel.count} repositorios</text>`;
    for (let i = 0; i < panel.rows.length; i++) {
      const row = panel.rows[i];
      const style = languageStyle[row.name] ?? { icon: null, color: '#71839B', label: row.name };
      const y = 216 + i * 58;
      const width = Math.max(2, 255 * row.percent / 100);
      content += await chartIcon(style.icon, panel.x + 25, y - 17, style.color);
      content += `<text x="${panel.x + 60}" y="${y + 3}" fill="#DBE6F0" font-family="Arial,Helvetica,sans-serif" font-size="17">${escapeXml(style.label)}</text>`;
      content += `<text x="${panel.x + 412}" y="${y + 3}" text-anchor="end" fill="#F3F7FB" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700">${row.percent.toFixed(1)}%</text>`;
      content += `<rect x="${panel.x + 60}" y="${y + 14}" width="352" height="9" rx="4.5" fill="#2B3A4E"/>`;
      content += `<rect class="bar" style="animation-delay:${(rowIndex++ * .11).toFixed(2)}s" x="${panel.x + 60}" y="${y + 14}" width="${(352 * row.percent / 100).toFixed(2)}" height="9" rx="4.5" fill="${style.color}"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="548" viewBox="0 0 960 548" role="img" aria-labelledby="chart-title chart-desc">
<title id="chart-title">Lenguajes usados en proyectos propios y forks públicos</title>
<desc id="chart-desc">Porcentaje de bytes por lenguaje según GitHub Linguist. Proyectos propios: TypeScript ${own.rows[0].percent.toFixed(1)} por ciento, JavaScript ${own.rows[1].percent.toFixed(1)} por ciento, PostgreSQL SQL ${own.rows[2].percent.toFixed(1)} por ciento, CSS ${own.rows[3].percent.toFixed(1)} por ciento. Código abierto: TypeScript ${openSource.rows[0].percent.toFixed(1)} por ciento y Rust ${openSource.rows[1].percent.toFixed(1)} por ciento.</desc>
<style>
  .bar { transform-box: fill-box; transform-origin: left center; animation: reveal 1.05s cubic-bezier(.2,.7,.1,1) both; }
  @keyframes reveal { from { transform: scaleX(0); opacity: .35; } to { transform: scaleX(1); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .bar { animation: none; } }
</style>
<rect x="1" y="1" width="958" height="546" rx="22" fill="#0E1726" stroke="#2A3B50" stroke-width="2"/>
<path d="M30 2h260" stroke="#62B7FF" stroke-width="3" stroke-linecap="round"/>
<text x="30" y="55" fill="#F4F7FB" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="700">Tecnologías en mis repositorios</text>
<text x="30" y="86" fill="#AFC1D4" font-family="Arial,Helvetica,sans-serif" font-size="17">Distribución del código por lenguaje · GitHub Linguist · ${escapeXml(data.fetchedOn)}</text>
${content}
<text x="30" y="537" fill="#8498B0" font-family="Arial,Helvetica,sans-serif" font-size="14">Porcentaje de bytes de código; los valores mostrados están redondeados.</text>
</svg>\n`;
}

if (process.argv.includes('--refresh')) await refreshData();
const data = JSON.parse(await readFile(dataFile, 'utf8'));
for (const project of projects) await writeFile(path.join(assets, `card-${project.file}.svg`), card(project));
await writeFile(path.join(assets, 'technology-usage.svg'), await chart(data));
