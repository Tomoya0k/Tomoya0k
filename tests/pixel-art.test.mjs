import test from 'node:test';
import assert from 'node:assert/strict';
import {pixelText,sprite,frame} from '../scripts/pixel-art.mjs';

test('pixel font renders accents, digits and accessible labels without remote fonts',()=>{
  const svg=pixelText('DÍAS 0123456789',20,30,2);
  assert.match(svg,/aria-label="DÍAS 0123456789"/);
  assert.match(svg,/<path d="M/);
  assert.match(svg,/shape-rendering="crispEdges"/);
  assert.doesNotMatch(svg,/https?:|<text|font-family/);
  assert.throws(()=>pixelText('?',0,0));
});
test('sprites draw only colored pixels and frames stay within their canvas',()=>{
  const svg=sprite('1./.1',10,20,4,{'1':'#fff'});
  assert.equal((svg.match(/<rect/g)??[]).length,2);
  assert.match(svg,/x="14" y="24"/);
  assert.match(frame(480,224),/H478V212H468V222/);
});
