import type { SceneDef } from './lib';
import { buildKyoto } from './kyoto';
import { buildTokyo } from './tokyo';
export const SCENES: Record<string, SceneDef> = { kyoto: { seed: 7, build: buildKyoto }, tokyo: { seed: 11, build: buildTokyo } };
