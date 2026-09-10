// Build gate: every registered scene must pass the buildability validator. `npx tsx scripts/validate.ts [scene]`
import { SCENES } from '../src/scenes/index';
import { Blueprint } from '../src/core/builder';
import { validate, summarize } from '../src/core/validate';
const only = process.argv[2]; let fail = false;
for (const [id, def] of Object.entries(SCENES)) {
  if (only && id !== only) continue;
  const bp = new Blueprint(def.seed); const t0 = performance.now(); const meta = def.build(bp); const r = validate(bp.parts); const st = bp.stats();
  console.log(`\n${id} (${meta.title}) — ${st.parts} parts, ${st.types} types, ${st.colors} colours, ${(performance.now() - t0).toFixed(0)} ms\n` + summarize(r));
  if (!r.ok) fail = true;
}
process.exit(fail ? 1 : 0);
