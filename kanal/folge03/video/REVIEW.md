# REVIEW – Folge 3 „Die Bitcoin-Pizza“

- 39,5 s, 1080×1920, 30 fps, 1185 Frames. 16 Szenen + Loop-Szene + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, bricht bei doppelten IDs ab, auch kompositionsübergreifend), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.5`), `tools/thumb.mjs` (Thumbnail-PNG), `tools/overlap.mjs` (aus Folge 2), `tools/layout.mjs` (neu: Zeilen, Waisenwörter, sichere Zone je Einblendung).
- Neu: Pizzakartons + Münzstapel, Forum-Fenster mit Tipp-Cursor, Sprechblase, Handschlag, Wählscheibentelefon, Lupe + Preisschild, Kassenbon, Kerzen-Chart mit Schwenk, Gipfel-Fähnchen, Taschenrechner, Goldbarren + Münzregen, Gold-Pizzastück, Kalender, Abstimmungs-Buttons, Tresor. Klotz-Gag: isst ein Stück (Bisse per Maske, Kauen), Daumen hoch, erstarrt beim Chart, verschluckt sich (rot, Husten, Krümel), Stück wird golden und wandert in den Tresor.

## Abweichungen vom Skript
- Timing gestreckt (≥ 0,35 s/Wort, mind. 1,1 s lesbar; gen.mjs prüft jede Zeile). „Zähler 10.000“ zählt im Text selbst hoch (1,22–1,52 s).
- Gegen Waisenwörter umformuliert: „REKORDHOCH im Oktober 2025.“, „1,26 MILLIARDEN Dollar wert.“, „Der 22. MAI ist heute Pizza-Tag.“, „„Wer bringt / mir PIZZA?““.
- Preis damals als „< 1 Cent“ (41 $ / 10.000), Fähnchen „≈ 126.000 $ pro [Münze]“ (₿ als eigene Münze statt Schriftzeichen).
- Schriftgrößen: Fließtext 92 px, Schlagworte 110–140 px (10.000 BITCOIN und 600 MILLIONEN 110 px, damit sie in eine Zeile passen), Pointe „1,26“ 230 px = größte Schrift.

## Gemessen
- `check`: ok, 0 Fehler. Warnungen bewusst behalten: Arm-Pivot (Rig), Plattform-Ränder bei Hook-Text, „< 1 Cent“, ESSEN/BEHALTEN (alle innerhalb 80 px Rand / y 280–1500), line_unread für die Buttons (stehen 36,5–38,65 s).
- overlap.mjs (40 px, jedes Frame 0–39,5 s): keine Treffer. layout.mjs: alle Einblendungen ohne Waise, Breite ≤ 884 px, y 290–766.
- Ton gemessen, nicht gehört: +7,8 dB + Limiter → −14,0 LUFS, True Peak −1,6 dBTP, 39,500 s wie das Bild.

## Schwächen
- Frame 1: „2010.“ steht leicht links, weil „Zwei“ in derselben Zeile unsichtbar Platz hält.
- 21,35–23,4 s: Kerzen im Schwenk sind klein, die Linie trägt die Szene.
