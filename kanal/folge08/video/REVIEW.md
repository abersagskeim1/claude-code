# REVIEW – Folge 8 „Der Kuchen-Krieg“

- 39,8 s, 1080×1920, 30 fps, 1194 Frames, H.264 + AAC. 17 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.8 24.58`, Musette-Walzer + Effekte, selbst synthetisiert), `tools/master.sh`, `tools/thumb.mjs` („60.000 PESOS?!“), Prüfskripte overlap, layout, cutcheck, lidcheck, bounds (unverändert aus Folge 7).
- Neu: Törtchen auf Kuchenständer, vereinfachte Trikolore-Fahnen ohne Wappen, Kalenderblatt ohne Zahlen + Kaktus, Konditorei mit Schild PÂTISSERIE (76 px), dieselbe Konditorei leer mit Krümeln, Preisschild „< 1.000“, Rechnung von der Rolle mit 60.000, Zeigehandschuh, Zettelstapel, Zettelturm, Hafen mit Segelschiff-Silhouetten (keine Kanonen), Waage (Törtchen gegen Zettel), Tortenstück, Handschlag + Münzen über Waage, Vorhang, einzelner Stiefel auf Kissen, Grabstein mit Stiefel-Gravur und Blume, Kommentar-Blase mit Torte und Gabel. Keine Kampfszene, keine Verletzung, keine Opfer.
- Klotz-Gags: Konditor-Mütze; verteidigt ein Törtchen (misstrauischer Blick); verschluckt sich bei der wachsenden Rechnung an einem Krümel (Husten, Schweiß); Salut am Grab (eigener Salut-Arm vor dem Körper, Hand neben dem rechten Auge, Auge bleibt frei); isst das Törtchen am Ende in drei Bissen selbst. Position unverändert (700/1480).

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„Mexiko, / vor fast zwei- / hundert Jahren.“ (ausgeschrieben, Zahlen im Bild nur < 1.000, 60.000, 600.000, 1838, 1839), „GEPLÜNDERT: / seine Konditorei.“, „Wert des Ladens: / < 1.000 Pesos.“, „Mit anderen / Forderungen / sind es:“, „1838: Frankreich / sperrt die Häfen.“, „KUCHEN- / KRIEG / heißt er seitdem.“ (200 px, größte Schrift), „Und jetzt / das Skurrilste?“, „General / Santa Anna / verliert ein BEIN.“, Schlussfrage ohne 🍰 (kein Emoji-Font; Torte als Zeichnung in der Blase).

## Gemessen (nach dem letzten Render)
- `check`: 0 Fehler (Warnungen: Dateigröße/Dichte, Safe-Zone TikTok/Shorts für c03 und „60.000“ – innerhalb x 80–1000, Rotations-Pivot der Strahlen).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, Tinte x 81–991, y 285–773, max. Breite 910. Fließtext 92 px, Schlagworte 140 px, KUCHEN-KRIEG 200 px, Beschriftungen ≥ 76 px.
- bounds.mjs: DOM x 87–1000, Tinte x 82–999 über alle 1194 Frames. cutcheck.py: 0 Löcher an 16 Schnitten + Loop; letztes Frame ≈ Frame 0 (mittlere Abweichung 0,2/255). lidcheck: nie ein Lid zu.
- Ton: +6,7 dB, Limiter → −14,0 LUFS, True Peak −3,9 dBTP, 39,800 s wie das Bild.

## Nachbesserung nach Prüfung (24.11.)
- Hook/Loop/Thumbnail: Fahnen nach oben, darunter Schilder „MEXIKO“ / „FRANKREICH“ (74 px), Mexiko-Fahne mit vereinfachtem Emblem (brauner Kreis, grüner Kaktus); Törtchen und Ständer etwas kleiner darunter. Titel neu: „Wegen einem Konditor in den KRIEG?! 🤯🍰 #Shorts“.
- Handschlag: Ärmel neutral, Trikolore-Manschetten (am Bildschirm von links nach rechts: Mexiko grün-weiß-rot, Frankreich blau-weiß-rot).
- Funkeln bei 60.000 steigt jetzt nach oben aus dem Bon; mindestens 91 px Abstand zum Punkt (inkl. Sprung der Zahl).
- „Mexikos General / Santa Anna …“ (2,0 s) + „verliert ein BEIN.“ (1,6 s); dafür c01 2,0 s, c04 1,8 s, c09 1,6 s (Lesezeit erfüllt). Musikpause jetzt vor 24,0 s (`sfx.py assets/sfx 39.8 23.78`).
- Nach dem letzten Render: 39,8 s, −14,0 LUFS, −3,9 dBTP, 39,800 s; check 0 Fehler; overlap, layout, lidcheck ohne Befund; bounds Tinte x 82–999, DOM x 87–1000; cutcheck 0 Löcher an 16 Schnitten + Loop.
