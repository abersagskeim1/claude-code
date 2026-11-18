# REVIEW – Folge 2 „Corrupted Blood“

- Gebaut nach skript.md, **38,6 s**, 1080×1920, 30 fps, 16 Szenen + Loop-Szene + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (schreibt index.html + compositions/), `tools/sfx.py` (Soundeffekte + Chiptune-Beat per numpy, `python3 tools/sfx.py assets/sfx 38.6`), `tools/thumb.mjs` (Thumbnail-Seite in `../thumb/`). Handänderungen an compositions/ gehen beim nächsten gen.mjs-Lauf verloren.
- Technik aus Folge 1 übernommen: Klotz-Rig und Mimik-Presets, Untertitel mit festem Wortabstand (äußerer Span fest, innerer skaliert), Szenen überlappen um 0,3 s, Loop-Szene baut Frame 1 nach. Szenen und Grafiken sind neu und in Pixel-Optik (eigene Sprites: Figuren, Boss, Wolf, Tor, Häuser, Grabsteine, Heiler, Griefer, Bäume, Cursor).
- Neuer Klotz-Gag: Bei K.O. (16,2 s) fliegt eine Mini-Maske auf Klotz, bei NEUSTART (25,2–26,6 s) holt er Luft, niest, und die Maske fliegt davon.

## Abweichungen vom Skript
- Länge 38,6 s statt ca. 33 s, weil jede Einblendung ≥ 0,35 s/Wort (mind. 1,1 s) komplett lesbar steht. gen.mjs rechnet das für jede Zeile nach (alle ok). Die neuen Zeiten stehen in `caps` in gen.mjs.
- Die Schlussfrage (7 Wörter) kommt in zwei Einblendungen (3 + 4 Wörter), weil höchstens 6 Wörter pro Einblendung erlaubt sind.
- „Verdorbenes Blut“ und „The Lancet“ in Gelb (Lilita), aber nicht in Versalien. Schlüsselwort SEUCHEN in Versalien.
- Pointe: FORSCHER in 205 px (größte Schrift der Folge).

## Gemessen
- `check`: ok, 0 Fehler. Bewusst behaltene Warnungen: Arm-Pivot (Rig aus Folge 1), Plattform-Safe-Zone bei „2005.“ (y 290), Tag „World of Warcraft“ (bis y 1456), ECHT/Buttons am rechten Rand. Alles liegt innerhalb der Kanal-Zone 280–1500 bzw. 80 px Rand. Dazu Dateigröße captions/klotz.
- Ton gemessen, nicht gehört: nach dem Render per ffmpeg-loudnorm (2 Durchgänge, linear) auf **−17,0 LUFS**, Spitzenpegel −1,1 dBFS, Audio exakt 38,600 s wie das Bild (1158 Frames). Der Beat setzt von 25,45 bis 27,0 s aus (Power-off → FORSCHER).
- Flackern beim Neustart: 3 flache Helligkeitsdellen (bis 45 %) über 0,6 s mit Sinus-Ease, kein Weiß-Blitz.

## Schwächen
- 4,4–4,7 s: Der Zoom in den Monitor ist im Übergang unruhig, weil der Rahmen des Monitors hinter „Aber nicht in echt.“ durchläuft.
- 23,5 s: Die fliehenden Figuren laufen kurz vor den Häusern übereinander.
- Klotz' Mund ist hinter der Maske verdeckt (16–25,7 s), seine Mimik liegt dort nur in Augen und Brauen.
