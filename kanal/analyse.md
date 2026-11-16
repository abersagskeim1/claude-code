# Analyse Vorbild-Kanal Trymacs (@trymacs): Muster für einen deutschsprachigen Faceless-Shorts-Kanal

Stand: 16.11.2026. Alle Rohdaten liegen in `/home/user/kanal/`. Jeder Abschnitt trennt **Belegt** (gemessen, gezählt oder zitiert) von **Vermutet** (Interpretation, nicht durch diese Daten bewiesen).

---

## 1. Datenbasis

**Belegt: was geholt wurde**

| Datenart | Ziel | Erhalten | Datei(en) |
|---|---|---|---|
| Liste Shorts | alle | 7 Shorts (mehr gibt es auf dem Kanal nicht) | `shorts_flat.tsv` |
| Liste lange Videos | letzte 50 | 50 (Upload 08.10.–16.11.2026) | `videos_flat.txt` (englisch übersetzt) |
| Deutsche Originaltitel | alle | **alle 50 langen** + 7 Shorts | `videos_flat_de.txt` (über die Kanal-Playlist mit `youtube:lang=de` + `Accept-Language: de-DE`) |
| Volle Metadaten (Beschreibung, Tags, Likes, Kommentare, Datum) | 7 Shorts + Top 15 lang | **4 von 7 Shorts**, **8 von 15 langen** | `meta/<id>.json` |
| Auto-Untertitel Deutsch | Top 5 Shorts + Top 5 lang | Shorts: #1, #2, #3 + Ersatz #7. Lang: #1, #3, #5 + Ersatz #6, #7 | `subs/<id>.de.vtt`, Auswertung `subs/analyse.json` |
| Thumbnails | alle Shorts + Top 10 lang | **17 von 17**, alle angesehen | `thumbs/<id>.jpg` |

- **Nur 7 Shorts.** Alle 4 Shorts mit Metadaten stammen vom **13.–26.08.2021**. Sie sind also gut 5 Jahre alt; Trymacs produziert das Format nicht mehr. Für Shorts-Statistik ist das zu wenig und zu alt. Deshalb dienen die **50 langen Videos** als Hauptquelle für Muster (Titel, Thumbnails, Themen, Sprechtempo). Bei den Shorts werte ich nur Hook, Länge und Look aus.
- Fehlende Metadaten und Untertitel: Shorts `Rshp7sHfRiY` (#4) und `DnbS_20u7WM` (#5), lange Videos `Mg0W8q-MPug` (#2) und `kpuGX7pinuI` (#4). Ersatzweise ausgewertet: Short `wmulS9d6EGs` und die langen Videos `aMDzeB_L6Q0` und `unzkweSL_TQ`. Für die übrigen langen Top-15-Videos ohne Metadaten gibt es nur Aufrufe, Dauer und den deutschen Titel aus der Playlist.

**Belegt: Probleme bei der Beschaffung**
- YouTube blockierte viele Einzelabrufe mit „**Melde dich an, damit wir sehen, dass du kein Bot bist**“ bzw. HTTP 403 („Failed to extract any player response“). Ein **429 trat nicht auf**. Ein zweiter Durchlauf mit 30 s Pause pro Video brachte nur 2 weitere Videos (`meta/retry.log`). Danach habe ich abgebrochen. Ein dritter Versuch mit anderen yt-dlp-Player-Clients wurde von der Sicherheitsprüfung der Sitzung abgelehnt. Die Bot-Sperre habe ich nicht umgangen.
- Untertitel habe ich direkt über die VTT-URL aus den schon geladenen JSON-Dateien geholt (Spur `de-orig` = originale deutsche Spracherkennung), um keinen zusätzlichen gesperrten Abruf auszulösen. Inhaltlich ist das dasselbe wie `--write-auto-subs --sub-langs de`.
- Automatische Untertitel enthalten Erkennungsfehler („Trimax“/„Chimex“ statt Trymacs, „Jugendf“ statt Jugendwort). Satzzeichen setzt die Spracherkennung selbst. **Satzlängen sind deshalb nur Näherungswerte.** Bei den Shorts `B8wtJWqQ0VQ` und `wmulS9d6EGs` (2021) fehlen Satzzeichen ganz, dort gibt es keine Satzlänge.
- **Nicht verfügbar:** Watchtime, Retention-Kurve, CTR, Impressionen, Abo-Zuwachs (nur im YouTube Studio des Inhabers). Das Feld `heatmap` („meistgesehene Stellen“) war in den JSON-Dateien leer. Kapitel: 0 in allen geladenen Videos. Alle Aussagen darüber, *warum* etwas funktioniert, sind daher **Vermutungen**.
- Aufrufe sind eine Momentaufnahme. Neuere Videos hatten weniger Zeit (`-S6m3CpvlFg`: 3.000 Aufrufe in `videos_flat.txt`, 4.415 beim zweiten Abruf; erst wenige Stunden online).

**Vermutet**
- Was 2021 als Streamer-Short funktionierte, ist kein sicherer Maßstab für den Shorts-Feed 2026. Die alten Shorts zeigen eher, *welche Art Situation* trägt, nicht wie man sie heute umsetzt.

---

## 2. Top-Videos

**Belegt: alle 7 Shorts** (Aufrufe aus `shorts_flat.tsv`; wenn Metadaten vorhanden, genauer Wert aus `meta/`)

| # | ID | Titel (Original) | Aufrufe | Likes | Komm. | Upload | Dauer | Untertitel |
|---|---|---|---|---|---|---|---|---|
| 1 | Fd7dprf1GGI | Ich höre immer auf BigSpin 😅😂 #Shorts | 962.750 | 51.154 | 175 | 2021-08-13 | 17 s | ja |
| 2 | B8wtJWqQ0VQ | Der FIESESTE Zuschauer im Chat?! 😱🤡 #Shorts | 949.279 | 52.925 | 190 | 2021-08-14 | 27 s | ja |
| 3 | KR2HsMEG8Ys | Was denken die sich dabei?! Jugendwort 2021 #Shorts | 866.560 | 49.936 | 221 | 2021-08-15 | 41 s | ja |
| 4 | Rshp7sHfRiY | Mein SCHLIMMSTER Tag! 😢🤡 #Shorts | 666.000 | – | – | – | – | nein (Bot-Sperre) |
| 5 | DnbS_20u7WM | FITNESS Challenge FINALE! Sehr aufgeregt! 😳💪 | 538.000 | – | – | – | – | nein (Bot-Sperre) |
| 6 | MWRJ-MFTxqk | Das Influencer-Leben ist ANSTRENGEND! 😔😂 #Shorts | 297.000 | – | – | – | – | nein (Bot-Sperre) |
| 7 | wmulS9d6EGs | Größtes Gamescom Event aller Zeiten jetzt live!! | 271.221 | 12.822 | 153 | 2021-08-26 | 33 s | ja |

- Shorts: Median **666.000**, Mittelwert 650.000 Aufrufe (n = 7).
- Like-Rate (Likes/Aufrufe): Shorts **4,7–5,8 %** (n = 4), lange Videos **1,3–2,2 %** (n = 8). Kommentare pro 1.000 Aufrufe: Shorts 0,18–0,56, lange 0,16–0,67. Das ist ähnlich.

**Belegt: lange Videos, Top 15 nach Aufrufen**

| # | ID | Deutscher Titel | Aufrufe | Dauer | Likes | Komm. | Upload | Metadaten / Untertitel |
|---|---|---|---|---|---|---|---|---|
| 1 | 3_aiBJzey7Y | 😂😱CRAFT ATTACK 14! - MEIN bester START mit Eli, Sid, GTime, Willy, Repaz & Co.! #1 | 987.000 | 26 min | 22.075 | 199 | 2026-10-11 | ja / ja |
| 2 | Mg0W8q-MPug | 😍🔥XL CRAFT ATTACK 14 SERVER TOUR nach 1 WOCHE GRINDEN! - #11 \| Trymacs | 899.000 | 46 min | – | – | – | nein (Bot-Sperre) / nein |
| 3 | svwbLPtGkU4 | 🤣😨ICH putze den GANZEN MOND SAUBER mit RUMATHRA - Moon Sweepers Folge 1 | 763.000 | 42 min | 15.314 | 160 | 2026-11-13 | ja / ja |
| 4 | kpuGX7pinuI | 😍😱Die XL FARMEN gehen ENDLICH LOS in CRAFT ATTACK 14! - CRAZY START mit Eli, Willy, Sidney & Co. #2 | 743.000 | 77 min | – | – | – | nein (Bot-Sperre) / nein |
| 5 | faFQQmMRjpA | 😍🔥2 Wochen GRATIS Shop?! - NEUE Fortnite Schatzjäger Season! | 733.000 | 18 min | 11.541 | 262 | 2026-11-05 | ja / ja |
| 6 | aMDzeB_L6Q0 | 😂🤣 Ich SCAMME Kunden im EIGENEN POKEMON LADEN! \| Trading Card Simulator Folge 1 | 715.000 | 49 min | 9.523 | 272 | 2026-10-08 | ja / ja |
| 7 | unzkweSL_TQ | 🏆😍Die TITANEN sind PLATZ 1 AUFM Server! - Craft Attack 14 mit Eli, Sid, GTime, Willy, Repaz & Co. #5 | 697.000 | 30 min | 14.902 | 109 | 2026-10-13 | ja / ja |
| 8 | N-5GStaTS20 | 😍🔥ICH ZERLEGE MONTE beim GROßEN FITNACRAFT START 2026 - Das AGGRESSIVSTE Minecraft PROJEKT \| Trymacs | 615.000 | 37 min | – | – | – | nein (Bot-Sperre) / nein |
| 9 | gjOrqzlfBk0 | 💥😍Ich SPRENGE ALLES von IHNEN IN DIE LUFT! - Komplette RACHE ESKALATION in Fitnacraft 2026 \| Trymacs | 606.000 | 40 min | 12.325 | 407 | 2026-11-05 | ja / nein |
| 10 | BcYmRNqhh7s | 😱🔥Meine XL VILLAGER TRADING HALL + MAUERBAU BEGINNT in CRAFT ATTACK 14 mit ELI, WILLY und Co. #6 | 596.000 | 58 min | 13.176 | 145 | 2026-10-14 | ja / nein |
| 11 | tSdcCB0ELeQ | 😂🤣Mein BESTER PRANK jemals! - Rohat & Mia getrollt! \| FitnaMacs ist der Bamboo König! - Folge 7 | 594.000 | 42 min | – | – | – | nein (Bot-Sperre) / nein |
| 12 | nNn_B7Wkj1g | 😡🤯GRÖßTER Crashout?! - ELI´s FERRARI angeschaut! \| Craft Attack 14 mit Hänno, Gtime, Willy & Co. #9 | 591.000 | 43 min | – | – | – | nein (Bot-Sperre) / nein |
| 13 | Tu11P_Ofctg | 😱😍Das BESTE OPENING meines LEBENS! ULTRA HITS aus den 6000€ Evolving Skies - Trymacs | 586.000 | 27 min | 10.427 | 204 | 2026-10-28 | ja / nein |
| 14 | cY_c1-IFGqo | 😡🤣 Auf FRISCHER TAT ERTAPPT! DIEBSTAHL wird BESTRAFT!! + Gunpowder Farm! \| Craft Attack 14 \| #12 | 580.000 | 45 min | – | – | – | nein (Bot-Sperre) / nein |
| 15 | 8U9sEC2BpcM | 😍😱Riesen MAUER PROGRESS & TALK mit PAPAPLATTE in Craft Attack 14 - #8 | 571.000 | 27 min | – | – | – | nein (Bot-Sperre) / nein |

**Belegt: Statistik aller 50 langen Videos**
- Median **533.500** Aufrufe, Mittelwert 515.600, Quartile 419.500 / 533.500 / 587.250. Die Streuung ist gering: Die Hälfte aller Videos liegt zwischen 420.000 und 587.000.
- Ausreißer (1,5×IQR-Regel): nach oben `3_aiBJzey7Y` (987.000, Craft Attack 14 **#1**) und `Mg0W8q-MPug` (899.000, Craft Attack 14 Servertour #11). Nach unten nur `-S6m3CpvlFg` (3.000, wenige Stunden alt).
- Länge: Median **37 min**, Spanne 19–78 min. Jedes geladene Video hat die Tags „twitch“, „live“, „livestream“, „highlight“. Es sind geschnittene Stream-Aufzeichnungen.
- Takt: 50 Videos in 40 Tagen (08.10.–16.11.2026), also gut 1 pro Tag.
- Shorts-Median (666.000) liegt über dem Median der langen Videos (533.500). Die Shorts hatten aber 5 Jahre Zeit, die langen Videos höchstens 6 Wochen. Das ist kein fairer Vergleich.

**Belegt: Serien und Themen** (Zuordnung über Stichworte im Titel)

| Serie / Thema | n | Median Aufrufe | Max |
|---|---|---|---|
| Fortnite (neue Season) | 1 | 733.000 | 733.000 |
| Moon Sweepers (neues Indie-Spiel) | 2 | 596.000 | 763.000 |
| Craft Attack 14 (Minecraft-Großprojekt) | 20 | 555.000 | 987.000 |
| FitnaCraft 2026 (Minecraft-Großprojekt) | 10 | 547.500 | 615.000 |
| Pokémon (3× Shop-Simulator, 10× Pack-Openings) | 13 | 469.000 | 715.000 |
| Clash Royale / Clash of Clans | 3 | 384.000 | 418.000 |

- **Folge-1-Effekt:** Craft Attack #1 = 987.000 → #2 = 743.000 → Finale Folge 23 = 398.000. Moon Sweepers Folge 1 = 763.000 → Folge 2 = 429.000. Pokémon-Shop Folge 1 = 715.000 → Folge 2 = 486.000 → Folge 3 = 469.000. FitnaCraft „GROßER START“ = 615.000 ist das Maximum der Serie.
- Pokémon: Der Shop-**Simulator** (Spiel mit Story „eigener Laden“, 715.000/486.000/469.000) liegt über den meisten reinen Pack-Openings (274.000–586.000).

**Vermutet**
- Neuheit zieht: Start einer Serie, neues Spiel, neue Season liegen oben. Spätere Folgen verlieren Zuschauer, die nicht von Anfang an dabei sind.
- Die Minecraft-Projekte leben von vielen bekannten Mitspielern (Eli, Papaplatte, Monte, Rewi …). Das ist ein Netzwerk- und Personeneffekt, kein Format-Effekt.

---

## 3. Hook

**Belegt: Shorts** (Untertitel-Zitate, Zeit = erstes erkanntes Wort)
- `Fd7dprf1GGI` (Platz 1, 17 s): erstes Wort bei **2,7 s**. Davor nur Spielbild (Thumbnail zeigt Clash-Royale-Szene „Elektroriese Lvl. 13“). Dann: *„Ach so. Brücke. Brücke.“* … *„Also, wie fandest du das jetzt? Sag mal bitte ganz ehrlich …“*. 3× „[Musik]“ im VTT.
- `B8wtJWqQ0VQ` (Platz 2, 27 s): Sprache ab **0,0 s**, mitten in der Situation: *„wir haben hier ein [Typ], der muss aus der Vergangenheit hierher gereist sein … ich zitiere: ‚hey [Trymacs], Monte ist besser als du, du Lostboy‘ … voll gemein“*.
- `KR2HsMEG8Ys` (Platz 3, 41 s): ab **0,0 s** mitten im Satz: *„… welches das Jugendwort 2021 werden soll. Lost, Cringe und Wild.“*. Am Ende (30–41 s) Call-to-Action: *„Lasst doch gerne ein Follow da“* und Pointe *„Das ist so peinlich. Das ist so peinlich.“*
- `wmulS9d6EGs` (Platz 7, 33 s, Ersatz): ab **0,6 s** Superlativ-Aufzählung: *„größte Stream-Live-Event … jemals … Musik-Acts … Basketballplatz … BMX-Parcours … Küche“*.
- Keiner der 4 Shorts beginnt mit Begrüßung oder Name.

**Belegt: lange Videos** (erste 30 s)
- `3_aiBJzey7Y`: beginnt mit Vlog-Situation statt Spiel: *„Alter Koko, danke, dass ich bei dir duschen durfte, ne?“*, *„Wer fährt hier Fahrstuhl für ein Stockwerk? Schämt euch.“* Erst bei ~40 s: *„Moin Leute, [Trymacs] hier. Wir sind in Marbella und Craft Attack 14 startet … Wir werden die gigantische, riesige Mauer und Stadt bauen aus Attack on Titan.“*
- `svwbLPtGkU4`: *„Moin Leute, [Trymacs] hier. Wir spielen heute Moon Sweepers.“* Dann Spielidee in einem Satz: *„Der gesamte Mond ist voll mit Mondstaub … man startet am Anfang mit einer ganz kleinen Zahnbürste.“*
- `faFQQmMRjpA`: *„Wir zocken Fortnite.“* Danach Fakten: *„Spielerzahlen sind explodiert bis zu über 5 Millionen gleichzeitige Spieler.“* Bei 30–60 s Werbung für den Creator-Code.
- `aMDzeB_L6Q0`: *„… das Game ist so gut, dass ich das sogar fucking alleine zocke.“*
- `unzkweSL_TQ`: Ziel plus Zahl: *„Wir brauchen … 280 000 Dripstone-Zipfel.“* … *„würde das ein halbes Jahr dauern“*.
- In 4 von 5 langen Videos ist das Sprechtempo in den ersten 30 s (194–206 WPM) gleich hoch oder höher als im Durchschnitt des Videos (siehe Abschnitt 5).

**Vermutet**
- Shorts: **Cut mitten in die Situation**, ohne Begrüßung. Den Kontext liefert der Titel („Jugendwort 2021“, „fiesester Zuschauer“), nicht das Video.
- Lange Videos: Der Hook ist ein **Versprechen + konkrete Zahl/Ziel** (280.000 Blöcke, 5 Millionen Spieler, „mein bester Start“). Das trägt, weil Stammzuschauer die Person schon kennen. Für einen neuen Faceless-Kanal ohne Stammpublikum reicht ein Versprechen allein vermutlich nicht. Die Pointe oder der Konflikt muss in den ersten 1–2 Sekunden sichtbar sein.

---

## 4. Aufbau

**Belegt**
- Shorts: 17, 27, 33 und 41 s lang (n = 4). Struktur in `KR2HsMEG8Ys`: Thema (0–2 s) → Aufzählung mit Kommentar → Call-to-Action → Pointe als Wiederholung („Das ist so peinlich.“ 2×).
- Lange Videos: 0 Kapitelmarken. Typische Abfolge in den Untertiteln: Begrüßung „Moin Leute, [Trymacs] hier“ (3 von 5 in den ersten 30 s) → Spiel-/Ziel-Erklärung → (teils) Werbeblock (Creator-Code in `faFQQmMRjpA` bei 30–60 s) → Gameplay mit Mitspielern.
- **Beschreibungen** (8 lange Videos gelesen): feste Vorlage. (1) 1 Satz Teaser („Heute gehts richtig ab in Fitnacraft 2026!“, „Das BESTE SPIEL ALLER ZEITEN?!!!“). (2) Werbe- und Affiliate-Links mit Code „Trymacs“ (Nobomi, ESN, Loco Chicken), mit `*` markiert. (3) Podcast-Link. (4) „Schreibt eure Meinung gerne in die Kommentare! :) Viel Spaß!“. (5) Social-Links (Twitch, Instagram, Twitter, TikTok, Reddit, Discord). (6) Epidemic Sound. (7) Affiliate-Hinweis. Bei Craft Attack zusätzlich Teilnehmerliste-Link. `faFQQmMRjpA` beginnt mit „[Werbung]“. **Keine Hashtags** in den langen Beschreibungen.
- Shorts-Beschreibungen: **1 Satz + 2 Hashtags**, z. B. *„Es ist immer wichtig auf den Coach BigSpin zu hören. #Shorts #Trymacs“*, *„Was haben die sich beim Jugendwort 2021 nur gedacht? #Shorts #Trymacs“*. Ausnahme `wmulS9d6EGs`: nur *„Live: https://www.twitch.tv/Trymacs“*.
- Tags: lange Videos haben 28–55 Tags, mit festem Block („trymacs, twitch, live, livestream, meme, lustig, memes, highlight, highlights, lost, stream, deutsch“) plus Namen anderer Creator (Papaplatte, Montanablack, Paluten …). Shorts: 4–8 Tags.

**Vermutet**
- Shorts-Dramaturgie: Situation → Reaktion → Pointe, ohne Intro und Outro.
- Lange Videos: Spannung über Ziel (Mauer, 100.000 TNT), Konflikt (Prank, Rache, Bann, „Crashout“) und Reaktion der Mitspieler.

---

## 5. Tempo

**Belegt** (WPM = erkannte Wörter ÷ Sprechdauer vom ersten bis letzten Wort × 60)

| Video | Format | Wörter | WPM gesamt | WPM erste 30 s | WPM pro Minute (min–max) | Satzlänge Median (Wörter) | Anteil Sätze ≤ 5 Wörter | Fragen/min |
|---|---|---|---|---|---|---|---|---|
| Fd7dprf1GGI | Short 17 s | 24 | 102 | – | – | 2 | 60 % | 8,5 |
| B8wtJWqQ0VQ | Short 27 s | 49 | 112 | – | – | (keine Satzzeichen) | – | – |
| KR2HsMEG8Ys | Short 41 s | 95 | 140 | 150 | – | 7,5 | 40 % | 0 |
| wmulS9d6EGs | Short 33 s | 98 | 192 | – | – | (keine Satzzeichen) | – | – |
| 3_aiBJzey7Y | lang 26 min | 5.019 | 190 | 206 | 69–248 | 6 | 45 % | 6,1 |
| svwbLPtGkU4 | lang 43 min | 7.661 | 180 | 194 | 113–240 | 6 | 47 % | 4,9 |
| faFQQmMRjpA | lang 19 min | 2.751 | 146 | 196 | 87–218 | 5 | 54 % | 4,4 |
| aMDzeB_L6Q0 | lang 49 min | 5.384 | 110 | 202 | 58–194 | 5 | 63 % | 2,4 |
| unzkweSL_TQ | lang 31 min | 5.939 | 194 | 154 | 134–245 | 6 | 47 % | 4,8 |

- Lange Videos: 110–194 WPM gesamt, Spitzenminuten bis **248 WPM**. Sätze kurz: Median **5–6 Wörter**.
- Pausen über 3 s zwischen zwei Wörtern: 12 (`unzkweSL_TQ`) bis 170 (`aMDzeB_L6Q0`, Simulator mit Lese- und Klickphasen).
- Shorts: 102–192 WPM. Der Spitzen-Short `Fd7dprf1GGI` hat nur 24 Wörter in 17 s. Er lebt vom Spielgeschehen und der Reaktion, nicht vom Reden.

**Vermutet**
- 180–200 WPM ist für Deutsch sehr schnell (übliches Erzähltempo liegt eher bei 120–150 WPM; das ist Allgemeinwissen, hier nicht gemessen). Die Energie kommt aus Trymacs' Sprechweise.
- Für Motion-Design mit Sprecher oder Text-to-Speech übertragbar: **kurze Sätze (≤ 6 Wörter), viele Fragen, Zahlen**. Das Tempo sollte aber so bleiben, dass eingeblendeter Text lesbar ist (vermutlich 150–170 WPM). Ein Short muss nicht durchgehend besprochen sein: Der erfolgreichste Short hat nur 24 Wörter.

---

## 6. Look

**Belegt** (aus den Thumbnails bzw. Standbildern und den Metadaten)
- Format: Shorts 1080×1920 (vertikal), lange Videos 1920×1080.
- Shorts-Standbilder (7 angesehen): 4 von 7 zeigen Trymacs mit **Headset vor Webcam** (2× Greenscreen, 1× Minecraft-Hintergrund, 1× mit eingeblendetem Meme-Bild „Jugendwort“). 1 zeigt Clash-Royale-Gameplay mit Spieltext („Elektroriese Lvl. 13“) und Chat-Sprechblase. 1 zeigt eine Handy-Aufnahme vom Strand (Fitness-Challenge). 1 ist ein Selfie-Video in blau/lila Bühnenlicht (Gamescom-Event). **Kein Short-Standbild hat einen gestalteten Text-Layer.**
- Lange Videos: Webcam + Gameplay. Das Video selbst ist Stream-Material (siehe Untertitel mit Chat-Bezügen und Werbeblöcken).

**Vermutet**
- 2021-Shorts: wenig Produktionsaufwand, getragen von Person und Situationskomik.
- Für einen Faceless-Kanal gilt das Gegenteil: Ohne Gesicht muss der **Grafik-Layer die Rolle der Person übernehmen** (Farben, Typo, Figuren/Maskottchen, Sound-Effekte).

---

## 7. Titel-Muster

**Belegt: lange Videos** (deutsche Titel, n = 50)
- **49 von 50** Titeln beginnen mit **genau 2 Emojis**, 1 mit einem einzigen. Häufigste Emojis: 😍 20×, 😱 14×, 🤯 12×, 🤣 8×, 🔥 8×, 😂 5×, 😨 4×, 💸 4×. Kombination meist „Gefühl + Steigerung“ (😍🔥, 😂😱, 🤯🧨).
- Länge ohne Emojis: Median **86 Zeichen** (58–99). 42 von 50 sind länger als 70 Zeichen, der Anfang wird also auf Mobilgeräten oft abgeschnitten. Das Wichtigste steht vorne.
- **Versalien:** Im Median sind **45 %** der Wörter eines Titels komplett großgeschrieben (Spanne 15–70 %). Häufigste Versalwörter: CRAFT/ATTACK (7), ICH (5), FITNACRAFT (5), OPENING (5), HITS (4), TNT (4), NEUE, GANZEN, ULTRA, SERVER, START, XXL, SPECIAL, STARTET.
- **Aufbau:** 47 von 50 nutzen Trenner „ - “ oder „ | “: **[2 Emojis][Hook in Versalien!] - [Kontext/Serie] | [Folge/#Nummer]**. 23 nennen eine Folgennummer. 14 enden mit „Trymacs“.
- **Satzzeichen:** 43 von 50 mit „!“, 10 mit „?“, oft kombiniert „?!“ oder „?!!“ („Er hat den GANZEN SERVER GEF***T?!! 60 Spieler müssen WEGEN IHM LEIDEN?“).
- **Wortfelder:** Superlative (BESTE, GRÖßTE, AGGRESSIVSTE, BRUTALSTE, DÜMMSTES), Eskalation (ESKALATION, CRASHOUT, Ragequit, SPRENGE, ZERLEGE, URKNALL), Ich-Perspektive (10 von 50 beginnen mit Ich/Mein/Meine/Unser).
- **Konkrete Zahlen und Geld:** „100.000 TNT“, „200 HÄUSER zu VIEL“, „60 Spieler“, „6000€ Evolving Skies“, „FÜR 23.500€ MASTERSET“, „50.000€ Turnier“, „2 Wochen GRATIS Shop“.

**Belegt: Shorts** (n = 7)
- Deutlich kürzer als die langen Titel, z. B. „Ich höre immer auf BigSpin 😅😂 #Shorts“. Emojis **am Ende**, nicht am Anfang (5 von 7 mit 2 Emojis). 5 von 7 mit „#Shorts“. 1 Versalwort pro Titel (FIESESTE, SCHLIMMSTER, ANSTRENGEND, FITNESS) oder gar keins.
- Muster: Frage/Ausruf + Gefühl. „Was denken die sich dabei?!“, „Der FIESESTE Zuschauer im Chat?!“, „Mein SCHLIMMSTER Tag!“.

**Vermutet**
- Für Shorts ist der Titel weniger wichtig als im Langformat, weil der Feed automatisch abspielt. Die kurze Form „Frage/Superlativ + 1 Versalwort + 2 Emojis“ ist trotzdem ein guter, übertragbarer Rahmen.
- Die 2-Emoji-Signatur am Anfang ist Trymacs' Markenzeichen. Übernehmen bringt vermutlich keinen eigenen Wiedererkennungswert; besser eine eigene, ebenso konsequente Signatur.

---

## 8. Thumbnail-Muster

**Belegt: lange Videos** (Top 10, 1280×720, alle angesehen)
- **Gesicht:** in **10 von 10** ein echtes Gesicht (Trymacs, teils mit Mitspielern), groß angeschnitten, meist mit Headset, in 5 von 10 allein auf der rechten Bildhälfte (Text/Logo links). Mimik übertrieben: weit aufgerissene Augen + offener Mund (`aMDzeB_L6Q0`, `gjOrqzlfBk0`), breites Grinsen (`3_aiBJzey7Y`, `Mg0W8q-MPug`, `kpuGX7pinuI`), Hände vor dem Mund (`faFQQmMRjpA`), skeptische Schnute (`BcYmRNqhh7s`), 3 Gesichter mit Grimassen (`N-5GStaTS20`). `unzkweSL_TQ`: Trymacs liegt erschöpft auf Minecraft-Gras (Fotomontage).
- **Text:** wenig. Meist nur das **Serienlogo** (Craft Attack 14 in 5 von 10, FitnaCraft in 2, Moon Sweepers in 1). Dazu höchstens 1–3 Wörter: „XL TOUR“, „GRATIS SHOP!“, „Mein ABSOLUTES TRAUMSPIEL!!“, „UPS“. Kleine Namensschilder im Minecraft-Stil („BEINE-HOCKER“, „SCHRADIN“, „TRYMACS“). Der Thumbnail-Text wiederholt nie den Titel.
- **Schrift:** sehr groß (Logo oder Text nimmt ca. ¼–⅓ der Bildfläche ein), fett, 3D-Kante, dicker dunkler Rand. Farben gelb/weiß bzw. das Rot/Gelb/Weiß der Serienlogos.
- **Farben und Kontrast:** stark gesättigt. Himmelblau + Grasgrün (Minecraft), Rot (TNT, FitnaCraft-Hintergrund), Gold-Gelb (Pokémon-Karten, Fortnite-Münze). Hohe Kontraste, Vordergrund scharf, Hintergrund teils weichgezeichnet.
- **Wiederkehrende Elemente:** eine orange-rote Minecraft-Figur als Maskottchen (in 4 von 10: `3_aiBJzey7Y`, `Mg0W8q-MPug`, `kpuGX7pinuI`, `BcYmRNqhh7s`). Emoji-Sticker 🤬 mit „&$!#%“ am FitnaCraft-Logo. Spielobjekte stark vergrößert (TNT-Blöcke, Pokémon-Karten mit Ausrufezeichen-Stern, Besen).

**Belegt: Shorts** (7)
- Kein gestaltetes Thumbnail: automatische Standbilder aus dem 9:16-Video, im 16:9-Thumbnail mit **unscharfen Seitenbalken**. 3 von 7 nur in 480×360 verfügbar. Kein Text außer Spielgrafik. 5 von 7 zeigen das Gesicht.

**Vermutet**
- Ein Teil der Szenen sieht nach aufwendig gerenderten oder KI-erzeugten Bildern aus (Astronauten mit Besen, Minecraft-Panoramen, Titan hinter der Mauer). Das kann ich an den Bildern nicht sicher belegen.
- Bei Shorts entscheidet das erste Videobild im Feed mehr als das Thumbnail. Das **erste Frame** sollte deshalb so gebaut sein wie ein Thumbnail: 1 Motiv, 1–3 Wörter groß, starker Kontrast.

---

## 9. Was ist auf Faceless-Motion-Design übertragbar, und was nicht?

**Ehrlich vorweg:** Der Kanal lebt zum größten Teil von der **Person Trymacs**: seinem Gesicht auf jedem Thumbnail (10 von 10), seiner Stimme und seinem Sprechtempo (bis 248 WPM), seinem Netzwerk aus bekannten Mitspielern (Eli, Papaplatte, Monte, Rumathra …) und seiner Stamm-Community (Twitch fast täglich, Creator-Code, eigener Energy-Drink). Das ist für einen Faceless-Kanal **nicht übertragbar**. Auch die Shorts von 2021 funktionierten über Gesicht und Reaktion, nicht über Gestaltung. Eine Kopie dieses Kanals ohne Gesicht wäre vermutlich wirkungslos.

**Übertragbar (belegt als Muster bei Trymacs, Übertragung = vermutet)**
1. **Einstieg ohne Anlauf:** 3 von 4 ausgewerteten Shorts haben Sprache ab 0,0–0,6 s, keiner beginnt mit Begrüßung. → Im Motion-Design ab Frame 1 die Situation, Frage oder Behauptung zeigen.
2. **Kurze Sätze:** Median 5–6 Wörter, 45–63 % der Sätze ≤ 5 Wörter. → Text-Einblendungen in Häppchen von 3–6 Wörtern, Wort für Wort animiert.
3. **Fragen und Zahlen:** 2,4–6,1 Fragen pro Minute; Titel und Hooks voller konkreter Zahlen (100.000 TNT, 280.000 Blöcke, 23.500 €). → Jeder Clip braucht eine konkrete Zahl oder eine Frage als Anker.
4. **Superlativ- und Eskalationssprache** in Titeln (BESTE, GRÖßTE, ESKALATION, „?!“). Für Shorts dosiert wie bei Trymacs' Shorts: **1 Versalwort + Frage/Ausruf + 2 Emojis**.
5. **Serien mit nummerierten Folgen** (23 von 50 Titeln mit Nummer) und der **Folge-1-Effekt**. → Formate als Serie anlegen („Teil 1“ …) und neue Serien regelmäßig starten, statt eine Serie endlos laufen zu lassen.
6. **Neuheit/Aktualität:** neue Season, neues Spiel, Jugendwort 2021 (866.560 Aufrufe). → Aktuelle Anlässe (Trends, Jugendwort, Spiel-Updates) als Themen, umgesetzt mit Grafik.
7. **Visuelle Signatur:** festes Logo-System und ein wiederkehrendes **Maskottchen** (die Minecraft-Figur in 4 von 10 Thumbnails). → Für faceless das wichtigste übertragbare Element: Eine animierte Figur oder ein Avatar kann die Mimik-Rolle übernehmen (übertriebene Augen, offener Mund, Hände vor dem Gesicht).
8. **Thumbnail- und Erstes-Frame-Regeln:** gesättigte Farben (Blau/Grün/Rot/Gelb), große fette 3D-Schrift mit dunklem Rand, höchstens 1–3 Wörter, die den Titel nicht wiederholen, 1 vergrößertes Objekt.
9. **Kurze Beschreibung bei Shorts:** 1 Satz + 2 Hashtags (#Shorts + Kanalname).

**Nicht übertragbar**
- Gesicht und Mimik einer realen, bekannten Person (Thumbnails, Webcam-Reaktion).
- Stimme, Spontanität und Live-Reaktionen aus Streams. Ein Motion-Design-Video ist geplant, nicht live.
- Netzwerkeffekte (bekannte Mitspieler im Titel, Creator-Tags wie Papaplatte oder Montanablack).
- Fremdes Gameplay als Hauptinhalt. Der Nutzer will ausdrücklich keine fremden Clips verwenden. Spiele lassen sich höchstens als selbst gebaute Grafik, Nachstellung oder Parodie aufgreifen; Markenlogos von Spielen sollte man dabei rechtlich prüfen.
- Monetarisierungsstruktur (Creator-Code, eigene Produkte) setzt eine bestehende Fan-Basis voraus.

**Vermutet: offene Risiken**
- Die Shorts-Daten (n = 7, alle von 2021) sagen nichts über den Shorts-Algorithmus 2026. Besser wäre ein Abgleich mit aktuellen deutschen **Faceless**-Shorts-Kanälen (Text/Animation), die nicht von einer Person leben.
- Ohne Retention-Daten bleibt unklar, an welcher Sekunde Zuschauer abspringen. Die Hook-Aussagen beruhen nur auf dem Inhalt der ersten Sekunden, nicht auf gemessenem Verhalten.
