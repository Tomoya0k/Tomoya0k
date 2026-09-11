import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCalendar,renderCalendar} from '../scripts/activity.mjs';
const html=()=>Array.from({length:365},(_,i)=>{const date=new Date(Date.UTC(2025,0,1+i)).toISOString().slice(0,10),count=i%11===0?4:0;return `<td data-date="${date}" id="day-${i}" data-level="${count?2:0}"></td><tool-tip for="day-${i}">${count?`${count} contributions`:'No contributions'} on date.</tool-tip>`;}).join('');
test('extrae actividad pública real sin inventar días ni cantidades',()=>{const days=parseCalendar(html());assert.equal(days.length,365);assert.equal(days.reduce((sum,d)=>sum+d.count,0),136);const svg=renderCalendar(days);assert.ok(svg.includes('136 contribuciones'));assert.ok(svg.includes('34 días activos'));assert.equal((svg.match(/<title>2025-/g)??[]).length,365);});
test('no reemplaza una imagen válida cuando GitHub devuelve datos incompletos',()=>{for(const input of ['rate limited',html().replace('4 contributions','unknown'),html().replace('data-date="2025-01-01"','data-date="2025-01-02"')])assert.throws(()=>parseCalendar(input));});
