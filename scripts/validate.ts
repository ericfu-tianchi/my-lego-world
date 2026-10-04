// Build gate: every registered scene must pass the buildability validator. `npx tsx scripts/validate.ts [scene]`
import { SCENES } from '../src/scenes/index';
import { Blueprint } from '../src/core/builder';
import { validate, summarize } from '../src/core/validate';
import fs from 'node:fs';
// the app shows this result instead of re-running the check after a globe click (1.5 s on Shanghai froze the screen); a set whose part
// count no longer matches is checked again in the app
const CHECKS = 'src/scenes/checks.json'; const checks: Record<string, { parts: number; ok: boolean; floating: number; overlaps: number }> = fs.existsSync(CHECKS) ? JSON.parse(fs.readFileSync(CHECKS, 'utf8')) : {};
const only = process.argv[2]; let fail = false;
for (const [id, def] of Object.entries(SCENES)) {
  if (only && id !== only) continue;
  const bp = new Blueprint(def.seed); const t0 = performance.now(); const meta = def.build(bp); const r = validate(bp.parts, meta.base ?? 0); const st = bp.stats();
  console.log(`\n${id} (${meta.title}) — ${st.parts} parts, ${st.types} types, ${st.colors} colours, ${(performance.now() - t0).toFixed(0)} ms\n` + summarize(r));
  if (!r.ok) fail = true;
  checks[id] = { parts: bp.parts.length, ok: r.ok, floating: r.floating, overlaps: r.overlaps };
}
fs.writeFileSync(CHECKS, JSON.stringify(Object.fromEntries(Object.entries(checks).sort()), null, 1) + '\n');
process.exit(fail ? 1 : 0);
