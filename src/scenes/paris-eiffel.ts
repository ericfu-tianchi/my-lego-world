// Paris · Eiffel Tower, round 1 (2026-10-03). Scheme v1 signed off by Eric: docs/countries/france.md §1.13. The tower is one LDraw assembly
// (tools/ldraw/asm-paris-eiffel.mjs) exploded into its real bricks; this places it on the grid, footprint 18 × 18 with (x, z) its min corner.
import { Blueprint } from '../core/builder';

export function eiffel(bp: Blueprint, x: number, y: number, z: number) {
  bp.tag = 'eiffel'; bp.assembly('eiffel', x, y, z, 'DarkBrown', 0);
}
