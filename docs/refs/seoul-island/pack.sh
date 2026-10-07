#!/bin/zsh
# Seoul island v2 render pack (judge/JUDGE.md §渲染包). usage: pack.sh <round prefix> [shot names…]
# v2 layout (LAYOUT-v2.md): 74 × 72, world x = grid x − 37, z = grid z − 36, y = plates × 0.4. Hero = the composition reference's camera.
cd "$(dirname $0)/../../.."; R=$1; shift; B=docs/refs/seoul-island/build/v2
typeset -A S
S[hero]="az=5.963&el=0.32&dist=134"
S[q-se]="az=0.785&el=0.42&dist=175"; S[q-sw]="az=5.5&el=0.42&dist=175"; S[q-nw]="az=3.93&el=0.42&dist=175"; S[q-ne]="az=2.36&el=0.42&dist=175"
S[top]="az=0&el=1.5&dist=160"; S[sil]="az=5.963&el=0.32&dist=128&sil=1"
S[range]="only=range,pine,scrub,wall,tower&az=5.963&el=0.3&dist=120&tx=0&ty=14&tz=-28"
S[tower]="only=tower&az=5.963&el=0.15&dist=34&tx=21&ty=31&tz=-27"
S[gate]="only=base,gate,roof,haechi,palacewall,guard&az=6.1&el=0.3&dist=80&tx=-10&ty=9&tz=-12"
S[stage]="only=frame,towers,deck,idols,fans&az=6.1&el=0.3&dist=55&tx=-8&ty=5&tz=6"
S[bukchon]="only=hanok,jars,neighbour,alley,ginkgo,visitor&az=5.963&el=0.35&dist=85&tx=21&ty=10&tz=-6"
S[han]="only=river,bank,park,boat,picnic&az=0&el=0.4&dist=110&tx=0&ty=3&tz=26"
S[idols-a]="only=deck,idols,fans,frame&az=0&el=0.15&dist=36&tx=-8&ty=6&tz=7"
S[idols-b]="only=deck,idols,fans&az=1.2&el=0.2&dist=36&tx=-8&ty=6&tz=7"
S[guard-a]="only=guard&az=0.1&el=0.12&dist=22&tx=-29&ty=6&tz=-2.5"
S[guard-b]="only=guard&az=1.4&el=0.12&dist=22&tx=-29&ty=6&tz=-2.5"
S[visitor-a]="az=6.1&el=0.15&dist=22&tx=26&ty=6&tz=6.5"
S[visitor-b]="only=visitor&az=1.57&el=0.15&dist=22&tx=26&ty=6&tz=6.5"
S[picnic-a]="az=0&el=0.2&dist=24&tx=-22&ty=5&tz=23"
S[picnic-b]="az=5.9&el=0.35&dist=24&tx=-22&ty=5&tz=23"
names=(${@:-${(k)S}})
for n in $names; do PORT=8160 node tools/shot.mjs $B/$R-$n.png "scene=seoul&noglobe&${S[$n]}" 1400 900 2>&1 | grep -v PASS | tail -1; done
