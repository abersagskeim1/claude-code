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

## Nachbesserung nach Prüfung (18.11.)
- Ursache für Häuser, Tor und Tropfen, die über den Text springen: Symbol-IDs (`<symbol id="tier-gate">`) waren identisch mit Div-IDs. Dadurch hat GSAP das Symbol animiert. Symbole heißen jetzt `<szene>-sym-<name>`, und gen.mjs bricht bei doppelten IDs ab.
- Neue Regel „keine Grafik am Textblock“: `tools/overlap.mjs` misst jedes Frame (Wortboxen ±8 px gegen jede sichtbare Grafikbox, beschnitten durch overflow:hidden). Ergebnis: ganze Folge ≥ 40 px Abstand, 0 Treffer. Aufruf über die laufende Preview: `PUPPETEER_CORE=<pfad> node tools/overlap.mjs http://localhost:<port>/api/projects/video/preview 40`.
- Zoom läuft in einem Ausschnitt ab y 620, Text immer auf dunklem Grund. Der Boss poppt unter dem Text auf. Häuser kommen erst nach dem Text und von unten. Hook-Grafik, Arena und Sticker „nur hier!“ liegen tiefer. Die Brille poppt an Ort und Stelle auf.
- Fließtext 84 → 92 px (Frage 96 px). Die Buttons sind vor dem Loop ausgeblendet (bis 38,0 s).
- Thumbnail „TAUSENDE K.O.?!“.
- Ton: +7 dB und Limiter → −14,0 LUFS, True Peak −1,6 dBTP, 38,600 s wie das Bild.
