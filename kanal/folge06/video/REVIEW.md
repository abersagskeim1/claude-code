# REVIEW – Folge 6 „Twitch Plays Pokémon“

- 39,5 s, 1080×1920, 30 fps, 1185 Frames, H.264 + AAC. 14 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 38.6`, Chiptune + 8-Bit-Effekte, selbst synthetisiert), `tools/thumb.mjs` (Frame 0 aus der Komposition + „1 MIO. SPIELER?!“), Prüfskripte aus Folge 5 (overlap, layout, cutcheck, lidcheck), neu `tools/bubbles.mjs` (Ränder jeder sichtbaren Chat-Blase, jedes Frame, Soll x 80–1000).
- Neu: eigener Quer-Handheld (Pillenform, Steuerkreuz links, zwei runde Tasten rechts), Chat-Blasen-Regen (↑↓←→ A B), eigener Pixel-Held mit Mütze, Fantasie-Monster „Blubbo“ (einäugiger Blob) und „Flattwürfel“, Chat-Fenster mit LIVE-Schild, Pixel-Karte, Spielmenü, Waage ANARCHIE/DEMOKRATIE mit Zeiger, Inventar mit Spiral-Fossil, Fossil-Kult (Sockel HEILIG, Heiligenschein, Kerzen, Strahlen), Abreißkalender, Pokal mit Pfeil-Konfetti, Award-Statuette FAN-KREATION, Abstimmknöpfe A/CHAOS, Retro-Gitter-Hintergrund. Keine Marken, Logos oder echten Figuren.
- Klotz-Gags: drückt „A“ an einem großen Knopf und wird von drei Chat-Blasen weggeschubst (sie halten ≥ 40 px Abstand), kniet mit Kerze vor dem Fossil und verbeugt sich, einmal Ein-Auge-Zwinkern.

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„steuern alle / EINE Figur.“, „Jeder tippt Befehle / in den Chat.“, „ANARCHIE? / DEMOKRATIE? / Per Mehrheit.“ + „Der Chat wechselt / hin und her.“, „Und ein FOSSIL / ohne Nutzen.“, „Durchgespielt. / WIRKLICH. / Kein Witz.“, „Später: PREIS / Beste Fan-Kreation / des Jahres.“, „Leute…“ ohne Leerzeichen. Zahlen im Bild nur 2014, 16, 12.02.2014, 01.03.2014; Kalender-Zwischenseiten ohne Zahlen.

## Gemessen (nach dem letzten Render)
- `check`: ok, 0 Fehler (Warnungen: Arm-Pivot im Rig, Grafik-Glyphen am Plattform-Rand, kurze Blasen-Buchstaben im Loop).
- overlap.mjs (40 px, jedes Frame, Text und Klotz): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, Tinte x 82–998, y 288–683. Fließtext 92 px, Schlagworte 140 px, WIRKLICH 172 px, Grafik-Beschriftungen ≥ 72 px.
- cutcheck.py: 0 Löcher an 13 Schnitten + Loop. lidcheck: nie beide Lider zu, nur f1132–1136 rechtes Auge.
- Ton: +8,8 dB + Limiter (4× überabgetastet) → −14,0 LUFS, True Peak −2,0 dBTP, 39,500 s wie das Bild.

## Nachbesserung nach Prüfung (22.11.)
- Waage: Basis schmaler, DEMOKRATIE-Schild 72 px mit engerer Laufweite, Puls zur Außenkante verankert, kein Drift-Zoom in der Szene → rechte Kante max. x 974 (vorher 1024).
- „Wer gewinnt?“ ersetzt: c09 „ANARCHIE? / DEMOKRATIE? / Per Mehrheit.“ (sonst Waise), neu c09b „Der Chat wechselt / hin und her.“ mit pendelndem Zeiger und Klotz-Augen.
- Wort-Pop schneller (Schritt 0,055 s), Schnitte auf dem Frame-Raster (Zehntelsekunden). „EINE Figur.“ ab 1,6 s: früher reicht die Lesezeit des Hooks nicht (4 × 0,35 s + Ausblendung).
- Chat-Regen auf x 80–1000 begrenzt. Thumbnail „NUR 1 FIGUR?!“.
- Nach dem letzten Render: 39,5 s / 1185 Frames, −14,0 LUFS, −2,0 dBTP, 39,500 s; check 0 Fehler; overlap, layout, lidcheck, cutcheck (0 Löcher an 13 Schnitten + Loop) ohne Befund.

## Nachbesserung 2 (22.11.)
- Klammer in gen.mjs (`clampX`): jede Chat-Blase bleibt mit Bounding-Box inkl. Drehung (halbe Breite 90 px) und Bewegung in x 80–1000; Blasen-Zonen clippen zusätzlich bei x 80–1000. Chaos-Umlauf schmaler (Radius 370), Schubs-Blasen starten weiter innen.
- Nach dem letzten Render (39,5 s, −14,0 LUFS, −2,0 dBTP): bubbles.mjs min x 81, max x 1000 über die ganze Folge; overlap.mjs ohne Treffer; cutcheck.py 0 Löcher.
