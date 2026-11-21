# REVIEW – Folge 5 „Sir Nils Olav“

- 39,7 s, 1080×1920, 30 fps, 1191 Frames. 13 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/, prüft Lesezeit, Wortzahl, Hook bis 1,0 s, doppelte IDs), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.7`), `tools/thumb.mjs`, `tools/overlap.mjs` (jetzt auch gegen Klotz), `tools/layout.mjs` (jetzt mit Tinten-Box inkl. Kontur/Umlaut-Punkte per Screenshot), neu `tools/cutcheck.py` (Kantenenergie Bild für Bild an jedem Schnitt und am Loop).
- Neu: Paradeplatz (roter Teppich, Wimpelketten, Scheinwerfer, aufsteigender Glitzer), Königspinguin-Rig mit Zier-Schwert und Orden, Schulterklappe mit 1→4 Sternen, Zoo-Tor mit EDINBURGH-Schild (78 px), Gardisten mit Bärenfellmütze (ohne Waffen), vereinfachte Norwegen-Fahne, Urkunde mit Fußabdruck-Stempel, Pinguin mit Mini-Mütze und Gruß, Karriere-Leiter mit Rang-Schild (Ritterschlag, 1 Stern, 2 Sterne), Wappen mit Eisinsel und Krone, Inspektion, Trommelwirbel, drei Silhouetten I/II/III (104 px) mit wandernder Krone, Kommentar-Blasen (Katze mit Krone, Hund mit Orden).
- Klotz-Gag: salutiert zweimal falsch herum (linke Hand, Hand verkehrt, wackelt), Kinnlade bei GENERALMAJOR, beugt sich bei „Und das Beste?“ vor, folgt der Krone mit den Augen, bekommt einen Pappe-Orden, ist stolz, zwinkert. Augen nie halb geschlossen.

## Abweichungen vom Skript
- Gegen Waisenwörter/Breite: „BEFÖRDERT / wird er ständig.“, „Er lebt im / Zoo Edinburgh.“, „Zur Königsgarde / in NORWEGEN.“, „MASKOTTCHEN / der Garde.“ (−0,035 em Laufweite), „Dann klettert er / die Leiter hoch.“, „BRIGADIER / ab 2016.“, „GENERAL- / MAJOR / ab 2023.“, „BARON / der Bouvetinsel / ist er auch.“, „Welchen Titel / verdient / dein Haustier?“.
- Zahlen im Bild nur 1972, 2008, 2016, 2023 (Faktencheck). Ritter auf Stufe 2, Brigadier Stufe 3, Generalmajor Stufe 4.

## Gemessen (nach dem letzten Render)
- `check`: ok, 0 Fehler. Warnungen bewusst: Arm-Pivot (Rig), Hook-Text am Shorts-Rand (in 80 px / y 280–1500), I/II/III (Grafik, y ≤ 1310), frage-Startzustand per tl.set, Dateigröße.
- overlap.mjs (40 px, jedes Frame, Text und Klotz): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, Box ≤ 892 px, Tinte x 92–991, y 285–709. Fließtext 92 px, Schlagworte 140 px, DRITTE 184 px.
- Schnitte: alte Szene schrumpft/dimmt in den letzten 3 Frames und ist am Schnitt weg, neue Szene steht ab dem Schnitt-Frame (Startgröße ≥ 0,8). cutcheck.py: 0 Löcher an 12 Schnitten + Loop; im MP4 Bild für Bild angesehen. Loop: Blasen weg in dem Frame, in dem der Pinguin wächst (Frage-Text steht noch), letzte 18 Frames = Frame-0-Bild, Hook-Text komplett ab 39,54 s.
- Ton (gemessen, nicht gehört): +8,3 dB + Limiter (4× überabgetastet) → −14,0 LUFS, True Peak −2,0 dBTP, 39,700 s wie das Bild.
- Schwächster Moment: 31,65–31,9 s, dunkle Silhouetten wirken beim Aufbau kurz leer (Absicht für den Pointen-Pop von III).

## Nachbesserung nach Prüfung (21.11.)
- Alle Blinzler gestrichen (auch 8,3 s und 20,3 s); nur das Ein-Auge-Zwinkern bei 38,4 s bleibt. Neu `tools/lidcheck.mjs` (Lid-scaleY jedes Frames): kein Frame mit beiden Lidern (teil)geschlossen, nur f1153–1157 rechtes Auge.
- 27,55–30 s Text jetzt „Er inspiziert / die Garde.“. Silhouetten I/II/III als Seitenprofil mit Schnabel, Flügel, Füßen und Auge. Schulterklappe nur noch 2 Sterne.
- Thumbnail „RITTER?!“. Ton −14,0 LUFS / −2,1 dBTP, 39,700 s. overlap, layout, cutcheck (0 Löcher) nach dem letzten Render erneut ohne Befund.
