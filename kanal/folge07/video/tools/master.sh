#!/bin/bash
# Audio mastering after the render: -14 LUFS integrated, true peak <= -1 dBTP, audio exactly as long as the picture.
# Chain: gain, a gentle 15 kHz low-pass, a limiter at 4x oversampling (catches inter-sample peaks), AAC 256 kb/s.
# The ffmpeg AAC encoder can add several dB of overshoot on single transients, so the ENCODED file is measured:
# the gain is corrected until -14.0 LUFS, and while its true peak is above -1.2 dBTP the limiter ceiling is lowered
# by 1 dB and the gain search runs again. Video stream is copied untouched.
# Usage: bash tools/master.sh <raw.mp4> <out.mp4>
set -euo pipefail
IN=$1; OUT=$2
DUR=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$IN")
meas() { ffmpeg -hide_banner -nostats -i "$1" -map 0:a -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/ I:/{i=$2} f&&/Peak:/{p=$2} END{print i, p}'; }
enc() { ffmpeg -y -hide_banner -loglevel error -i "$IN" -map 0:v -map 0:a -c:v copy \
  -af "volume=${1}dB,lowpass=f=15000:poles=2,aresample=176400,alimiter=limit=${2}:level=false:attack=1:release=60,aresample=48000,apad,atrim=0:$DUR" \
  -c:a aac -b:a 256k -ar 48000 "$OUT"; }
read I0 P0 < <(meas "$IN")
G=$(python3 -c "print(round(-14.0 - $I0, 2))")
CEIL=0.62
for c in 1 2 3 4 5 6; do
  for k in 1 2 3 4 5 6; do
    enc "$G" "$CEIL"
    read I1 P1 < <(meas "$OUT")
    python3 -c "import sys; sys.exit(0 if abs(-14.0 - $I1) < 0.05 else 1)" && break
    G=$(python3 -c "print(round($G + (-14.0 - $I1), 2))")
  done
  python3 -c "import sys; sys.exit(0 if $P1 <= -1.2 else 1)" && break
  CEIL=$(python3 -c "print(round($CEIL * 0.891, 3))")
done
echo "raw $I0 LUFS / $P0 dBTP -> gain $G dB, limiter ceiling $CEIL -> $I1 LUFS, true peak $P1 dBTP"
ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 "$OUT"
