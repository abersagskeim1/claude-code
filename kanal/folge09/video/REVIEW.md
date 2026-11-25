# REVIEW – Folge 9 „Der Mann, der den Eiffelturm verkaufte“

- 39,8 s, 1080×1920, 30 fps, 1194 Frames, H.264 + AAC. 17 Szenen + Hintergrund + Klotz + Untertitel als Sub-Kompositionen.
- Quellen: `tools/gen.mjs` (prüft Lesezeit, ≤ 6 Wörter, Hook bis 1,0 s, doppelte IDs, schreibt `tools/cuts.txt`), `tools/sfx.py` (`python3 tools/sfx.py assets/sfx 39.8 24.56`, Charleston + Effekte, selbst synthetisiert), `tools/master.sh`, `tools/thumb.mjs` („ZU VERKAUFEN?!“), Prüfskripte overlap, layout, cutcheck, lidcheck, bounds (unverändert aus Folge 8).
- Neu: Art-déco-Rahmen (Stufenecken) und ovaler Porträtrahmen, eigene Turm-Silhouette, rotes Schild nur mit „€“, Zylinder + Schnurrbart (+ Monokel) als Symbol für Lustig, Schiebermütze über Geldsack als Symbol für den Käufer (Schild KÄUFER), Kartenfächer mit Zylinder-Joker, Ausweis mit „?“-Stempel, Schraubenschlüssel + Rostflecken, Schrottwaage mit Zeiger, Angelhaken mit Turm als Köder, Scheck + Fußspuren + Staubwolke, Kerzenständer-Telefon, Sirene + Pfeife, Ozeandampfer, Gitter + Insel (ALCATRAZ), Browser-Fenster, Art-déco-Kommentarblase. Keine Gesichter für Personen.
- Klotz-Gags: Mini-Zylinder + Schnurrbart-Aufkleber; zückt einen Mini-Geldbeutel (will selbst kaufen), schwenkt ihn bei NOCHMAL, versteckt ihn, als die Polizei kommt; am Ende misstrauischer Blick nur über die Brauen und Schild „nicht zu verkaufen“ (durchgestrichenes €, ohne Text) an sich selbst. Position unverändert (700/1480).

## Abweichungen vom Skript (gegen Waisenwörter/Breite/Wortzahl)
„1925. Er verkauft / den EIFFELTURM.“, „Ein BETRÜGER. / Ein sehr guter.“, „Seine Story: / Turm muss weg!“, „Zu teuer. / Verkauf / als SCHROTT.“, „NOCHMAL / verkauft er ihn!“ (190 px, größte Schrift), „Später landet er / hinter Gittern.“, „Hättest du / den Turm gekauft?“. Stempel „?“ statt „AMTLICH?“ und Klotz-Schild als durchgestrichenes € statt „NICHT ZU VERKAUFEN“ (sonst > 6 Wörter im Bild bzw. Schrift < 72 px). Kein rotes Gesicht-Emoji (keine Gesichter): der Geldsack des Käufers wird rot, dampft und schwitzt.

## Gemessen (nach dem letzten Render)
- `check`: 0 Fehler (Warnungen: Dateigröße/Dichte, Safe-Zone TikTok/Shorts für Beschriftungen bei y 1236–1336, Rotations-Pivot Arm).
- overlap.mjs (40 px, jedes Frame): keine Treffer. layout.mjs: 18 Einblendungen ohne Waise, max. Breite 884, y 300–646. Fließtext 92 px, Schlagworte 140 px, NOCHMAL 190 px, Beschriftungen 76–80 px.
- bounds.mjs: DOM x 87–1000, Tinte x 82–999. cutcheck.py: 0 Löcher an 16 Schnitten + Loop. lidcheck: nie ein Lid zu.
- Ton: −14,0 LUFS, True Peak −3,8 dBTP, 39,800 s wie das Bild.
