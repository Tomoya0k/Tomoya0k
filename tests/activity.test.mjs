import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCalendar,renderCalendar} from '../scripts/activity.mjs';
const html=()=>Array.from({length:365},(_,i)=>{const date=new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10),count=i%11===0?4:0;return `<td data-date="${date}" id="day-${i}" data-level="${count?2:0}"></td><tool-tip for="day-${i}">${count?`${count} contributions`:'No contributions'} on date.</tool-tip>`;}).join('');
test('extrae actividad pública real sin inventar días ni cantidades',()=>{const days=parseCalendar(html());assert.equal(days.length,365);assert.equal(days.reduce((sum,d)=>sum+d.count,0),136);const svg=renderCalendar(days);assert.ok(svg.includes('136 contribuciones'));assert.ok(svg.includes('34 días activos'));assert.equal((svg.match(/<title>2025-/g)??[]).length,365);});
test('no reemplaza una imagen válida cuando GitHub devuelve datos incompletos',()=>{for(const input of ['rate limited',html().replace('4 contributions','unknown'),html().replace('data-date="2025-01-01"','data-date="2025-01-02"')])assert.throws(()=>parseCalendar(input));});
test('la intensidad carmesí corresponde al nivel y coincide con la leyenda',()=>{
  const days=parseCalendar(html()).map((day,i)=>({...day,level:i%5,count:i%5}));
  const svg=renderCalendar(days);
  const cells=[...svg.matchAll(/<rect[^>]+fill="(#[0-9a-f]+)"[^>]*><title>\d{4}-/g)].map(match=>match[1]);
  const legend=[...svg.matchAll(/<rect[^>]+y="315"[^>]+fill="(#[0-9a-f]+)"/g)].map(match=>match[1]);
  const palette=['#241218','#65162a','#a51d3d','#df2b50','#ff657c'];
  assert.deepEqual(legend,palette);
  assert.equal(cells.length,days.length);
  cells.forEach((fill,i)=>assert.equal(fill,palette[i%5]));
});
