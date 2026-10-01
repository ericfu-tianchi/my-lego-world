# Country playbook — how every city set gets built (v2, 2026-09-18, distilled from Kyoto v10 = Eric's 8/10)

One page. Read it before starting a country; update it when a country teaches something new. Kyoto is the reference build (`src/scenes/kyoto.ts`, brief `judge/briefs/kyoto.md`).

## 1. Order of work
1. **Brief** (`judge/briefs/<city>.md`, copy `_TEMPLATE.md`): one-sentence scene, must-have features, life layer, palette *taken from photographs of the real place*, scale, taboos, official-set references.
2. **Research — a full stage with a deliverable.** Copy `docs/countries/_template.md` to `docs/countries/<country>.md` and fill §1: for the scene and each hero element, the real thing (photos, proportions, colours), the official sets that build it and how, the LEGO Masters / MOC technique, and what we borrow; the palette in LEGO colour names with a do-not-use list; one gpt-image-2 composition reference under `docs/refs/`. **Eric reviews the research page before any brick is placed.** Japan's page is the worked example: it is where five rounds of "go and look at the real thing" would have been avoided.
3. **Elements first, island second — and each element is an iteration, not a shot.** For each element: sketch it on the stud grid from the references (side and top, each surface as a part type) → find the moulds → build in the test scene → validate → render two close-ups beside the reference → swap parts and repeat (2–3 rounds) until it would not embarrass us next to the reference. The element's footprint comes out of the sketch; the layout is drawn after the sketches, not before. Only a passed element goes to Eric's screenshot checkpoint — never a draft labelled as done.
4. **Validator PASS is the floor, not the score.** `npx tsx scripts/validate.ts` must PASS; then render the pack (hero, four quadrants, each figure from two angles, each tree) and look at every image before a review page goes to Eric.
5. **Review page → Eric → judge round → one fix round → review page.** Never run ahead of a checkpoint.

## 1b. Scale and scope (Eric, 2026-09-25, after Singapore v6)
- **Four or five iconic places, not a city.** List candidates, keep the ones everyone knows the place by, give each the footprint it needs (write footprint × height × part budget per element before placing anything), pair each with one minifigure doing something. Cut the rest — a crammed small thing (a 6×6 lotus with ten petals, a 4-wide cargo ship) reads as junk and drags the whole set down.
- **Every brick is a brick.** Studs-out and hinged sub-builds are authored as LDraw assemblies for positions only and exploded into real member bricks in the scene (`bp.assembly()`); nothing in a scene may be a baked monolith.
- **As real as other builders manage.** Study the official set, LEGOLAND Miniland, Rebrickable MOCs and LEGO Masters versions of each subject and take the best technique; never propose a stylised "simpler" stand-in.

## 2. Numbers that hold for every country
**Series first — by DNA, not by identical numbers (Eric, 2026-10-01):** the islands are shown together — same scale, same plinth treatment, same figure scale, same hero-to-island ratio, same restraint, same render pack. Footprint area 2,000–3,500 studs² (Kyoto 2,464), outline free (follows the landmarks), water optional.
- Earth two brick layers deep from `base`, rim wall hanging lower, a two-brick stone plinth one cell outside the footprint capped with tiles. Aim for ≤ 3,000 parts in the build itself; the plinth and cap add ~200 (Kyoto v10 closes at 3,237).
- Diagnostics, not gates: specialty moulds ≥ ~8 % of pieces (a floor: fewer means under-detailed; no ceiling). Prints ≤ 12 designs, ≤ 40 pieces.
- Height tiers, readable from any angle: hero landmark > tallest tree > house > figures. Landmark height ≈ 0.5–0.6 × island width.
- Defaults: about a third open lawn or water; water (where the place has it) is the calm centre. Spacing enforced by `Sites` — a placement that crowds throws.
- **Two or three minifigures**, each doing one legible thing, far apart (≤ 1 per 6×6). No more.

## 3. Techniques that transfer
**Trees (`tree(kind)`; add a foliage kind per country — maple, plane, olive, palm):** a 2×2 round-brick trunk centred on its axis point; at every fork the four corner studs each carry one branch plate (lengths 2–4, two pinwheels alternating between forks so it never swirls), the next trunk segment rides on the four inner plate ends, the crown sits on a 2×2 jumper's centre stud. Tip clusters (calyx → 6×5 leaf → crossed 4×3 leaf → flower plate → 7-petal flower) at staggered heights 0 / 2 / 4 plates so leaves interleave without touching; a side leaf on every long limb; loose blossoms on bare studs; one side left bare toward a roof (`skip`). Hero tree = 3 forks, others 2, small 1. Pines use the same armature with three-deep green clouds and a cone tip (`kind: 'pine'`). Japan's exact recipes: `docs/countries/japan.md`. The v4 leaning trunk (one stud sideways per fork) was cut: it put the trunk on the corner of its stump and the crown to one side.

**Roofs:** colour from the real building, not from "looks LEGO" (Kyoto lost a round to a turquoise roof — see `docs/countries/japan.md`). Eaves = `spanPlates` one stud past the wall; a ring of slopes on top; the four corners always via `hipCorners`.

**Houses:** low and wide beats tall and narrow at minifig scale (a 6×6 body under a 7-brick wall reads as a tower; 8×6 does not). Doors are the minifig door elements (6 bricks tall); the eave sits one plate above the lintel; a raised veranda or stoop gets a step.

**Signage and prints:** a print is either legible at thumbnail size and true to the real object, or it is not there. Study how signs are actually lettered where the scene is set (carved, brushed, painted, enamel, neon) and pick the font stack and ground colours for that — never a default UI face; one or two characters or a short word set with `kanji()`, canvas `px ≥ 320`. Record the choice in the country notes (Japan: `PLAQUE` gold carved script on dark lacquer, `BRUSH` ink on paper lanterns; three iterations to learn it).

**Figures:** `minifig2` only. Every held thing has a `HOLD_DEFAULTS` entry naming the arm pose and the point on the part the hand closes on (`gp`); the build throws `grip buried` otherwise. Verticals (parasol, broom, staff) in a forward hand (`f`); a camera, fan or tray raised (`h`); vessels forward. Check both arms in a close-up from two sides — the validator cannot see "looks wrong".

**LDraw imports:** `tools/ldraw/bake.mjs` keeps the loader's smooth normals and re-winds triangles to match them (mirrored sub-parts such as the left arm 3819 = mirrored 3818 otherwise come out inside-out and let you see the wrist post through the sleeve). The renderer draws LDraw moulds two-sided as a second guard. Collision uses the real baked extents (`ext`, `extY`), a stud may sink 0.5 plates into the part above.

**Ground layer:** stepping stones form one continuous line between the entrance and the door (2×2 round tiles, one-stud gaps, bends allowed), never scattered; bank stones in pairs and threes; two greens only for grass (a third reads as random squares); raked sand = light-grey grille tiles on white tiles (white-on-white is invisible); fallen petals under each blossoming tree; one or two animals in character with air around them.

**Finishing the island:** the bottom two bricks of stone step one cell outside the island footprint — a plinth — so the stair-stepped voxel rim reads as a finished stand instead of a ragged edge (Kyoto v6, +120 parts, worth it). Bridge approaches are flat steps of equal rise (two plates each) in the bridge's own colour — a cheese-slope sawtooth or a colour change reads as a mistake. Decks and walkways are tiled; a railing is posts + a plate handrail + finials, never a row of lone posts. A veranda (engawa) rides two plates above the garden with a step down.

**Regularity (Eric's nine, 2026-09-18):** build vertical things on one axis (`stoneLantern`: jumper → post → jumper → box → dish → cap; `sakura5`: 2×2 round trunk, four-corner limbs, jumper under the crown); place four-way symmetric pieces with `hipCorners` and `railing`, never by hand — two roofs had two corners backwards and nobody noticed for three rounds; hosted parts (pane in frame) share the frame's origin; a part's box is its connection, not its body (one socket → 1×1 box, two anti-studs → 1×2 — an even box puts the socket between studs); stairs flat and equal, same colour as the structure; props with handles are held by the handle (camera side grip); colour layering follows the real object. Render each element alone with `?only=<tag>` from the top and from the front before review — that is where these show.

**Landmark proportions come from the real thing (Eric, 2026-09-18):** before building a landmark, write down its member proportions and colour layering from a photograph and reproduce them (which beam is longest, which layer is dark, how many bays per side, how gentle a curve is). Exaggeration reads as a mistake: a two-stud upturn on a torii read as ponytails; the right answer was one plate. Bays and repeated members are mirror-symmetric (member k pairs with S−1−k). Water lands: a stream or fall ends in a small pool with two or three white foam pieces, never more — the table counts as ground for the validator. Country-specific numbers go in `docs/countries/<country>.md` §2.

**Judging renders:** camera position = target + (sin az · c, sin el · dist, cos az · c): az 0 is +z, π/2 is +x, π is −z, 3π/2 is −x. Put the camera outside the island on the element's own side; every figure gets a front and a side; element close-ups and silhouettes use `?only=<tag>[,tag]` so nothing else is in frame; check each image before the judge sees it — rounds 2 and 3 each lost points to mis-aimed shots.

**Layout and depth (Singapore v7–v10, Eric 2026-10-01/02):**
- Heights step down toward the default camera: tallest at the back (hero landmark), then the next tier, the lowest buildings in front. A lower thing never stands behind a taller one that hides it (the shophouse hid the Supertrees until it moved in front of them).
- Nothing stands between the camera and a figure's face or a landmark's signature view; drop a tree before you accept the overlap. Keep the front third low and open.
- A figure photographing something faces it across open space (water, lawn), never from behind it.
- Animals live where the real ones are seen (otters on the bank, not in the pond) and are placed apart, each with its own spot — two touching read as a mistake.
- Cut props the scale cannot make readable (a 10-stud boat was a red box); set dressing must read or go (rule 6).
- At the island checkpoint show 2–3 layouts of the same elements side by side; Eric chose between them faster than he could have described one.
- Plant from candidate lists that place only where the spacing rules allow, and log every rejected candidate with its reason; too few plants reads as not tropical, too many small tufts read as dark blotches.

**Colour and dress:** decide a material colour by rendering 3–5 candidates side by side (MBS glass: trans-light-blue over dark grey won over trans-black, sand green, and trans-light-blue over white). Figures wear what the place wears, in its bright register: a batik shirt in a vivid ground reads Nanyang, a brown one reads drab.

**Moving parts:** one opened element (a shutter pair, a door) gives a façade life; build it from the same official mould rotated on its real hinge, hosted at the frame's origin, and open pairs symmetrically.

**Assemblies:** author studs-out builds in our own frame with `tools/ldraw/asm-ours.mjs` (`up`, `side`, `onStud`, `exposed()` reports any side stud left bare), then `bp.assembly()`; `scripts/check-assemblies.ts` proves the exploded bricks match the monolith and that no brick inside clashes or floats.

## 4. Grammar quick reference (`src/scenes/lib.ts`)
- `minifig2(bp, cx, y, cz, rot, opts, reserve)` — the only figure entry: legs / posed torso / hands / head / hair, printed face + torso, `hold: [{ key, color, hand, pose }]` via `HOLD_DEFAULTS`. `holdUmbrella(...)` for the parasol.
- `tree(bp, x, y, z, size, reserve, turn, skip, kind)` — the tree armature; `kind` picks foliage ('sakura' | 'pine' today; add a kind per country in `Foliage`). `bamboo`, `bush`, `blossom` (flower on a round plate).
- `stoneLantern`, `paperLantern`, `lowTable` — garden furniture on one axis.
- `hipCorners(bp, part, x0, z0, W, D, y, color)` — the four hip-roof corners; `railing(bp, x0, z0, W, D, y, color)` — symmetric fence runs; `spanPlates` / `overhangPlate` — eaves and floors.
- `Sites` — spacing registry (throws on crowding); `Reserve` — occupied cells; `patch(x, z, size, seed)` — deterministic noise for colour variation.
- Legacy (`sakura`, `sakura3`, `sakuraA`, `sakura4`, `sakura5` alias, `pine3`, `canopyLayers`, `banner`) stay only for the Tokyo sample and the test scenes; do not use them for a new country.

## 5. Before the judge sees it — self-check list
- [ ] `npm run gate` PASS (comment lint, typecheck, assembly audit, validator with the overhang-hull check); parts ≤ 3,000, specialty ≥ 8 %
- [ ] heights step down toward the camera; no tree or building covers a figure's face or a landmark's signature view
- [ ] hero render + 4 quadrants looked at: three height tiers read, ≥ 1/3 open, nothing touches a roof
- [ ] each figure: two close-ups; hands closed on things, no post visible, pose a real minifig can hold
- [ ] each tree: canopy reads as a mass from the hero distance; no coat-rack silhouettes
- [ ] every print legible at thumbnail; none over studs
- [ ] palette matches photographs of the place; no glazed / toy colours on real-world buildings
- [ ] regularity pass from a top-down `?only=` render of every element: one axis, four corners alike, railings symmetric, panes flush, stairs flat, every socket over a stud, handles gripped
- [ ] research page (`docs/countries/<country>.md` §1) written and reviewed by Eric before building; landmark proportions checked against a photo of the real thing
- [ ] lettering looks hand-made (plaque / brush), not typeset; water has a landing
