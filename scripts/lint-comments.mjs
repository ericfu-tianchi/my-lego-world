// Gate: a `//` comment must not swallow code. Scripted edits that splice a comment into the middle of a line silently comment out the rest
// of it — this happened six times on 2026-10-01 (a dish, a stats variable, a renderer guard, a validator line, a tuft filter that put a plant
// on every lawn cell). Flags a line comment whose text contains a statement: `; const|let|if|for|return|bp.|part(`, or ends in `);`/`}`.
//   node scripts/lint-comments.mjs   (exit 1 on a hit)
import fs from 'node:fs'; import path from 'node:path';
const roots = ['src', 'tools/ldraw', 'scripts']; const hits = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const st = fs.statSync(p); if (st.isDirectory()) { if (!/parts\/ldraw|node_modules/.test(p)) walk(p); } else if (/\.(ts|mjs)$/.test(f)) check(p); } };
const CODE = /(^|;\s*|\s)(const|let) \w+ = |\b(if|for) \(.*\)\s*(continue|return|break|\{|[a-z]\w*[.(])|(bp\.\w+|part|a\.up|vox|a\.put)\(.*\);|\)\s*;\s*$/;
function check(p) {
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    const m = /^(.*?[;{}),])\s+\/\/\s(.*)$/.exec(line); if (!m || /['"`]/.test(m[2].slice(0, 1))) return;
    if (CODE.test(m[2])) hits.push(`${p}:${i + 1}: comment swallows code → ${m[2].slice(0, 100)}`);
  });
}
for (const r of roots) walk(r);
if (path.basename(process.argv[1]) === 'lint-comments.mjs') { console.log(hits.length ? hits.join('\n') + `\nFAIL · ${hits.length}` : 'PASS · no swallowed code'); process.exit(hits.length ? 1 : 0); }
