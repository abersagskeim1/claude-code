# REVIEW – Folge 10 „Leeroy Jenkins“ (Staffelfinale)

- 38,8 s, 1080×1920, 30 fps, 1164 Frames, H.264 + AAC. 17 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 38.8 30.4`, Chiptune + Effekte, selbst synthetisiert), `tools/master.sh`, `tools/thumb.mjs` („32,33 %?!“), Prüfskripte overlap, layout, cutcheck, lidcheck, bounds (unverändert aus Folge 9).
- Neu: eigene Pixel-Sprites (Held mit erhobenem Schwert, Gruppenfiguren, Drachen-Eier, Babydrachen, Herz, „!“), eigene 5×7-Pixelschrift für „LEEROY JENKINS!“, Sprechblasen „??“, Dungeon-Eingang mit Fackeln, Kreidetafel mit gezeichneten Pfeilen, Taschenrechner „32,33“ mit Periodenstrich (Tasten ohne Ziffern), Kopfhörer + Noten, Hühnchenkeule, Comic-Grabsteine ohne Text, 9 Bildschirme + Herz/Teilen, Quiz-Tafel ohne Logo/Beträge, Vorhang, Filmklappe, Pokal, Pixel-Kommentarblase. „World of Warcraft“ nur als Text-Schild; Beschriftungen LEEROY, GRUPPE, TV-QUIZ, PLAN (76–90 px).
- Klotz-Gags: Notizblock + Stift an der Strategie-Tafel; bei K.O. rennt er selbst mit Sprechblase „KLOTZ!“ los (250 px) und sofort zurück; am Ende Hühnchenkeule + Zwinkern (nur rechtes Lid). Position unverändert (700/1480).
- Schrift: keine negative Laufweite (Fließtext 0, Lilita +0,02 em), Fließtext 92 px, Schlagworte 140 px, INSZENIERT 160 px (größte). Lilita One zusätzlich als data-URI eingebettet (die Sandbox-Vorschau konnte die Datei sonst nicht laden, Prüfskripte maßen dann eine Ersatzschrift).

## Abweichungen vom Skript (gegen Waisenwörter/Breite)
„Ein Typ / ruiniert ALLES.“, „2005. Ein / Rollenspiel / im Internet.“, „Chance laut / Rechnung: / 32,33 %“, „Sogar „Jeopardy!“ / fragt danach.“ (Schild TV-QUIZ), „Und die Wahrheit?“ einzeilig, „INSZENIERT / war alles.“, „Trotzdem / feierte ihn / die Spielefirma.“, „Rennst du auch / mal einfach los?“. Szenenzeiten leicht verschoben (Lesezeit).

## Gemessen (nach dem letzten Render)
- `check`: ok (nur Warnungen: Dateigröße/Dichte, Plattform-Safe-Zones, Rotations-Pivot).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, max. Breite 900, y 300–646, Tinte x 84–994.
- bounds.mjs: DOM x 83–1000, Tinte x 82–999. cutcheck.py: 0 Löcher an 16 Schnitten + Loop. lidcheck: nie beide Lider, Zwinkern f1102–1113.
- Ton: −14,0 LUFS, True Peak −3,7 dBTP, Audio 38,800 s wie das Bild.
