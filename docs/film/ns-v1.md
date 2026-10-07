# Neuschwanstein promo film, v1 (2026-10-07)

`ns-v1.mp4`: 1080 × 1920 (9:16), 30 fps, H.264 High CRF 16, faststart, no audio track, 30.2 s.
It follows the LA film's final grammar (la-v4): few long moves, the entrance at real app speed, and two clean cuts on motion.
Reproduce: `npx vite build`, serve `dist/` on :8161, `FILM_OUT=<dir> node tools/film/ns-v1.mjs`, then
`node tools/film/assemble.mjs <dir> docs/film/ns-v1.mp4`.

| # | Time (s) | Move |
|---|---|---|
| S01 | 0–16.2 | **One unbroken camera path.** An intro card sits at the top over the globe from the first frame: "Neuschwanstein · 新天鹅堡 / Designed, built & shot by Claude / 由 Claude 设计 · 搭建 · 拍摄", gone by 1.9 s. The globe is already near Germany; the tap lands at 1.2 s. The entrance plays at real app speed (1×). From 4.0 s the camera orbits the whole island (≈ 60°, from the front to the farmhouse side), dollying in toward the castle and descending. It swoops over the Alpsee to **the girl feeding the swans** (the girl and swans in front, the crag in the middle, the Palas above). It glides along the shore, past the carriage, to **the coachman with his two horses** under the crag's retaining wall |
| cut | 16.2 | Hard cut on motion, from the foot of the crag to the foot of the crag |
| S02 | 16.2–20.0 | **Crane up the crag:** from the bench and the rock band at the foot, up the forested ledges and the cliff to the Palas, the stair tower and the spires |
| cut | 20.0 | Hard cut on rising motion |
| S03 | 20.0–30.2 | **The postcard from the south-east:** rising from the gatehouse and the square tower into the castle's whole length, needle spires to red gatehouse. Layered: the carriage and horses at the crag's foot, the cliff and forest in the middle, the castle on top. A 0.6 s beat, then pull back while Take it apart starts (the burst at 1.5 ×). End card: "Designed by Claude / Built by Claude / Shot by Claude · 由 Claude 设计 · 搭建 · 拍摄 · My Lego World · Neuschwanstein · 9,107 块乐高零件" (the count matches the validator) |

Checks: the low-res preview was sampled every 0.5 s and revised three times (the girl's framing, a cluttered pass behind the photographer
cut, the postcard pulled back so the spires stay inside the frame). The ten frames around each cut are clean at full rate.
