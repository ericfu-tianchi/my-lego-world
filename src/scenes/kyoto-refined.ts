// Kyoto / Higashiyama: a continuous lane between a tea shop, machiya and a five-storey pagoda.
// Kept separate from Kyoto B so the original CC sample remains directly comparable.
import * as THREE from 'three';
import { RIG } from '../parts/ldraw/minifig-rig';
import { Blueprint } from '../core/builder';
import { ldrawPart, PARTS } from '../core/catalog';
import { bakedBox, ldrawGeometry } from '../core/ldraw';
import { Reserve, overhangPlate, spanPlates, minifig2, paperLantern, stoneLantern, rotv, type SceneMeta } from './lib';

// 2423 has six real top connectors. Its collision bounds include the entire leaf, not only its stem.
const bb = bakedBox('2423');
const LEAF_STUDS: [number, number][] = [[0, 0], [-1, 1], [1, 1], [-1, 2], [1, 2], [0, 3]];
ldrawPart({ key: 'foliage_2423', id: '2423', bl: '2423', name: 'Plant Leaves 4 x 3', zh: '小枝叶（完整包围盒）', cat: 'plant', w: 1, d: 1, h: 1, studs: 'none', studPoints: LEAF_STUDS, accepts: true, hollow: true, anchor: 'origin', lift: 1, ext: [bb[0], bb[3], bb[2], bb[5]], showColor: 'White' });

// A rigid cup transform: its 3.2 mm handle axis follows the 3820 hand's 14.5° clip axis.
// Coordinates from LDraw 3899s01.dat: handle centre (0,11,20) LDU; no mesh stretching or arbitrary grip offsets.
const cupRotation = new THREE.Matrix4().makeRotationZ(9.782*Math.PI/180)
  .multiply(new THREE.Matrix4().makeRotationX(14.5*Math.PI/180))
  .multiply(new THREE.Matrix4().makeRotationY(Math.PI/2));
const cupHandle = new THREE.Vector3(0,-.55,-1).applyMatrix4(cupRotation);
const grip = new THREE.Vector3(...RIG.grip.lf);
const cupGeometry = ldrawGeometry('3899',3,0,'origin').clone().translate(0,.6,0)
  .applyMatrix4(cupRotation).translate(grip.x-cupHandle.x,grip.y-cupHandle.y+.6,grip.z-cupHandle.z);
cupGeometry.computeBoundingBox();
const cupBox=cupGeometry.boundingBox!;
PARTS.tea_cup_gripped = {...PARTS.cup,key:'tea_cup_gripped',name:'Cup in left hand, axis-aligned grip',
  accepts:false,gripMate:'fig_hands_fd',
  ext:[cupBox.min.x,cupBox.max.x,cupBox.min.z,cupBox.max.z],
  extY:[(cupBox.min.y+.6)/.4,(cupBox.max.y+.6)/.4],build:()=>cupGeometry};

export function buildKyotoRefined(bp: Blueprint): SceneMeta {
  bp.compact = true;
  const W = 64, D = 48, G = 8, R = new Reserve();
  const island = (x: number, z: number) => {
    const dx = Math.max(Math.abs(x + .5 - 32) - 22, 0), dz = Math.max(Math.abs(z + .5 - 24) - 14, 0);
    return dx * dx + dz * dz < 9 * 9;
  };
  const pond = (x: number, z: number) => ((x + .5 - 33) / 13) ** 2 + ((z + .5 - 30) / 7) ** 2 < 1;
  const stream = (x: number, z: number) => x < 29 && z >= 22 && z < 25;
  const water = (x: number, z: number) => pond(x, z) || stream(x, z);
  // Three quiet materials, in broad patches. No random lime confetti on the lawn.
  bp.tag = 'terrain';
  for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) {
    if (!island(x, z)) continue;
    const wet = water(x, z), top = wet ? 5 : 7;
    bp.vox1('plate', x, 0, z, 'DarkBluishGray');
    for (let y = 1; y < top; y++) bp.vox1('brick', x, y, z, y < 4 ? 'DarkBluishGray' : 'DarkTan');
    if (wet) {
      bp.vox1('plate', x, 5, z, 'DarkTurquoise'); bp.vox1('tile', x, 6, z, 'TransLightBlue'); R.add(x, z, 1, 1);
    } else {
      bp.vox1('plate', x, top, z, Math.sin(x*.23)+Math.cos(z*.32)+Math.sin((x+z)*.13) > .6 ? 'OliveGreen' : 'Green');
    }
  }
  // Continuous stone lane, with generous landings and no tiles under standing figures.
  const road = (x: number, z: number, w: number, d: number) => {
    for (let a=x; a<x+w; a++) for (let b=z; b<z+d; b++) if (island(a,b) && !water(a,b)) {
      bp.vox1('plate', a, 7, b, 'DarkTan'); bp.vox1('tile', a, 8, b, 'Tan'); R.add(a,b,1,1);
    }
  };
  road(23, 14, 8, 8); road(22, 19, 20, 3); road(39, 19, 9, 8);
  road(35, 38, 7, 8); road(22, 37, 19, 4); road(22, 29, 5, 11);

  pagoda(bp, 47, 12, G, R);
  machiya(bp, 10, 10, G, 12, 8, 'tea', R);
  machiya(bp, 10, 28, G, 10, 6, 'craft', R);
  stoneBridge(bp, 35, 26, G, R);
  torii(bp, 36, 42, G + 1, R);
  // Replace road tiles under the gate's two plinths with a real studded layer.
  bp.clear(35, 8, 41, 3, 1, 3); bp.clear(40, 8, 41, 3, 1, 3);
  bp.fill('plate', 35, 8, 41, 3, 1, 3, 'Tan'); bp.fill('plate', 40, 8, 41, 3, 1, 3, 'Tan');

  // Three deliberately asymmetrical crowns: branches spread horizontally before flowering.
  cherry(bp, 29, G, 6, 15, 0, R);
  cherry(bp, 55, G, 34, 9, 1, R);
  cherry(bp, 15, G, 42, 6, 2, R);

  // Stone retaining wall and approach to the pagoda, tying the monument into the lane.
  bp.tag = 'temple approach';
  for (let z = 21; z < 24; z++) {
    const h = 23 - z;
    bp.clear(44, 8, z, 6, 1, 1);
    bp.fill('plate', 44, G, z, 6, h, 1, 'LightBluishGray');
    bp.fill('tile', 44, G+h, z, 6, 1, 1, 'LightBluishGray'); R.add(44,z,6,1);
  }
  for (const [x,z] of [[51,26],[27,17],[29,38]] as [number,number][]) {   // (51,25): the centred lantern base needs a clear cell west of the post
    if (!R.has(x,z)) { stoneLantern(bp,x,G,z,R); }
  }
  // Garden beds are grouped at building corners and under trees; the water remains open.
  bp.tag = 'garden';
  for (const [x,z] of [[8,17],[7,29],[23,10],[51,22],[56,26],[51,37],[19,42],[31,42],[8,37],[26,5]] as [number,number][]) {
    if (R.has(x,z) || R.has(x+2,z+2) || !island(x,z)) continue;
    bp.part('plate_2x3',x,G,z,'DarkGreen');
    for (const [dx,dz] of [[0,0],[1,1],[0,2]]) {
      bp.part('roundplate_1x1',x+dx,G+1,z+dz,'DarkGreen');
      bp.part('petal_1x1',x+dx,G+2,z+dz,'White');
    }
    R.add(x,z,2,3);
  }
  // Bank stones sit on dry land; no animal moulds masquerading as giant fish.
  bp.tag = 'bank';
  for(let x=4;x<60;x++) for(let z=18;z<39;z++) {
    if(!island(x,z)||water(x,z)||R.has(x,z)) continue;
    const near=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>water(x+a,z+b));
    if(!near || (x+z)%3!==0)continue;
    bp.part('cheese_1x1',x,G,z,'LightBluishGray',(x+z)%4); R.add(x,z,1,1);
  }
  // Two vignettes, at minifigure scale. Accessories receive a dedicated grip pass below.
  bp.tag='minifig';
  bp.clear(24,8,17,3,1,3); bp.fill('plate',24,8,17,3,1,3,'Tan');
  minifig2(bp,25.5,9,18.5,0,{legs:'DarkBlue',torso:'DarkBlue',face:'face_smile',torsoPrint:'torso_kimono_indigo',hair:'Black',hairKey:'hair_topknot',poses:{L:'f'}},R);
  bp.part('tea_cup_gripped',25,15,18,'White');
  bp.clear(23,8,35,3,1,3); bp.fill('plate',23,8,35,3,1,3,'Tan');
  minifig2(bp,24.5,9,36.5,1,{legs:'DarkTan',torso:'DarkTan',face:'face_calm',torsoPrint:'torso_monk'},R);
  // A small tea tray within reach, and a cat on the shop's wooden veranda.
  bp.tag='tea utensils';
  bp.clear(28,8,17,1,1,1);bp.part('plate_1x1',28,8,17,'Tan');
  bp.part('round_1x1',28,9,17,'DarkBrown'); bp.part('plate_2x2',27.5,12,16.5,'ReddishBrown');
  bp.part('cup',28.5,13,16.5,'White',1);
  bp.part('cat',11,9,36,'White',1);
  bp.tag=''; bp.pack();
  return {id:'kyoto-refined',title:'Kyoto',caption:'Higashiyama',subtitle:'Tea by the water · five-storey pagoda · cherry blossom lane',size:[W,D],center:[32,12,24],base:0,camera:{az:.52,el:.48,dist:123}};
}

/** Five full storeys, narrow timber frames, deep charcoal eaves and a thin bronze sōrin. */
function pagoda(bp:Blueprint,cx:number,cz:number,y0:number,R:Reserve){
  bp.tag='pagoda'; R.add(cx-9,cz-9,18,19);
  bp.fill('plate',cx-8,y0,cz-8,16,1,16,'DarkBluishGray');
  bp.fill('plate',cx-7,y0+1,cz-7,14,2,14,'LightBluishGray');
  let y=y0+3;
  [10,8,6,4,2].forEach((S,ti)=>{
    const H=[10,8,7,6,5][ti],x=cx-S/2,z=cz-S/2;
    overhangPlate(bp,x-1,z-1,S+2,S+2,y,'DarkBrown');
    // Hollow frame: continuous corner posts and cream infill; no slab pretending to be a storey.
    for(let a=0;a<S;a++)for(let b=0;b<S;b++){
      if(a!==0&&a!==S-1&&b!==0&&b!==S-1)continue;
      const post=(a===0||a===S-1)&&(b===0||b===S-1);
      for(let h=0;h<H;h++){
        const window=h>=2&&h<H-2&&!post;
        const mullion=(a%3===0&&(b===0||b===S-1))||(b%3===0&&(a===0||a===S-1));
        bp.vox1('brick',x+a,y+1+h,z+b,post||mullion?'ReddishBrown':window?'Tan':'DarkBrown');
      }
    }
    // Small balcony grilles, at least a full stud clear of the wall.
    if(S>=6)for(let a=1;a+4<=S+1;a+=4){
      bp.part('fence_1x4',x-1+a,y+1,z-1,'DarkBrown'); bp.part('fence_1x4',x-1+a,y+1,z+S,'DarkBrown');
    }
    const eave=y+H+1;
    overhangPlate(bp,x-1,z-1,S+2,S+2,eave,'ReddishBrown');
    hipRoof(bp,cx,cz,S+4,eave+1);
    y=eave+5;
  });
  // A 2x2 plate bridges the four surviving inner roof studs before the central jumper.
  bp.part('plate_2x4',cx-1,y,cz-2,'Black');
  bp.part('jumper_2x2',cx-1,y+1,cz-1,'Black');
  y++;
  bp.part('cone_1x1',cx-.5,y+1,cz-.5,'PearlGold');
  bp.part('bar_4l',cx-.5,y+4,cz-.5,'PearlGold');
  for(let k=0;k<4;k++)bp.part('roundplate_open',cx-.5,y+4+k*2,cz-.5,'PearlGold');
  bp.part('cone_1x1',cx-.5,y+11,cz-.5,'PearlGold');
}
function hipRoof(bp:Blueprint,cx:number,cz:number,S:number,y:number){
  const x=cx-S/2,z=cz-S/2;
  overhangPlate(bp,x,z,S,S,y,'Black');
  // Shallow perimeter lip, inward slopes, and a solid core carrying the next storey.
  for(let k=0;k<S;k++){
    bp.part('tile_1x1',x+k,y+1,z,'Black'); bp.part('tile_1x1',x+k,y+1,z+S-1,'Black');
    if(k>0&&k<S-1){bp.part('tile_1x1',x,y+1,z+k,'Black');bp.part('tile_1x1',x+S-1,y+1,z+k,'Black');}
  }
  if(S===6){
    for(const [dx,dz,r]of [[1,1,2],[3,1,2],[1,3,0],[3,3,0]])bp.part('slope_2x2',x+dx,y+1,z+dz,'Black',r);
    return;
  }
  for(let k=3;k<S-3;k++){
    bp.part('slope_1x2',x+k,y+1,z+1,'Black',2); bp.part('slope_1x2',x+k,y+1,z+S-3,'Black');
    bp.part('slope_1x2',x+1,y+1,z+k,'Black',3); bp.part('slope_1x2',x+S-3,y+1,z+k,'Black',1);
  }
  for(const [dx,dz,rot]of [[1,1,2],[S-3,1,3],[1,S-3,1],[S-3,S-3,0]])bp.part('slope_corner_2x2',x+dx,y+1,z+dz,'Black',rot);
  if(S>6)bp.fill('brick',x+3,y+1,z+3,S-6,3,S-6,'DarkBrown');

}

/** Timber shop with a real lattice door, recessed shoji, a deep engawa and a tiled gable roof. */
function machiya(bp:Blueprint,x:number,z:number,y:number,w:number,d:number,kind:'tea'|'craft',R:Reserve){
  bp.tag=kind==='tea'?'tea shop':'machiya'; R.add(x-2,z-2,w+4,d+6);
  bp.fill('plate',x-1,y,z-1,w+2,1,d+4,'ReddishBrown');
  const fy=y+1,H=18;
  for(let a=0;a<w;a++)for(let b=0;b<d;b++){
    if(a!==0&&a!==w-1&&b!==0&&b!==d-1)continue;
    const front=b===d-1,door=front&&a>=2&&a<6,win=front&&a>=7&&a<9;
    if(door)continue;
    for(let h=0;h<H;h++){
      if(win&&h>=6&&h<15)continue;
      const timber=a===0||a===w-1||h<3||h>=16||(b===0&&a%4===0);
      bp.vox1('brick',x+a,fy+h,z+b,timber?'DarkBrown':kind==='tea'?'Tan':'White');
    }
  }
  bp.part('doorframe_1x4x6',x+2,fy,z+d-1,'DarkBrown'); bp.part('door_lattice',x+2,fy,z+d-1,'ReddishBrown');
  bp.part('window_1x2x3',x+7,fy+6,z+d-1,'DarkBrown'); bp.part('pane_lattice_1x2x3',x+7,fy+6,z+d-1,'White');
  // Side windows built from genuine grille bricks, replacing wall cells.
  for(const b of [2,4])if(b+1<d-1){
    bp.clear(x+w-1,fy+6,z+b,1,6,2);
    bp.part('brick_grille_1x2',x+w-1,fy+6,z+b,'DarkBrown',1);bp.part('brick_grille_1x2',x+w-1,fy+9,z+b,'DarkBrown',1);
  }
  const ry=fy+H;
  spanPlates(bp,x-1,z-1,w+2,d+2,ry,'DarkBrown');
  gableRoof(bp,x-1,z-1,w+2,d+2,ry+1);
  // Separate lean-to eave above the veranda, supported by two wooden columns.
  for(const px of [x-1,x+w]){bp.fill('brick',px,fy,z+d+1,1,12,1,'ReddishBrown');}
  bp.part('plate_2x8',x-1,fy+12,z+d,'DarkBrown',1);
  bp.part(w===12?'plate_2x6':'plate_2x4',x+7,fy+12,z+d,'DarkBrown',1);
  for(let a=0;a<w+2;a++)bp.part('curve_1x2',x-1+a,fy+13,z+d,'Black');
  // Lanterns sit on short posts; no fake invisible hanging connector.
  for(const px of [x,x+w-1]){bp.part('round_1x1',px,fy,z+d+2,'DarkBrown');paperLantern(bp,px,fy+3,z+d+2,'lantern_kyo');}
  // Glazed tea sign, and plank-like veranda tiles; the cat's studs are kept uncovered.
  for(let a=1;a<w-1;a+=2)bp.part('tile_1x2',x+a,fy,z+d,'DarkTan',1);
}
function gableRoof(bp:Blueprint,x:number,z:number,w:number,d:number,y:number){
  // All roof strips span in x, so each is locked onto the front/back wall plate.
  let lo=0,hi=d,level=y;
  while(hi-lo>2){
    const depth=hi-lo===4?2:3;
    for(let a=0;a<w;a++){
      bp.part(`slope_1x${depth}`,x+a,level,z+lo,'Black',2);bp.part(`slope_1x${depth}`,x+a,level,z+hi-depth,'Black');
    }
    if(hi-lo>6)bp.fill('brick',x,level,z+lo+3,w,3,hi-lo-6,'DarkBluishGray');
    lo+=depth-1;hi-=depth-1;level+=3;
  }
  for(let a=0;a<w;a+=2)bp.part('ridge_2x2',x+a,level,z+lo,'Black');
}

function stoneBridge(bp:Blueprint,x:number,z:number,y:number,R:Reserve){
  bp.tag='bridge';R.add(x-1,z-3,8,14);
  // Four piers descend through an opening in the tiled water surface to the studded bed.
  for(const a of [x,x+5])for(const b of [z,z+7]){
    bp.clear(a,6,b,1,1,1); bp.fill('plate',a,6,b,1,y-6,1,'DarkBluishGray');
  }
  bp.part('arch_1x8x2',x,y,z,'LightBluishGray',1);bp.part('arch_1x8x2',x+5,y,z,'LightBluishGray',1);
  for(let b=0;b<8;b+=2)bp.part('plate_2x6',x,y+6,z+b,'DarkTan',1);
  bp.fill('tile',x+1,y+7,z,4,1,8,'Tan');
  for(const a of [x,x+5]){
    bp.part('fence_1x4',a,y+7,z,'DarkBrown',1);bp.part('fence_1x4',a,y+7,z+4,'DarkBrown',1);
  }
  for(let k=1;k<=3;k++)for(const b of [z-k,z+7+k]){
    // Supports are solid abutments founded on land / the pond bed, not on transparent tiles.
    const wet=b>=23&&b<=37;const base=wet?6:8;
    bp.clear(x,6,b,6,3,1);
    const top=y+7-2*k;bp.fill('plate',x,base,b,6,top-base,1,'DarkBluishGray');bp.fill('tile',x,top,b,6,1,1,'Tan');
  }
}
function torii(bp:Blueprint,x:number,z:number,y:number,R:Reserve){
  bp.tag='torii';R.add(x-2,z-2,10,4);
  for(const px of [x,x+5]){
    bp.part('jumper_2x2',px-.5,y,z-.5,'LightBluishGray');
    for(let k=0;k<4;k++)bp.part('round_1x1',px,y+1+k*3,z,'BrightRed');
  }
  bp.part('plate_1x8',x-1,y+13,z,'BrightRed',1);
  for(const px of [x,x+5])bp.part('round_1x1',px,y+14,z,'BrightRed');
  bp.part('brick_1x2',x+2,y+14,z,'BrightRed',1);
  bp.part('plate_1x8',x-1,y+17,z,'BrightRed',1);
  bp.part('plate_1x8',x-1,y+18,z,'Black',1);
  bp.part('tile_1x6',x,y+19,z,'Black',1);
  bp.part('curve_1x2',x-2,y+19,z,'Black',1);bp.part('curve_1x2',x+6,y+19,z,'Black',3);
}

/** Branches and crowns are built from actual studs; upper leaf tiers lock onto lower leaf studs. */
function cherry(bp:Blueprint,x:number,y:number,z:number,trunk:number,turn:number,R:Reserve){
  bp.tag='cherry';R.add(x-7,z-5,15,12);
  bp.part('plate_4x4',x-2,y,z-2,'DarkBrown');
  for(let k=0;k<trunk;k+=3)bp.part('roundbrick_2x2',x-1,y+1+k,z-1,'ReddishBrown');
  for(const [a,b,r] of [[-2,-1,3],[1,-1,1],[-1,-2,2],[-1,1,0]])bp.part('cheese_1x1',x+a,y+1,z+b,'ReddishBrown',r);
  const forkY=y+1+trunk;
  bp.part('plate_2x6',x-3,forkY,z-1,'ReddishBrown',1);
  const crowns:{x:number;y:number;z:number;r:number}[]=[];
  const leaf=(lx:number,ly:number,lz:number,r:number)=>{crowns.push({x:lx,y:ly,z:lz,r});bp.part('foliage_2423',lx,ly,lz, crowns.length%3===0?'White':'BrightPink',r);};
  const branches:[number,number,number,number][]=[[-3,1,-1,3],[2,4,0,1],[-1,7,-1,2],[0,10,0,0]];
  for(const[dx,dy,dz,r]of branches){
    for(let k=0;k<dy;k++)bp.part('roundplate_1x1',x+dx,forkY+1+k,z+dz,'ReddishBrown');
    const lx=x+dx,ly=forkY+1+dy,lz=z+dz;leaf(lx,ly,lz,r);
    // At the distal stud the branch forks into a second leaf. Another pair of offsets give each crown a different outline.
    const [a,b]=rotv(0,3,r);leaf(lx+a,ly+1,lz+b,(r+1)%4);
    const [c,d]=rotv(0,3,(r+1)%4);leaf(lx+a+c,ly+2,lz+b+d,(r+2)%4);
  }
  const bounds=(l:typeof crowns[number])=>{const cs=[[bb[0],bb[2]],[bb[0],bb[5]],[bb[3],bb[2]],[bb[3],bb[5]]].map(([a,b])=>rotv(a,b,l.r));return[Math.min(...cs.map(c=>c[0]))+l.x+.5,Math.max(...cs.map(c=>c[0]))+l.x+.5,Math.min(...cs.map(c=>c[1]))+l.z+.5,Math.max(...cs.map(c=>c[1]))+l.z+.5];};
  // Flower plates occupy the exposed top connectors only: overlapping leaf tiers are not carpeted with hidden flowers.
  for(const l of crowns)for(const[dx,dz]of LEAF_STUDS){
    const [a,b]=rotv(dx,dz,l.r),px=l.x+a,pz=l.z+b;
    const covered=crowns.some(other=>{
      if(other===l||other.y<l.y+1||other.y>l.y+2)return false;
      const e=bounds(other);return Math.min(e[1],px+1)-Math.max(e[0],px)>.1&&Math.min(e[3],pz+1)-Math.max(e[2],pz)>.1;
    });
    if(!covered)bp.part('petal_1x1',px,l.y+1,pz,(Math.round(px+pz)+turn)%4===0?'BrightPink':'White');
  }
  for(const[a,b]of [[-3,2],[2,-3],[3,2],[-2,-3]])bp.part('petal_1x1',x+a,y,z+b,'BrightPink');
}
