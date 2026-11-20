# REVIEW – Folge 4 „Der Whisky-Krieg“

- 39,2 s, 1080×1920, 30 fps, 1176 Frames (ganzzahlig). 11 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit je Einblendung und doppelte IDs, auch kompositionsübergreifend und gegen index.html), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.2`), `tools/thumb.mjs`, `tools/overlap.mjs`, `tools/layout.mjs` (beide aus Folge 3).
- Neu: Arktis-Hintergrund (Polarlicht, Sterne, Schnee in zwei Ebenen, Eisberge, Meer mit Wellen, alles loop-nahtlos), kahler Felsen, Fahnen (Kanada mit eigenem Blatt, Dänemark mit Kreuz), Abreißkalender 1973 → 2022, scheue Kanonen mit „?“, Flaschen ohne Etikett-Text mit Korken, Namensschild HANS, Karte mit Grenzlinie und Zoom, Boote mit Figuren in Parkas (ohne Waffen), Zeitraffer mit Flaschenstapel, Fäustlinge-Handschlag mit Schneeflocken, geteilter Felsen mit Grat-Linie, Gläser-Anstoßen, Kommentar-Blasen.
- Klotz-Gag: friert (Schneehaube, rote Nase, Eiszapfen, Zittern), hebt zitternd die Fäuste, lehnt zwei angebotene Flaschen ab (sie rutschen weg), bekommt Schal und rote Wangen, trinkt Kakao mit Marshmallows, zwinkert; im Loop wieder Schock + Eiszapfen.

## Abweichungen vom Skript
- Gegen Waisenwörter/Zeilenbreite umformuliert: „Und zwar fast 50 JAHRE.“, „Der Felsen: die HANS-INSEL.“, „1984: Kanadas Soldaten landen dort.“, „Fahne rein. WHISKY dazu.“, „Dann rückt DÄNEMARK an.“; 🥃 nicht als Schrift (Gläser-Grafik stattdessen).
- Zahlen im Bild nur 1973, 2022, 50, 1984 (Faktencheck). Kalender zeigt zwischen 1973 und 2022 nur leere Blätter.

## Gemessen
- `check`: ok, 0 Fehler. Warnungen bewusst: Arm-Pivot (Rig), Hook-Text am Shorts-Rand (in 80 px / y 280–1500), KANADA/GRÖNLAND-Beschriftung (Grafik, ≥ 72 px).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: alle 18 Einblendungen ohne Waise, Breite ≤ 855 px, y 290–636. Pointe DRINK 168 px = größte Schrift, Fließtext 92 px.
- Szenenwechsel: alte Szene blendet 0,18 s vor dem Schnitt aus (power3.in, fertig +0,06 s), neue Szene erst ab +0,04 s sichtbar; im MP4 an mehreren Schnitten Bild für Bild geprüft. Loop: Felsen + Fahnen stehen ab 36,1 s bereits im Frame-0-Zustand, Blasen gehen, Hook-Text baut sich auf; letzte 18 Frames Bild für Bild geprüft, keines leer.
- Ton (gemessen, nicht gehört): +8,75 dB + Limiter (4× überabgetastet) → −14,0 LUFS, True Peak −1,6 dBTP, 39,200 s wie das Bild.

## Nachbesserung nach Prüfung (20.11.)
- Klotz 25,35–34 s: deutliches Kopfschütteln, schiebt beide Flaschen mit beiden Armen weg; ab 26,45 s Kakaotasse mit Dampf/Marshmallows, Schal; Augen offen, Nase orange statt rot, Wangen nur leicht (0,3), kein Wiegen mehr.
- Schlagworte jetzt 140 px: „HANS-INSEL / heißt der Felsen.“, „Fahne rein. / WHISKY dazu.“, „DÄNEMARK / rückt an.“, „Fahne getauscht. / SCHNAPS dazu.“, „FRIEDEN! / Endlich, 2022.“
- Karte: GRÖNLAND 78 px, 38 px weiter links / 40 px tiefer, Grönland-Eis dafür nach links erweitert. Szenen „jahre“ und „insel“ ab dem Schnitt sichtbar (keine fast leeren Frames bei 2,3 und 18,4 s).
- Thumbnail „49 JAHRE STREIT?!“. layout.mjs gruppiert Zeilen jetzt nach vertikaler Überlappung (gemischte Schriftgrößen). Ton −14,0 LUFS / −2,1 dBTP, 39,200 s.
