# Mixes the how-it's-made film's sound: music, brick clicks and wall clatters at the cue times, and (optionally) the Chinese voice-over.
#   python3 tools/film/howto-mix.py <frames dir> <out.mp4> [--vo] [--music music2.wav --cues howto-v2-cues.json]
import json, subprocess, sys, os, random
random.seed(7)
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'audio')
frames, out = sys.argv[1], sys.argv[2]; VO = '--vo' in sys.argv
opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
meta = json.load(open(os.path.join(frames, 'meta.json'))); cues = json.load(open(os.path.join(D, opt('--cues', 'howto-v1-cues.json'))))
S, END, SR = cues['steps'], cues['end'], 48000
def load(p): return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout, dtype=np.float32).reshape(-1, 2).copy()
n = int(END * SR); mix = np.zeros((n, 2), np.float32)
def add(x, t, g):
  i = int(t * SR); j = min(n, i + len(x));
  if i < n: mix[i:j] += x[:j - i] * g
music = load(os.path.join(A, opt('--music', 'music.wav')))
if 'join' in cues:   # cut to the track's last phrase on a bar line, a short crossfade over the seam
  j0, j1 = int(cues['join'][0] * SR), int(cues['join'][1] * SR); xf = int(0.25 * SR); w = np.linspace(0, 1, xf)[:, None]
  music = np.concatenate([music[:j0], music[j0:j0 + xf] * (1 - w) + music[j1:j1 + xf] * w, music[j1 + xf:]])
music = np.pad(music, ((0, max(0, n - len(music))), (0, 0)))[:n]; fade = int(1.2 * SR); music[-fade:] *= np.linspace(1, 0, fade)[:, None]
click = load(os.path.join(A, 'click.wav'))
if 'sfx' in cues:   # v2: every event listed by the film script
  wipe = os.path.join(A, 'wipe.wav'); wipe = load(wipe) if os.path.exists(wipe) else None
  for t, kind, g in cues['sfx']:
    if kind == 'click': add(click, t, g)
    elif wipe is not None: add(wipe, t, g)
    else:
      for j in range(7): add(click, t + 0.02 + j * 0.045 + 0.01 * random.random(), g * (0.55 - 0.05 * j))   # a clatter of bricks landing
else:
  for t in S: add(click, t - 0.02, 0.9)
  random.seed(7)
  for i in range(0, 241, 5): add(click, S[4] + 3.0 + (i / 241 * 0.82 + 0.18) * 6.2, 0.18 + 0.12 * random.random())
  for i in range(14): add(click, S[4] + 9.4 + i * 0.28, 0.15)
  add(click, S[5] + 7.7, 0.9)
vo = np.zeros((n, 2), np.float32)
if VO:
  at = [0.7] + [t + 0.55 for t in S]
  for k, t in enumerate(at):
    x = load(os.path.join(A, 'vo', f's{k}.aiff')); i = int(t * SR); j = min(n, i + len(x)); vo[i:j] += x[:j - i] * 1.0
  env = np.convolve(np.abs(vo[:, 0]) > 0.01, np.ones(int(0.25 * SR)) / (0.25 * SR), 'same')
  duck = 1 - 0.55 * np.clip(env * 3, 0, 1)
else: duck = np.ones(n)
mix += music[:n] * 0.85 * duck[:, None] + vo
mix /= max(1.0, np.abs(mix).max() / 0.95)
wav = out + '.wav'; subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', wav], input=mix.tobytes(), check=True)
ext = 'jpg' if os.path.exists(os.path.join(frames, '00000.jpg')) else 'png'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(meta['fps']), '-i', os.path.join(frames, f'%05d.{ext}'), '-i', wav, '-map', '0:v', '-map', '1:a',
  '-vf', 'format=yuv420p', '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
os.remove(wav); print(out)
