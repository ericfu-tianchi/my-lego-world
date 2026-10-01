// Scene statistics for the self-check: parts, types, specialty share, prints. `npx tsx scripts/stats.ts singapore`
import { Blueprint } from '../src/core/builder';
import { PARTS } from '../src/core/catalog';
import { SCENES } from '../src/scenes/index';
const id = process.argv[2] ?? 'kyoto'; const def = SCENES[id]; if (!def) throw new Error('unknown scene ' + id); const bp = new Blueprint(def.seed); def.build(bp);
// count real bricks: an exploded assembly's members, not its validation proxy; a member is specialty when its mould is (cat), not because it is baked
const parts = bp.parts.filter((p) => !p.proxy); const types = new Set(parts.map((p) => p.key)); const basic = new Set(['brick', 'plate', 'tile', 'baseplate']);
const isSpec = (k: string) => !basic.has(PARTS[k].cat) || (!!PARTS[k].ldraw && !PARTS[k].member);
const spec = parts.filter((p) => isSpec(p.key)), specTypes = [...types].filter(isSpec), ld = parts.filter((p) => PARTS[p.key].ldraw), printed = parts.filter((p) => p.print);
const byTag = new Map<string, number>(); for (const p of parts) byTag.set(p.tag ?? '', (byTag.get(p.tag ?? '') ?? 0) + 1);
console.log(JSON.stringify({ scene: id, parts: parts.length, types: types.size, colours: new Set(parts.map((p) => p.color)).size, specialty: { pieces: spec.length, pct: +(100 * spec.length / parts.length).toFixed(1), types: specTypes.length, typesPct: +(100 * specTypes.length / types.size).toFixed(1) }, ldraw: { pieces: ld.length, types: new Set(ld.map((p) => p.key)).size }, prints: { pieces: printed.length, designs: new Set(printed.map((p) => p.print)).size }, byTag: Object.fromEntries([...byTag.entries()].sort((a, b) => b[1] - a[1])) }, null, 1));
