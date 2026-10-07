import type { SceneDef } from './lib';
import { buildKyotoRefined } from './kyoto-refined';
import { buildKyoto } from './kyoto';
import { buildTokyo } from './tokyo';
import { buildPartsheet } from './partsheet';
import { buildTrees } from './trees';
import { buildSgParts } from './sg-parts';
import { buildSingapore } from './singapore-island';
import { buildSgV3 } from './sg-v3';
import { buildSgV4 } from './sg-v4';
import { buildCzLm } from './cz-lm';
import { buildFrLm } from './fr-lm';
import { buildParis } from './paris';
import { buildFrSeine } from './fr-seine';
import { buildFrHc } from './fr-hc';
import { buildFrNd } from './fr-nd';
import { buildCzSwan } from './cz-swan';
import { buildPrague } from './prague';
import { buildCzSquare } from './cz-square';
import { buildCzOrloj } from './cz-orloj';
import { buildCzBridge } from './cz-bridge';
import { buildCzHouses } from './cz-houses';
import { buildShParts } from './sh-parts';
import { buildShBund } from './sh-bund';
import { buildShanghai } from './shanghai-island';
import { buildThLm } from './th-lm';
import { buildPattaya } from './pattaya';
import { buildLaPier } from './la-pier';
import { buildLaSign } from './la-sign';
import { buildLaGriffith } from './la-griffith';
import { buildLaVenice } from './la-venice';
import { buildLaLife } from './la-life';
import { buildLa } from './la-island';
import { buildDeNs, buildDeCol } from './de-ns';
import { buildNeuschwanstein } from './neuschwanstein';
export const SCENES: Record<string, SceneDef> = { pattaya: { seed: 73, build: buildPattaya }, 'th-lm': { seed: 71, build: buildThLm }, 'de-ns': { seed: 71, build: buildDeNs }, 'de-col-a': { seed: 71, build: buildDeCol('a') }, 'de-col-b': { seed: 71, build: buildDeCol('b') }, 'de-col-c': { seed: 71, build: buildDeCol('c') }, neuschwanstein: { seed: 73, build: buildNeuschwanstein }, la: { seed: 83, build: buildLa }, 'la-pier': { seed: 61, build: buildLaPier }, 'la-sign': { seed: 67, build: buildLaSign }, 'la-griffith': { seed: 71, build: buildLaGriffith }, 'la-venice': { seed: 73, build: buildLaVenice }, 'la-life': { seed: 79, build: buildLaLife }, paris: { seed: 67, build: buildParis }, 'fr-lm': { seed: 61, build: buildFrLm }, 'fr-seine': { seed: 61, build: buildFrSeine }, 'fr-hc': { seed: 61, build: buildFrHc }, 'fr-nd': { seed: 61, build: buildFrNd }, 'sh-parts': { seed: 31, build: buildShParts }, 'sh-bund': { seed: 37, build: buildShBund }, shanghai: { seed: 41, build: buildShanghai }, 'cz-swan': { seed: 59, build: buildCzSwan }, 'cz-square': { seed: 53, build: buildCzSquare }, prague: { seed: 47, build: buildPrague }, 'cz-lm': { seed: 31, build: buildCzLm }, 'cz-orloj': { seed: 37, build: buildCzOrloj }, 'cz-bridge': { seed: 41, build: buildCzBridge }, 'cz-houses': { seed: 43, build: buildCzHouses }, 'sg-v4': { seed: 5, build: buildSgV4 }, 'sg-v3': { seed: 5, build: buildSgV3 }, 'kyoto-refined': { seed: 19, build: buildKyotoRefined }, kyoto: { seed: 7, build: buildKyoto }, tokyo: { seed: 11, build: buildTokyo }, partsheet: { seed: 3, build: buildPartsheet }, trees: { seed: 5, build: buildTrees }, 'sg-parts': { seed: 23, build: buildSgParts }, singapore: { seed: 29, build: buildSingapore } };
import { buildKoNamsan } from './ko-namsan';
SCENES['ko-namsan'] = { seed: 89, build: buildKoNamsan() }; SCENES['ko-namsan-hill'] = { seed: 89, build: buildKoNamsan('namsan') }; SCENES['ko-bugaksan'] = { seed: 89, build: buildKoNamsan('bugaksan') };   // Seoul · Namsan + Bugaksan element test scenes
// Seoul · K-pop comeback stage element test scene (2026-10-06)
import { buildKoStage } from './ko-stage';
SCENES['ko-stage'] = { seed: 89, build: buildKoStage };
// Seoul · the Han front strip (2026-10-06)
import { buildKoHangang, buildKoHangangSwatch } from './ko-hangang';
Object.assign(SCENES, { 'ko-hangang': { seed: 89, build: buildKoHangang }, 'ko-hangang-swatch': { seed: 89, build: buildKoHangangSwatch } });
// ---- Korea · Seoul figures (ko-life, 2026-10-06)
import { buildKoLife } from './ko-life';
SCENES['ko-life'] = { seed: 89, build: buildKoLife };
import { buildKoHanok } from './ko-hanok';
SCENES['ko-hanok'] = { seed: 97, build: buildKoHanok };   // Seoul · Bukchon element test scene
import { buildKoPalace } from './ko-palace';
SCENES['ko-palace'] = { seed: 89, build: buildKoPalace };   // Seoul · Gwanghwamun element test scene
// ---- South Korea · Seoul island (2026-10-06)
import { buildSeoul } from './seoul-island';
SCENES.seoul = { seed: 101, build: buildSeoul };
// ---- South Korea · Seoul island v2 blockout (2026-10-06, rule 13 layering)
import { buildSeoulBlockout } from './seoul-blockout';
SCENES['seoul-blockout'] = { seed: 101, build: buildSeoulBlockout };
