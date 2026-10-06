# Los Angeles promo film, v1 (2026-10-06)

`la-v1.mp4`: 1080 × 1920 (9:16, made for Xiaohongshu full screen), 30 fps, H.264 High CRF 16, faststart, no audio track, about 55.6 s.
Every frame comes from the live app (`?film=1`) in headless Chromium on Metal, captured at 60 fps. Frame pairs are blended into 30 fps
for 180°-shutter motion blur. No AI images or video anywhere: the set, the camera and the type are all code.

Reproduce: `npx vite build`, serve `dist/` on :8161, `FILM_OUT=<dir> node tools/film/la.mjs` (≈ 15 min), then
`node tools/film/assemble.mjs <dir> docs/film/la-v1.mp4`. `--preview` renders 540 × 960 at 15 fps; `--stills S04,S05` renders the first,
middle and last frame of the shots you name.

## Shot list

| # | Time (s) | Shot | Grammar |
|---|---|---|---|
| S01 | 0.0–10.0 | The desk globe turns and settles with LA in front. Title card **AI 搭的乐高 / AI 剪的片 · Built by AI · Edited by AI**. A tap ripple lands on the LA pin. The app's own entrance follows (the globe sinks, the bricks rain in and seat), then a slow wide drift over the finished set | establishing, app-native transition |
| S02 | 10.0–13.6 | Ferris wheel, face-on from just above the water: tilt up and arc. Card: *Los Angeles · 01 · Santa Monica Pier · 圣塔莫尼卡码头* | low angle, tilt-up |
| S03 | 13.6–16.2 | The laughing coaster rider, arms up, HOLLYWOOD behind | close-up arc |
| S04 | 16.2–19.4 | Ice-cream cart: the kid with a cone, the vendor, the 66 sign and the gull behind | push-in |
| S05 | 19.4–23.2 | Starts on the SANTA MONICA lettering, then pulls back to reveal the whole arch with the wheel behind | reveal |
| S06 | 23.2–26.8 | Beach, from the surfer in the foreground across to lifeguard tower 18. Card: *02 · Venice Beach · 威尼斯海滩* | lateral track |
| S07 | 26.8–30.2 | Rushes in from high over the bowl, then eases into near slow motion on the skater on the coping | speed ramp, arc |
| S08 | 30.2–33.4 | The three graffiti walls, sliding past the umbrella and a surfboard | dolly, foreground parallax |
| S09 | 33.4–35.8 | The Muscle Beach lifter's curl | close-up |
| S10 | 35.8–39.6 | Roller-skater on one foot, palm trunks and a lamp crossing the foreground, HOLLYWOOD behind | parallax dolly |
| S11 | 39.6–44.2 | Low along the Walk of Fame stars (the same walk, the same direction as S10), then tilt up to the letters. Card: *03 · Hollywood Hills · 好莱坞山* | match on motion, tilt-up reveal |
| S12 | 44.2–48.2 | Crane and arc from HOLLYWOOD over the mast down to the Griffith dome | crane, arc |
| S13 | 47.6–55.6 | 0.6 s dissolve into a wide pull-back. At +1.6 s the set takes itself apart (the closed-form nebula burst, then drift). End card: **Los Angeles · My Lego World · 11,177 块真实乐高零件 · AI 设计 · AI 搭建 · AI 剪辑**, then a 0.5 s fade | wide pull-back, finale |

Cuts are hard and land on motion. The only dissolve is the one into S13. Camera paths are Catmull-Rom splines through orbit or position
keyframes, timed by sine, cubic or smootherstep eases (the speed ramp is a custom ease). There are no linear moves.

## Notes
- Capture hook: `window.__film` in `src/app/main.ts`, active only with `?film`. It does `step(dt)`, `look(p, l, fov)`, `zoom(k)` (the app's camera, k × farther, because a 9:16 frame is narrower), `enter(id)`, `apart()` and `tags()` (world bounds of each element, used to aim the camera).
- The type is real web type in a DOM overlay over the canvas (Rubik, IBM Plex Mono, PingFang SC), so it is captured with the frame.
- Music: none. A generated score (Sonilo video-to-music) is possible but it is a paid call, so it was not made without Eric's go-ahead.
