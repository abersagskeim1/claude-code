# REVIEW – Folge 1 „Der Emu-Krieg“

- Gebaut nach skript.md, 32,5 s, 1080×1920, 30 fps; 13 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quelle der Dateien: `tools/gen.mjs` (erzeugt index.html + compositions/), `tools/sfx.py` (Soundeffekte/Beat per numpy-Synthese), `tools/thumb.mjs` (Thumbnail). Handänderungen an compositions/ gehen bei erneutem Lauf von gen.mjs verloren.
- Timing-Anpassungen: Zeilen ab 2,4 → 2,5; 3,8 → 3,9; „Also schickt die Armee“ 8,4–9,8; „2 MG“ 9,8–11,0; „Sein Fazit…“ bleibt stehen, „unverwundbar wie PANZER“ kommt darunter dazu; Loop-„1932.“ 32,1–32,5.
- Abweichung: 🏆-Emoji als eigene SVG-Trophäe; Stempel im Kalender heißt „ENDE“ (ABBRUCH steht schon im Text); Zähler 20.000/10.000 laufen im Text selbst.
- Gemessen: check ok (0 Fehler). Warnungen bewusst behalten: Klotz-Umfallen (Pivot), Anführungszeichen/Stempel knapp an Plattform-Rändern (innerhalb Kanal-Zone 280–1500), Dateigröße captions/klotz.
- Ton: gemessen, nicht gehört. Mix nach Render auf −17,1 LUFS / −1,3 dBTP normalisiert (ffmpeg loudnorm, Video-Stream kopiert).
- Schwächste Stelle: 27,2 s – Klotz liegt umgekippt halb verdeckt; 13,2 s – Fadenkreuz-Szene eher ruhig.

## Nachbesserung nach Prüfung (16.11.)
- Frame 1 = Thumbnail-Bild: Australien + Emu mit Helm + roter Stern + „1932.“ ab 0,0 s; Hook-Text jetzt „Australien erklärt EMUS den Krieg.“ (0,26–2,6 s, komplett ab ~0,9 s).
- Szenen überlappen (0,3 s Ausblende, Spuren abwechselnd); Loop-Szene `loopend` baut ab 32,0 s exakt das Frame-1-Bild wieder auf.
- Fester Wortabstand (äußerer Span), nur innerer Span skaliert; AUSEINANDER 124 px; PANZER 205 px, EMUS 220 px, 1932 200 px; Zitatrahmen ab y 310.
- Ton nach Render: loudnorm −17,0 LUFS / −1,3 dBTP, auf 32,5 s gekürzt mit Fade (Video-Stream kopiert).
