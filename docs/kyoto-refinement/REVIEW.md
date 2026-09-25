# Kyoto refinement — 2026-09-16

Status: reviewable prototype, **not certified 80–90/100, and not a released master sample**. Eric requested fast delivery before more refinement. View `http://127.0.0.1:8125/?scene=kyoto-refined`; original layout remains `?scene=kyoto`. Existing globe and other city architecture are unchanged.

## Root causes found

1. **Contradictory brief.** Six required people versus the pipeline's two/three-person limit; cyan glazed-looking roofs versus a ban on that appearance; compressed landmarks versus minifigure-sized landmark doors. These requirements encouraged a checklist of objects rather than a single composition.
2. **Packing defect.** Alternate layers scanned descending x while every rectangle grew toward positive x. Already occupied cells then forced narrow pieces. The opt-in compact mode scans consistently and chooses the largest fit; legacy scenes retain their existing mode. Explicit roof and bridge spans are still necessary: a voxel packer cannot infer structural beams.
3. **Loss of authored normals.** LDrawLoader computed crease-aware normals, then bake.mjs overwrote them with triangle normals. Indexed geometry also had its index discarded rather than expanded. Both issues are fixed. Selected figure/foliage moulds were rebaked; there is no fabricated geometry or mesh scaling.
4. **Loose assembly assumptions.** Old leaves occupy only their root cell; old accessories merely need to be near a hand. The new 2423 foliage variant includes its full bounds and six documented studs. The tea cup uses a rigid transform derived from the 3820 clip axis and the 3899 handle, plus an exact matching hand-frame gate. These are scoped improvements, not a claim that all legacy accessories have been fixed.
5. **Visual review happened too late.** A PASS in the original gate does not establish good proportions, convincing activity, or assembly strength. The first render of this revision also exposed coat-rack trees and overly steep roofs. Those were revised before delivery.

## Current design

A five-storey dark-roof pagoda, two timber machiya, a continuous lane, a stone bridge and three branching cherry trees. Red is concentrated on the torii. One figure holds tea; the other is a quiet observer. Two figures, 2,644 placement records, 65 catalogue keys, 19 colours. Counts are placements: a pre-baked torso contains torso + two real arms, so this is not a purchasing BOM count.

The shots in this folder show the delivered geometry; the final app additionally moves the shadow-catching table up to the base for this scene. Original Kyoto geometry and layout are preserved; selected shared moulds have smoother shading.

## Verification

- `node --import tsx scripts/validate.ts kyoto-refined`: PASS, 0 floating, 0 overlaps.
- `node --import tsx scripts/test-refinement.ts`: scene/budget; reject translated or rotated cup grip; detect overlapping leaves with separate stem cells; accept distal leaf stud; reject displaced blossom.
- `node node_modules/typescript/bin/tsc --noEmit` and Vite production build.
- Rendered overview and tea grip close-up. Second grip angle saved as `tea-grip-reverse.png`. Browser smoke test received a physics frame, restored all rebuild positions (animation timeline advanced to endpoint), switched between 2,875 original / 2,644 new placements, and saw no page errors. Command: `node tools/check-refinement.mjs`.
- Legacy partsheet has a pre-existing plate/lantern overlap. Do not report the entire repository validator as green.

## Limits / next decision

This is clearer and technically tighter, but tree branches are still visibly schematic, roof detailing and ground treatment remain basic, and the second figure lacks a strong story action. No independent 8.5/10 judging or physical build has been performed. Bounding-box connectivity checks do not certify clutch strength, legal insertion sequence, every part/colour production pairing, or every concave intersection. Do not turn PASS into “guaranteed physically buildable.”

The next useful decision is Eric's visual comparison. Do not automatically expand this into the other 19 countries.

## Sources

- LEGO [Tranquil Garden 10315](https://www.lego.com/en-us/product/tranquil-garden-10315): reference for garden and architectural relationships.
- BrickLink [2423 in Bright Pink](https://www.bricklink.com/catalogItemIn.asp?P=2423&catID=545&colorID=104&in=A&ov=Y): foliage mould/colour reference.
- Local official LDraw `2423.dat`: six stud coordinates; `3820.dat` !HELP: clip centre and 14.5° angle; `3899s01.dat`: handle cylinder at z=20, y=4..18 LDU. LDraw part geometry is credited to its authors under the respective source licenses (CC BY 4.0, or dual CC BY 2.0/4.0); see https://www.ldraw.org and https://creativecommons.org/licenses/by/4.0/ .

## Rollback

Baseline: `.snapshots/kyoto-before-refinement-20260912/workspace.tar.gz`, including pre-existing uncommitted CC work. No Git reset and no baseline changes committed.

`python3 scripts/rollback-kyoto-refinement.py --check`

`python3 scripts/rollback-kyoto-refinement.py --apply`

The script checks the recorded after-hashes, refuses to overwrite subsequent work, restores the changed/missing baseline files and removes only this revision's new files. The baseline and rollback receipt remain inside `.snapshots`.
