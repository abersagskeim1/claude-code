#!/bin/bash
# Audio mastering after the render: -14 LUFS integrated, true peak <= -1 dBTP, audio exactly as long as the picture.
# Gain to the target, a gentle 15 kHz low-pass (the AAC encoder otherwise adds ~4 dB of overshoot on the synthetic
# high-frequency noise), then a limiter at 4x oversampling (catches inter-sample peaks); the loudness is re-measured
# and the gain corrected (up to five passes). Video stream is copied untouched.
# Usage: bash tools/master.sh <raw.mp4> <out.mp4>
set -euo pipefail
IN=$1; OUT=$2
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$IN")
meas() { ffmpeg -hide_banner -nostats -i "$1" -map 0:a -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/ I:/{i=$2} f&&/Peak:/{p=$2} END{print i, p}'; }
read I0 P0 < <(meas "$IN")
G=$(python3 -c "print(round(-14.0 - $I0, 2))")
chain() { echo "volume=${1}dB,lowpass=f=15000:poles=2,aresample=176400,alimiter=limit=0.62:level=false:attack=1:release=60,aresample=48000,apad,atrim=0:$DUR"; }
ffmpeg -y -hide_banner -loglevel error -i "$IN" -map 0:v -map 0:a -c:v copy -af "$(chain $G)" -c:a aac -b:a 192k -ar 48000 "$OUT"
G2=$G
for k in 1 2 3 4 5; do
  read I1 P1 < <(meas "$OUT")
  python3 -c "import sys; sys.exit(0 if abs(-14.0 - $I1) < 0.05 else 1)" && break
  G2=$(python3 -c "print(round($G2 + (-14.0 - $I1), 2))")
  ffmpeg -y -hide_banner -loglevel error -i "$IN" -map 0:v -map 0:a -c:v copy -af "$(chain $G2)" -c:a aac -b:a 192k -ar 48000 "$OUT"
done
read I2 P2 < <(meas "$OUT")
echo "raw $I0 LUFS / $P0 dBTP -> gain $G2 dB -> $I2 LUFS, true peak $P2 dBTP"
ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 "$OUT"
