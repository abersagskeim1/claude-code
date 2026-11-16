# YouTube-Upload per API einrichten (einmalig, ca. 20 Min., kostenlos)

Wichtig: Gib die Werte aus Schritt 5 und 6 **niemals im Chat** ein, nur in Schritt 7 in den Einstellungen.

## 1. Projekt anlegen
console.cloud.google.com → oben Projektauswahl → **Neues Projekt** → Name z. B. `wirklich-passiert` → Erstellen.

## 2. API einschalten
Menü → **APIs & Dienste → Bibliothek** → „YouTube Data API v3“ → **Aktivieren**.

## 3. Zustimmungsbildschirm (Google Auth Platform)
- **Branding**: App-Name `Wirklich Passiert Upload`, deine E-Mail als Support- und Entwickler-Kontakt.
- **Zielgruppe**: Typ **Extern**, unter „Testnutzer“ das Google-Konto des Kanals eintragen.
- Danach **„App veröffentlichen“ → „In Produktion“**. Sonst läuft der Zugang nach 7 Tagen ab. Die Warnung „nicht bestätigte App“ ist für deinen Eigengebrauch in Ordnung.
- **Datenzugriff → Bereiche hinzufügen**: `https://www.googleapis.com/auth/youtube.upload` und `https://www.googleapis.com/auth/youtube` (für Thumbnail und Playlist).

## 4. Zugang (Client) erstellen
**Clients → Client erstellen** → Typ **Webanwendung** → unter „Autorisierte Weiterleitungs-URIs“ eintragen:
`https://developers.google.com/oauthplayground` → Erstellen.

## 5. Client-ID und Client-Secret notieren
Kopier beide Werte in deine eigenen Notizen, nicht in den Chat.

## 6. Refresh-Token holen
1. developers.google.com/oauthplayground öffnen.
2. Zahnrad oben rechts → **„Use your own OAuth credentials“** anhaken → Client-ID und Secret eintragen.
3. Links bei „Step 1“ unten ins Feld eingeben:
   `https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube`
   → **Authorize APIs**.
4. Mit dem Google-Konto anmelden, dem der Kanal gehört. Hat der Kanal ein Brand-Konto, wähle den **Kanal** aus.
5. Bei „Google hat diese App nicht überprüft“ auf **Erweitert → Weiter zu … (unsicher)** und dann **Zulassen** klicken.
6. „Step 2“ → **Exchange authorization code for tokens** → den **Refresh token** kopieren.

## 7. In der Cloud-Umgebung eintragen
Claude-App → in dieser Sitzung oben das Umgebungsmenü → **faceless-youtube → Bearbeiten → Umgebungsvariablen**:
```
YT_CLIENT_ID=<deine Client-ID>
YT_CLIENT_SECRET=<dein Client-Secret>
YT_REFRESH_TOKEN=<dein Refresh-Token>
```
Speichern. Hinweis: Die Werte liegen nur in deiner persönlichen Umgebung, die außer dir niemand sieht. Widerrufen kannst du den Zugang jederzeit unter myaccount.google.com/permissions.

## 8. Fertig melden
Schreib „fertig“. Die Variablen gelten ab der nächsten Sitzung. Die tägliche Aufgabe startet jedes Mal eine neue Sitzung, also funktioniert der Upload dort automatisch.

## Gut zu wissen
- Uploads von nicht geprüften API-Projekten bleiben **privat**. Du stellst sie in der YouTube-App selbst auf „Öffentlich“, und genau das ist der halbautomatische Ablauf.
- Ein eigenes Thumbnail per API klappt nur bei einem per Telefon verifizierten Kanal (youtube.com/verify). Bei Shorts nimmt YouTube unter Umständen trotzdem ein Bild aus dem Video. Frame 1 ist deshalb bereits das Thumbnail-Motiv.
- Kontingent: 1 Upload kostet 1.600 von 10.000 Einheiten pro Tag, also reicht es für 1 Folge pro Tag locker.
