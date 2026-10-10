# Seoul element build — common brief for every element worktree (2026-10-06)

Eric signed off the research (korea.md §1) and all five schemes (§1.13, "很棒 按计划执行！高质量！"). You now **build one element in the test scene of your own worktree**, to the scheme, until it would not embarrass us beside its reference — then stop and report. You are one of six parallel builders; the lead merges your branch.

## Your worktree
- Work ONLY in your worktree (given in the prompt). `node_modules` and `tools/node_modules` are symlinked; `vendor/ldraw/asm/` is copied. For every bake / check set `LDRAW_DIR="<repo>/vendor/ldraw-lib/ldraw"`.
- Serve and shoot on **your own port** (given): `npx vite build` → serve `dist/` with `python3 -m http.server <PORT> --bind 127.0.0.1 -d dist` (background) → `PORT=<PORT> node tools/shot.mjs out.png "scene=<id>&noglobe&az=..&el=..&dist=..&tx=..&ty=..&tz=..&only=<tag>"`. Screenshots run outside the Bash sandbox (disable it). Camera formula and grid in CLAUDE.md Workflow.
- **Files you may change:** your own scene file(s) `src/scenes/ko-<x>.ts` (new), your own assembly authoring script(s) `tools/ldraw/asm-ko-<x>.mjs` (new), your own docs `docs/refs/seoul-<x>/BUILD.md` and renders under `docs/refs/seoul-<x>/build/`. **Append-only** (add your own block at the END, never edit others' lines): `src/core/catalog.ts`, `src/core/prints.ts`, `src/scenes/index.ts` (add your scene to SCENES), `src/scenes/lib.ts` (only if the scheme needs a grammar addition — put it at the end in one block with a comment naming your element). The generated `src/parts/ldraw/index.ts` and `asm/index.ts` come from `bake.mjs`; do not hand-edit them. Do not touch other countries' files, CLAUDE.md, HANDOFF.md, package.json.
- Commit on your branch at milestones (`git commit` in your worktree; message says what and why; end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`). Never push.

## Read first
`CLAUDE.md` (all of it — hard rules 1–15 and the Workflow, especially "nothing just lies on anything", "Touching is not clutching", "Pipeline traps", rule 7 regularity, rule 8 close-ups), `docs/country-playbook.md`, `docs/countries/korea.md` §1 (incl. §1.13), **your scheme** `docs/refs/seoul-<x>/SCHEME.md` and its NOTES.md and images, and the closest worked example of a built element: `docs/refs/la-*/BUILD.md` with its scene `src/scenes/la-*.ts` and `tools/ldraw/asm-la-*.mjs` (how assemblies are authored with `asm-lib.mjs`, baked, exploded with `bp.assembly()`, and tagged for `?only=`).

## The loop (rule 3 / playbook §1.3)
1. Build the scheme's **first risk test** first (it is named in the scheme's build order / risks) — render it beside the reference before building the rest.
2. Build → `npx tsx scripts/validate.ts <your scene>` PASS → `npx tsx scripts/check-assemblies.ts`, `check-studs.ts`, `check-asm-studs.ts` green → render close-ups from ≥ 2 angles (+ a top-down `?only=` regularity render) → **look at every image yourself** and compare with the reference photo / brick version / target image `docs/refs/seoul-<x>-lego.png`.
3. Swap parts and repeat. **Two failed guesses on the same detail → stop guessing and copy a proven build** (the scheme names it) at our scale. Never present a stylised stand-in; never exclude an official mould by feel.
4. When it passes your own eye: run the **`lego-judge`** agent on an element render pack (hero + 2 angles + close-ups + the reference images + a short brief: what the element is, the scheme's signature details). Fix what it names that is fixable; at most 3 judge rounds.
5. `npm run gate` must stay green for the existing scenes (it does not include your test scene; also run `validate.ts` on your scene).

## Report (your final reply, ≤ 250 words)
- Scene id + `?only=` tags; parts count; footprint × height (plates above G — state your scene's G) — vs the scheme.
- The ONE best render path (hero, element alone, `noglobe`) for Eric's checkpoint screenshot, plus 1–2 close-ups, all saved under `docs/refs/seoul-<x>/build/`.
- What deviates from the scheme and why; judge score and the open issues; gate status; commit hash.
- Anything the island stage must know (exact footprint, ground level the element expects, its anchor point, which cells it occupies, assembly ids).
Write the same into `docs/refs/seoul-<x>/BUILD.md`.
