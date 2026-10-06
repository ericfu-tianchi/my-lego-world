# Los Angeles promo film, v3 (2026-10-06)

`la-v3.mp4`: 1080 × 1920 (9:16), 30 fps, H.264 High CRF 16, faststart, no audio track, 28.0 s.

v3 answers Eric's notes on v2: the structure was right, but it was far too slow ("跟老太太一样"). v3 keeps v2's four moves and its spatial
clarity at about twice the energy. It has three cuts, two of them whip pans. It also fixes v2's two flaws: the island is whole from the
first frame of the orbit, and HOLLYWOOD rises at a fixed distance, so the word is never cropped.

Reproduce: `npx vite build`, serve `dist/` on :8161, `FILM_OUT=<dir> node tools/film/la-v3.mjs` (≈ 6 min), then
`node tools/film/assemble.mjs <dir> docs/film/la-v3.mp4`.

## Shot list

| # | Time (s) | Move |
|---|---|---|
| S01 | 0–8.6 | **The hook.** The globe is already close to LA and turning. "Los Angeles · 洛杉矶" appears with the credit "Designed, built & shot by Claude / 由 Claude 设计 · 搭建 · 拍摄" (0.05–2.1 s). The tap lands at 1.0 s. The app's entrance runs at 2.2 × app speed, keeping its own easing, while the camera swoops out; the set is standing by about 3.5 s. Then a 110° orbit of the whole island with an ease in and out (2.3–8.6 s), ending in a whip pan to the right |
| whip | 8.6 | Whip pan: 0.22 s out and 0.22 s in, the frames smeared over a 7-frame shutter |
| S02 | 8.6–14.6 | **Coast track** at a brisk pace: the pier arch and the 66 sign, the surfer and tower 18, the umbrellas and sandcastle, the graffiti walls. A 0.8 s slow-motion beat on the skater on the coping, back to speed into Muscle Beach, then a whip out |
| whip | 14.6 | Whip pan, continuing to the right |
| S03 | 14.6–18.2 | **Pier crane** (3.6 s): from the ice-cream cart and the riders, up the face of the Ferris wheel to the whole pier with HOLLYWOOD and the mast behind |
| cut | 18.2 | Cut on rising motion |
| S04 | 18.2–28.0 | **HOLLYWOOD** rises out from behind the palm crowns and the arch in 3.5 s, at one distance throughout, so the word is whole whenever it shows. A 0.8 s beat on the whole word. Take it apart starts at once as the camera pulls back to the island; the burst runs at 1.5 ×. The end card "Designed by Claude / Built by Claude / Shot by Claude · 由 Claude 设计 · 搭建 · 拍摄 · My Lego World · Los Angeles · 11,177 块乐高零件" is on screen from 24.8 s, about 3 s in all |
