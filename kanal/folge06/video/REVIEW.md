# REVIEW – Folge 6 „Twitch Plays Pokémon“

- 38,6 s, 1080×1920, 30 fps, 1158 Frames, H.264 + AAC. 14 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 38.6`, Chiptune + 8-Bit-Effekte, selbst synthetisiert), `tools/thumb.mjs` (Frame 0 aus der Komposition + „1 MIO. SPIELER?!“), Prüfskripte aus Folge 5 (overlap, layout, cutcheck, lidcheck).
- Neu: eigener Quer-Handheld (Pillenform, Steuerkreuz links, zwei runde Tasten rechts), Chat-Blasen-Regen (↑↓←→ A B), eigener Pixel-Held mit Mütze, Fantasie-Monster „Blubbo“ (einäugiger Blob) und „Flattwürfel“, Chat-Fenster mit LIVE-Schild, Pixel-Karte, Spielmenü, Waage ANARCHIE/DEMOKRATIE mit Zeiger, Inventar mit Spiral-Fossil, Fossil-Kult (Sockel HEILIG, Heiligenschein, Kerzen, Strahlen), Abreißkalender, Pokal mit Pfeil-Konfetti, Award-Statuette FAN-KREATION, Abstimmknöpfe A/CHAOS, Retro-Gitter-Hintergrund. Keine Marken, Logos oder echten Figuren.
- Klotz-Gags: drückt „A“ an einem großen Knopf und wird von drei Chat-Blasen weggeschubst (sie halten ≥ 40 px Abstand), kniet mit Kerze vor dem Fossil und verbeugt sich, einmal Ein-Auge-Zwinkern.

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„steuern alle / EINE Figur.“, „Jeder tippt Befehle / in den Chat.“, „ANARCHIE? / DEMOKRATIE? / Wer gewinnt?“, „Und ein FOSSIL / ohne Nutzen.“, „Durchgespielt. / WIRKLICH. / Kein Witz.“, „Später: PREIS / Beste Fan-Kreation / des Jahres.“, „Leute…“ ohne Leerzeichen. Zahlen im Bild nur 2014, 16, 12.02.2014, 01.03.2014; Kalender-Zwischenseiten ohne Zahlen.

## Gemessen (nach dem letzten Render)
- `check`: ok, 0 Fehler (Warnungen: Arm-Pivot im Rig, Grafik-Glyphen am Plattform-Rand, kurze Blasen-Buchstaben im Loop).
- overlap.mjs (40 px, jedes Frame, Text und Klotz): keine Treffer. layout.mjs: 17 Einblendungen ohne Waise, Tinte x 82–998, y 288–692. Fließtext 92 px, Schlagworte 140 px, WIRKLICH 172 px, Grafik-Beschriftungen ≥ 72 px.
- cutcheck.py: 0 Löcher an 13 Schnitten + Loop. lidcheck: nie beide Lider zu, nur f1099–1103 rechtes Auge.
- Ton: +8,6 dB + Limiter (4× überabgetastet) → −14,0 LUFS, True Peak −1,7 dBTP, 38,600 s wie das Bild.
