# REVIEW – Folge 12 „Atari vergräbt Spiele in der Wüste“ (Staffel 2)

- 39,4 s, 1080×1920, 30 fps, 1182 Frames, H.264 + AAC. 16 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.4 30.7`, Wüsten-Groove + Effekte, selbst synthetisiert), `tools/master.sh`, `tools/thumb.mjs` („NUR EIN MYTHOS?!“), Prüfskripte overlap, layout, cutcheck, lidcheck, bounds (unverändert aus Folge 11). Lilita One als data-URI eingebettet.
- Neu: Wüste bei Sonnenuntergang, Düne mit generischen Modulen (eigene Form, Etikett nur Farbflächen bzw. „?“), Saguaro, Sonne, Pergament mit Stempel MYTHOS?, Daumen-runter-Regen (in eigener Clip-Box unter dem Text), Regal mit Spinnennetz und fallendem Preisschild (ohne Zahl), LKW mit Staubwolken, Ortsschild ALAMOGORDO (nur Schrift) + Müllhügel mit Fliegen, Bagger + Absperrband (glatte Kurven, Wellen per Pfad-Morph), Module steigen aus dem Sand, Kiste „RUND 1.300“, Kästchen LEGENDE ?, MILLIONEN durchgestrichen, Haufen „RUND 700.000“ (96 px < Pointe 200 px), Vitrine mit Spot und Kordel, Kommentar-Blase.
- Klotz-Gag: Mini-Schaufel, findet Socke (c09) und Mini-Kaktus (c10); hält ab 33,9 s ein eigenes Modul wie eine Trophäe. Position 700/1480 unverändert, Lider immer offen, ab 38,8 s alle Requisiten/Tropfen aus wie in Frame 0.
- Kein Atari-Logo, keine E.T.-Figur, keine Spielgrafik; Zahlen im Bild nur 1983, 2014, rund 1.300, rund 700.000.

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„1983. / In der WÜSTE / Spiele vergraben?!“ (Wortstellung, „vergraben?!“ stünde sonst allein), „UNVERKAUFT: / viele Module / bleiben liegen.“, „Auf einer / Müllkippe in / New Mexico.“, „Und tatsächlich: / echte E.T.-Module!“ (88 px), „Geborgen: rund / 1.300 Stück.“, „Fast. Aber / MILLIONEN / waren es nicht.“, „Sondern rund / 700.000 / Module insgesamt.“, „Ein Modul steht / heute im Museum.“ (88 px), „Welchen Gaming- / Mythos sollen / wir checken?“.

## Gemessen (nach dem letzten Render)
- `check`: ok (nur Warnungen: Dateigröße/Dichte, Plattform-Safe-Zones, Drehpunkt).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: 17 Einblendungen ohne Befund, max. Breite 912, Tinte y 303–715.
- bounds.mjs: DOM x 87–1000, Tinte x 80–999. cutcheck.py: 0 Löcher an 15 Schnitten + Loop. lidcheck: kein Frame mit geschlossenen Lidern.
- Ton: −14,0 LUFS, True Peak −3,3 dBTP, Audio 39,400 s wie das Bild.
