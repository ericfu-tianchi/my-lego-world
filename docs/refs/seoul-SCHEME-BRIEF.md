# Seoul landmark schemes — common brief for every scheme pass (2026-10-06)

Repo: `../lego-seoul` (git worktree, branch `ericf-1006--seoul`). Work ONLY there. **Research and design only: write no scene code, change no src/ file, commit nothing.**

## Read first
- `CLAUDE.md` (all hard rules; especially 1, 2 incl. "nothing just lies on anything", 3, 7, 12, 13, 14 and the workflow items "Signature details", "Pipeline traps", "Touching is not clutching").
- `docs/country-playbook.md`.
- `docs/countries/korea.md` §1 (approved by Eric 2026-10-06: layout A, heights §1.5, palette §1.6, figures §1.7, prints §1.8, budget §1.10, decision 1 = A: seven generic idols, no names / faces / logo).
- Your element's research notes `docs/refs/seoul-<x>/NOTES.md` and images there, plus `docs/refs/seoul-real/NOTES.md`.
- **The format to match:** `docs/refs/la-venice/SCHEME.md` and `docs/refs/la-santa-monica/SCHEME.md` (units section, corrections found, per element: real proportions and signature → brick versions and conclusion → stud-grid ASCII sketch top + side → level-by-level table with part types and verified numbers → structure / connections → footprint, height, part count → bake list → risks). Also look at how LA's built result turned out: `docs/refs/la-*/BUILD.md`.
- What exists in code: `src/core/catalog.ts` (catalogue entries; `ldrawPart(...)`), `src/parts/ldraw/index.ts` (baked LDraw parts), `src/scenes/lib.ts` (grammar: `tree`, `minifig2`, `hipCorners`, `railing`, `Sites`, `spanPlates`, `band2`, `placer().asm`, `bp.assembly`), `tools/ldraw/minifig-asm.mjs`, a comparable built scene (`src/scenes/la-*.ts`, `src/scenes/shanghai*.ts`, `src/scenes/neuschwanstein*.ts`) to see how assemblies, roofs and hills are actually authored. Mark each part **L** (already baked), **bake** (must be baked) and check every number against `"<repo>/vendor/ldraw-lib/ldraw/parts/<n>.dat"` (quote the header where it matters).

## Units
- Heights in plates **above the island surface G** (scene: base 3, surface top G = 10, as Shanghai / LA). A minifig is ≈ 12.5 plates tall.
- ASCII: 1 char = 1 stud; north up in top views; the default camera looks from the south. World x = grid x − W/2.
- Island ≈ 76 × 64, x 0..76 west → east, z 0..64 north → south (to be fixed at the island stage from these footprints).

## What each scheme must deliver (one file: `docs/refs/seoul-<x>/SCHEME.md`)
1. Corrections to NOTES / korea.md the pass finds (with evidence).
2. Per element: signature details; the brick versions and which one we copy (copy proven builds — don't invent where someone already solved it); stud-grid sketches; level table; **every connection named** (stud in tube, clip on bar, hinge…) — leaning or SNOT members held at both ends; colour availability of each key mould checked (BrickLink colour list where reachable, else [M]); footprint, height, part count; bake list; risks with a fallback each.
3. **An element target image** made with gpt-image-2 ("<the element> built as a LEGO element at minifig scale, on a plain grey studio background, real visible bricks …" + the signature details and our colours), saved as `docs/refs/seoul-<x>-lego.png`, the prompt in the SCHEME. How to run it (sandbox must be disabled for both commands):
   ```
   <image-gen script> --model gpt-image-2 --prompt "<prompt>" --size 1536x1024 --quality high --timeout 400
   # prints a flyer URL; then:
   R=$(curl -s -o /dev/null -w '%{redirect_url}' "<image URL>"); curl -sL "$R" -o docs/refs/seoul-<x>-lego.png; file docs/refs/seoul-<x>-lego.png
   ```
   Look at the image and say in the SCHEME what in it is right and what is wrong against the scheme.
4. Finish by replying with a ≤ 250-word summary: footprint × height × parts, the copied technique, the biggest risk, and any decision Eric must make (with your recommendation).
