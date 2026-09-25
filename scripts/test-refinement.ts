import assert from 'node:assert/strict';
import { Blueprint } from '../src/core/builder';
import { SCENES } from '../src/scenes';
import { validate } from '../src/core/validate';

const bp=new Blueprint(19);SCENES['kyoto-refined'].build(bp);
assert.equal(validate(bp.parts).ok,true,'refined scene must pass geometry/connectivity gate');
assert.ok(bp.parts.length<3000,'compact packing must keep the scene under 3000 placements');
for(const corrupt of ['translate','rotate'] as const){
  const parts=bp.parts.map(p=>({...p}));const cup=parts.find(p=>p.key==='tea_cup_gripped')!;
  if(corrupt==='translate')cup.x+=.5;else cup.rot=(cup.rot+1)%4;
  const r=validate(parts);assert.ok(r.issues.some(i=>i.kind==='floating'&&parts[i.index]===cup),`${corrupt} must break the exact hand mate`);
}
const leaves=new Blueprint();
leaves.part('foliage_2423',0,0,0,'White');leaves.part('foliage_2423',1,0,0,'White');
assert.ok(validate(leaves.parts).overlaps>0,'full leaf silhouettes must collide even when the stem cells do not overlap');
const flower=new Blueprint();flower.part('foliage_2423',0,0,0,'White');flower.part('petal_1x1',0,1,3,'BrightPink');
assert.equal(validate(flower.parts).ok,true,'the distal, documented stud must support a blossom');
flower.parts[1].x+=.8;
assert.ok(validate(flower.parts).floating>0,'a blossom moved off the distal connector must float');
console.log('PASS: scene, part budget, grip translation/rotation, leaf collision and distal connector checks');
