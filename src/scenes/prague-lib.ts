// Prague · shared grammar for the Old Town set (2026-10-02). Týn (prague-tyn.ts) is the reference; the Orloj tower, the Bridge Tower and the
// houses use the same slate, gold and stone so the four read as one city.
/** a placer's `part` (src/scenes/singapore.ts placer): local grid, y in plates */
export type PartFn = (key: string, lx: number, y: number, lz: number, color: string, lrot?: number, print?: string) => void;
/** slate roofs and spires are near-black (Eric 2026-10-02: Dark Bluish Gray read too light); galleries, corbels and parapets stay dark grey stone */
export const ROOF = 'Black', SLATE_STONE = 'DarkBluishGray', GOLD = 'PearlGold';
/** grey-beige ashlar from tyn-from-square.jpg; darker with height. Pick per run of 2–4 cells so the packer lays real 1×N bricks. */
export const STONE_LOW = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'DarkTan', 'DarkTan', 'Tan'];
export const STONE_HIGH = ['LightBluishGray', 'LightBluishGray', 'LightBluishGray', 'DarkTan', 'DarkTan', 'DarkTan', 'Tan', 'DarkBluishGray'];
/** a Gothic spirelet on cell (x, z) from plate level y: `n` 1×1 round bricks, a cone, a 3L Pearl Gold bar pushed down the cone's bar hole (two plates show) */
export function spire(part: PartFn, x: number, y: number, z: number, n: number, color = ROOF) {
  for (let k = 0; k < n; k++) part('round_1x1', x, y + 3 * k, z, color);
  part('cone_1x1', x, y + 3 * n, z, color); part('bar_3l', x, y + 3 * n - 1, z, GOLD);
}
