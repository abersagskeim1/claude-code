# REVIEW – Folge 11 „Die Schweiz erobert Liechtenstein“ (Staffel 2, Auftakt)

- 38,0 s, 1080×1920, 30 fps, 1140 Frames, H.264 + AAC. 16 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 38.0 31.6`, Alpen-Marsch + Effekte, selbst synthetisiert), `tools/master.sh`, `tools/thumb.mjs` („AUS VERSEHEN?!“), Prüfskripte overlap, layout, cutcheck, lidcheck, bounds (unverändert aus Folge 10). Lilita One als data-URI eingebettet.
- Neu: Cartoon-Soldaten mit Taschenlampen (keine Waffen), Grat mit gestrichelter Grenze und Schildern SCHWEIZ / LIECHTENSTEIN, Mond mit Regen und Nebel, Schild „170“, Kompass, Wanderkarte mit Fußspuren über die Grenze, Fahne Liechtenstein blau-rot ohne Krone, leere Schachtel „LEER“ mit Motte, Kehrtwende-Pfeil, schlafendes Dorf mit „Zzz“ aus den Häusern, Telefon mit Schweizer Fahne, Brief ENTSCHULDIGUNG mit Siegel, Taschenlampe, Holztafel mit Strichliste (2 alte + 1 neuer Strich, vgl. The Local „three times“), Postkarte mit „?“.
- Klotz-Gags: hält die Wanderkarte verkehrt herum (Berg und Kompassnadel zeigen nach unten), läuft im Stand mit, zieht sie bei „Und das Beste?“ weg; am Ende erscheint eine Grenzlinie mit Fähnchen, er hüpft kurz drüber, erschrickt, hüpft rot zurück. Position 700/1480 unverändert, Lider immer offen.

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„März 2007. / Mitten in / der Nacht.“, „Rund 170 / Schweizer Soldaten / beim Training.“ (88 px), „Schlechtes / Wetter. Dunkel. / Und dann:“, „nach Liechtenstein.“ (86 px, weiß: LIECHTENSTEIN in 140 px wäre 1046 px breit), „Und Liechtenstein?“ (88 px), „Die Schweiz / meldet es / ganz SELBST.“, „Und entschuldigt / sich offiziell.“, „Es war nicht das / ERSTE Mal.“ (160 px, größte), „Welchen Nachbarn / würdest du / gern „besuchen“?“ (88 px).

## Gemessen (nach dem letzten Render)
- `check`: ok (nur Warnungen: Dateigröße/Dichte, Plattform-Safe-Zones).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: 17 Einblendungen ohne Waise, max. Breite 900, Tinte y 288–653, x 85–993.
- bounds.mjs: DOM x 87–1000, Tinte x 86–999. cutcheck.py: 0 Löcher an 15 Schnitten + Loop. lidcheck: kein Frame mit geschlossenen Lidern.
- Ton: −14,0 LUFS, True Peak −3,1 dBTP, Audio 38,000 s wie das Bild.

## Nachbesserung nach Prüfung (27.11.)
- Hook „2007: Die / SCHWEIZ / marschiert ein?!“ ab Frame 0 lesbar; zweite Einblendung „Im März. Mitten / in der Nacht.“.
- Fahne Liechtenstein (c07, c09, c10) als glatte SVG-Pfade, Welle per Pfad-Morph statt versetzter Streifen.
- Loop: Klotz' Schweißtropfen ab 37,4 s aus wie in Frame 0.
- Nach dem letzten Render: check ok; overlap, lidcheck ohne Befund; layout ok; bounds Tinte x 86–999, DOM x 87–1000; cutcheck 0 Löcher; −14,0 LUFS, −3,1 dBTP, 38,000 s. Thumbnail unverändert (Frame-1-Motiv gleich).
