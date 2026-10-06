# Los Angeles promo film, v2 (2026-10-06)

`la-v2.mp4`: 1080 × 1920 (9:16), 30 fps, H.264 High CRF 16, faststart, no audio track, 59.0 s.

v2 answers Eric's notes on v1 ("像初中生刚学剪辑": a string of 3 s close-ups, so the viewer never learned where anything was, and
HOLLYWOOD was shown a few letters at a time). It is built from four long continuous moves and only three cuts, mostly wide and medium
shots. A close-up only ever happens as a moment inside a move. There are no place labels and no "AI" text.

Same pipeline as v1: the live app runs with `?film=1`, Chromium renders headless on Metal, frames are captured at 60 fps and blended into
30 fps. Reproduce: `npx vite build`, serve `dist/` on :8161, `FILM_OUT=<dir> node tools/film/la-v2.mjs` (≈ 12 min), then
`node tools/film/assemble.mjs <dir> docs/film/la-v2.mp4`. `--preview` renders 540 × 960 at 15 fps; `--stills` renders five frames per shot.

## Shot list

| # | Time (s) | Move | What the viewer learns |
|---|---|---|---|
| S01 | 0–25 | **One oner.** The desk globe turns and pushes in, while "Los Angeles · 洛杉矶" fades in small and centred low (0.8–5.6 s). At 6.4 s a tap lands on the LA pin. The app's own entrance follows (the globe sinks, the bricks rain in), with the camera carrying on its move instead of cutting. From 9.2 s the camera rises and pulls back into a high orbit of about 110°, ending on the sea side. The whole island stays in frame | where LA sits on the globe; the map of the set: sea and pier, beach, Venice, and the hills with HOLLYWOOD and Griffith |
| cut | 25 | Cut on motion: the orbit ends low on the pier side, and the track starts there | |
| S02 | 25–36 | **Coast tracking shot**, one move at about roof height. It runs from the pier arch and the 66 sign, past tower 18, the surfer, the umbrellas and the sandcastle, then the graffiti walls. A speed ramp slows almost to a stop on the skater on the coping and picks up again into Muscle Beach | the life along the shore, in order and at a readable scale |
| cut | 36 | Cut back to the pier, after the eastward track | |
| S03 | 36–44 | **Pier crane.** Starts at deck level by the ice-cream cart, the kid and the vendor, then the coaster riders. It rises up the face of the Ferris wheel and pulls back to the whole pier: the coaster loop, the sea, and HOLLYWOOD and the mast behind | how the pier's rides sit together |
| cut | 44 | Cut on rising motion: the crane up becomes a rise up | |
| S04 | 44–59 | **Hollywood and finale, one move.** Starts low behind the palm row, rises over the palm crowns to the whole word HOLLYWOOD, never cropped once the camera settles, with the arch in the foreground. Holds 1.6 s. Pulls back to the full island; Take it apart at 53.6 s (the nebula burst and drift). The end card fades in at 55.2 s | the sign as a whole, then the whole set one last time before it flies apart |

**End card:** "Designed by Claude / Built by Claude / Shot by Claude" (Claude in brick red), "由 Claude 设计 · 搭建 · 拍摄", then a small line
"My Lego World · Los Angeles · 11,177 块乐高零件". Ink on the soft background, above the nebula. A 0.3 s fade closes the film.

**Camera:** orbit and crane moves are splined in orbit parameters, so they trace true arcs. Tracks are Catmull-Rom splines on position and
target. Moves that are cut away from end at speed, so each cut lands on motion. The coast track's speed follows a profile, which gives
the ramp on the skater.
