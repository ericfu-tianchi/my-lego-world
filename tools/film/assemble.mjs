// Cuts the frames from la.mjs / la-v2.mjs / la-v3.mjs into the film: hard cuts on motion, an optional cross-dissolve (XF), whip-pan smear
// (meta.shots[].blur, seconds within the shot), a light vignette, H.264 CRF 16.
//   node tools/film/assemble.mjs <frames dir> <out.mp4>
// A 60 fps capture is blended in pairs (tmix) and taken to 30 fps: a 180° shutter's motion blur on the fast moves.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [dir, out] = process.argv.slice(2);
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
const XF = { S13: 0.6 };   // cross-dissolve (seconds) into these shots; everything else is a straight cut
const args = ['-y'];
meta.shots.forEach((s) => args.push('-framerate', String(meta.fps), '-i', path.join(dir, s.id, '%05d.png')));
const blur = meta.fps === 60 ? 'tmix=frames=2,' : '';
const smear = (s) => (s.blur ?? []).map(([a, b]) => `tmix=frames=7:weights='1 1 1 1 1 1 1':scale=0.142857:enable='between(t,${a.toFixed(3)},${b.toFixed(3)})',`).join('');   // whip pans: a long shutter
let f = meta.shots.map((s, i) => `[${i}:v]${smear(s)}${blur}fps=30,setpts=PTS-STARTPTS,settb=1/30,format=yuv420p[v${i}]`).join(';');
// chain: concat runs of straight cuts, xfade where asked
let cur = 'v0', len = meta.shots[0].dur;
for (let i = 1; i < meta.shots.length; i++) {
  const s = meta.shots[i], x = XF[s.id], o = `c${i}`;
  if (x) { f += `;[${cur}]fps=30,settb=1/30[t${i}];[t${i}][v${i}]xfade=transition=fade:duration=${x}:offset=${(len - x).toFixed(3)}[${o}]`; len += s.dur - x; }
  else { f += `;[${cur}][v${i}]concat=n=2:v=1:a=0[${o}]`; len += s.dur; }
  cur = o;
}
f += `;[${cur}]vignette=angle=0.22,fade=t=out:st=${(len - 0.3).toFixed(2)}:d=0.3:color=0xe9eae6,format=yuv420p[out]`;
args.push('-filter_complex', f, '-map', '[out]', '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out);
execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`${out}: ${len.toFixed(2)} s`);
