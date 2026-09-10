# Brick Atlas (v2)

A brick-built atlas of the ~20 countries Eric has travelled: each place is a LEGO-style micro diorama built from real, buildable parts, which you can take apart with physics and rebuild in one click. Ships as a standalone web app, later embedded in Eric's pixel-OS personal site.

- v1 one-shot demo (kept for reference, untouched): `~/Desktop/lego-world-claude`
- Astra's one-shot demo (kept for reference, untouched): `~/Desktop/lego world`
- Design notes and review artifacts: `docs/`

Hard rules for v2:
1. Every part maps to a real LEGO part number and an official colour.
2. Every part is physically attached (stud-connected to the baseplate). The validator is a build gate, not a warning.
3. Grid-only placement: integer studs, integer plates, four orientations. Half-stud offsets only via real jumper plates.
4. No image generation anywhere in the product. Concept images are used only to decide the visual direction.
