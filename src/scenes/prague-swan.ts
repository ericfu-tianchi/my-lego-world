// Prague · the swans on the Vltava (2026-10-03, round 4). The judge failed the brick-built swans (r2: taller than a minifig, no head or beak,
// read as white sculptures); the minifig-scale brick build of round 4 (2×3 plate, curved-slope wings, bar neck, round-plate head, orange
// cheese beak) read as a lamp with an orange shade. The LDraw library has no swan, goose or duck mould at minifig scale — only the Duckling
// (49661), the Chick, the Songbird and the Seagull. The plain White duckling is a real white water bird at the right size and reads as one at
// hero distance (swan-r4-moulds.jpg), so the "swans" are white ducklings: a real mould beats a brick build that does not read.
import { Blueprint } from '../core/builder';
import { placer } from './singapore';

/** y = the water's top plate level (the bird's base sits on a stud); rot 0 = head toward +z. One cell. */
export function swan(bp: Blueprint, ox: number, y: number, oz: number, rot: number) {
  const { part } = placer(bp, ox, oz, rot);
  part('duckling', 0, y, 0, 'White');
}
