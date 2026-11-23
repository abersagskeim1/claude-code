# REVIEW – Folge 7 „Der Eimer-Krieg“

- 39,9 s, 1080×1920, 30 fps, 1197 Frames, H.264 + AAC. 17 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 40.0`, Laute-Jig + Effekte, selbst synthetisiert), `tools/master.sh` (Ton nach dem Render), `tools/thumb.mjs` („WEGEN DEM?!“), Prüfskripte overlap (neu: Klotz-Requisiten `.k-prop` als Hindernis), layout, cutcheck, lidcheck, neu `tools/bounds.mjs` (ersetzt bubbles.mjs: DOM-Box jeder Grafik/Beschriftung + Pixel-Tinte, jedes Frame, Soll x 80–1000).
- Neu: Holzeimer, Wappen-Schilde nur in Farben (Gelb/Blau, Rot/Weiß), Pergament-Schriftrolle, Pergament-Karte mit Pins, Schleich-Figur mit Eimer, Burg auf Hügel mit Fahnen, Fahnenmast, Lupe, FAKT-CHECK-Stempel, Burg mit Fahnenwechsel + Pfeil ECHTER GRUND, Podest mit Bannern, Lorbeerkranz, gezeichnetes Fragezeichen, Buch mit 1622 und Feder, generischer Turm, Pergament-Sprechblase. Keine Kampfszene, keine Opfer, keine echten Wappen.
- Klotz-Gags: Eimer als Ritterhelm (sieht nichts, stolpert auf der Stelle, jubelt blind), zieht ihn bei „Clou“ ab; stempelt am Ende FAKT-CHECK auf eine Rolle auf Staffelei und grinst. Rechter Arm zeigt nie nach rechts außen (Hand bliebe sonst nicht in x ≤ 1000).

## Abweichungen vom Skript (gegen Waisenwörter/Breite/6 Wörter)
„1325. / Krieg wegen / eines EIMERS?!“, „MODENA / gegen BOLOGNA“ (ohne Punkt, Breite), „Die Legende: / Ein Eimer / wird geklaut.“, „Es kommt zur / Schlacht / von Zappolino.“, „Modena gewinnt.“ (ohne Akzent, sonst Umbruch), „Aber jetzt / kommt der Clou:“ (statt „Aber jetzt kommt's:“), „Der Eimer / war nicht / der GRUND.“ (ohne „gar“, sonst 7 Wörter). Zahlen im Bild nur 1325 und 1622.

## Gemessen (nach dem letzten Render)
- `check`: 0 Fehler (Warnungen: Plattform-Safe-Zones TikTok für Hook-Box und ECHTER GRUND – innerhalb unserer x 80–1000; Datei-/Dichte-Hinweise).
- overlap.mjs (40 px, jedes Frame, Text, Klotz, Helm, Rolle, Stempel): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, Tinte x 87–998, y 304–686, max. Breite 911. Fließtext 92 px, Schlagworte 140 px, GRUND 200 px, Beschriftungen ≥ 72 px.
- bounds.mjs: DOM x 98–1000, Tinte x 92–999 über alle 1197 Frames. cutcheck.py: 0 Löcher an 16 Schnitten + Loop. lidcheck: nie ein Lid zu.
- Ton: +11,0 dB, 15-kHz-Tiefpass, Limiter (4× überabgetastet) → −14,0 LUFS, True Peak −1,8 dBTP, 39,900 s wie das Bild.

## Nachbesserung nach Prüfung (23.11.)
- c15 „Kam aus einem / Spott-GEDICHT / von 1622.“ (keine Waise, 6 Wörter, 2,8 s). c06 „Angeblich / deshalb: KRIEG.“ (1,6 s) + Pergament-Etikett „LEGENDE?“ (78 px) über Schilden und Eimer.
- Loop: harter Wechsel im selben Frame (Blase → Hook-Bild, c17 → c18 ohne Aus-/Einblenden); alle Zyklen (Hintergrund, Wippen) enden auf dem letzten Frame → letztes Frame = Frame 0 (verlustfreie Snapshots: 0 abweichende Pixel).
- Helm: dreimal hebt Klotz den Rand an, das linke Auge lugt voll geöffnet hervor (Riemen blendet dabei aus), das rechte bleibt bedeckt.
- Ton: master.sh misst jetzt die kodierte Datei (AAC 256 kb/s) und senkt bei Bedarf die Limiter-Decke.
- Nach dem letzten Render: 39,9 s, −14,0 LUFS, −1,7 dBTP, 39,900 s; check 0 Fehler; overlap, layout, lidcheck ohne Befund; bounds Tinte x 92–999, DOM x 98–1000; cutcheck 0 Löcher an 16 Schnitten + Loop.
