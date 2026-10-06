# Los Angeles promo film, v4 (2026-10-06)

`la-v4.mp4`: 1080 × 1920 (9:16), 30 fps, H.264 High CRF 16, faststart, no audio track, 30.4 s.
v4 answers Eric's notes on v3 and keeps the brisk pace. Reproduce: serve `dist/` on :8161, `FILM_OUT=<dir> node tools/film/la-v4.mjs`, then
`node tools/film/assemble.mjs <dir> docs/film/la-v4.mp4`.

| # | Time (s) | Move |
|---|---|---|
| S01 | 0–16.6 | **One unbroken camera path.** An intro card sits at the top over the globe from the first frame: "Los Angeles · 洛杉矶 / Designed, built & shot by Claude / 由 Claude 设计 · 搭建 · 拍摄", clear of the globe and its stand, gone by 1.9 s. The tap lands at 1.2 s. The entrance plays at real app speed (1×), with the app's own camera move widened for 9:16. From 4.0 s comes a ≈ 85° orbit of the whole island that dollies in from ≈ 380 to 255 and descends. At 9 s it swoops down over the bay past the pier and settles into the coast track: arch and 66 sign, surfer and tower 18, umbrellas and sandcastle, graffiti walls. A slow beat on the skater, then on to Muscle Beach |
| cut | 16.6 | Hard cut on motion |
| S02 | 16.6–20.2 | Pier crane: the ice-cream cart, up the face of the Ferris wheel to the whole pier with HOLLYWOOD and the mast behind |
| cut | 20.2 | Hard cut on rising motion |
| S03 | 20.2–30.4 | A slow crane-and-arc from the south-east into a layered frame: the SANTA MONICA arch in front (legible), the roller-skater beside it clear of the lamp, the palms, and the whole word HOLLYWOOD above, which shows only when it is whole. A 0.6 s beat, then pull back to the island while Take it apart starts (the burst at 1.5 ×). The end card is on screen about 3 s |

## How the transitions were solved
- **Orbit into close-up (Eric's note 4):** there is no cut. Orbit, swoop and coast track are one path: keyframes on a centripetal Catmull-Rom spline (no overshoot where long and short segments meet), and time mapped to keys by a C¹ cubic Hermite through keyed times. Speed changes continuously from the wide arc, through the dive, into the walking-pace track. The skater's slow beat is a low key velocity on the same curve, not a stop.
- **Close-up to close-up (Eric's note 5):** the whip pans are gone. The film has two hard cuts, each on a moving camera, and the shot after each cut continues the motion (still moving, then rising into rising). I checked the ten frames around each cut at full rate: no stray frames, no blends.
