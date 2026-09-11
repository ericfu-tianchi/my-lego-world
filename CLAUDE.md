# My Lego World — project rules (read first)

Eric (PM, technical, writes little code) is building a LEGO-style world of the ~20 countries he has visited, as an app for his pixel-style personal OS site. Chinese for conversation; English UI copy in top-tier SaaS style. He owns every major decision: present options with a recommendation, one question at a time, never vibe-code past a decision point. Report with artifacts / review pages he can open, not walls of text.

## Hard rules (non-negotiable)
1. Every part maps to a real LEGO part number (verified against library.ldraw.org headers) and an official colour. New parts only via "按需入库": real elements, ≤ 8 set-specific per country, never invented shapes.
2. Every part is stud-connected to the ground. `npx tsx scripts/validate.ts` must print PASS for every scene; it is a build gate, not a warning.
3. Integer stud grid, integer plates, four orientations. Half-stud offsets only where a real jumper / neck stud / 2x2 tube-over-stud makes them legitimate. No SNOT until the grid supports half plates.
4. No image generation anywhere in the product. Concept images (gpt-image-2 via Flyer) are used only to choose direction / as references.
5. Form = **B, garden-island diorama** (decided 2026-09-11). Release bar = 8.5/10 weighted from the judge (judge/JUDGE.md); current level ≈ 5/10.

## Workflow
- Build in `src/scenes/*.ts` using `src/scenes/lib.ts` grammar; run validator; `npx vite build`; serve `dist/` on :8125; `node tools/shot.mjs out.png "scene=kyoto&az=..&el=..&dist=..&tx=..&ty=..&tz=..&dismantle=<sim s>&strength=.."`.
- Quality loop: element sample → 4 views + close-up → judge agent (`judge/JUDGE.md`, `.claude/agents/lego-judge.md`) → fix → repeat until every dimension ≥ 8. Then scene composition round. Judge never sees code.
- Keep HANDOFF.md current at the end of every working session.
