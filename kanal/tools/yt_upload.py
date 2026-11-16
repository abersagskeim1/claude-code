#!/usr/bin/env python3
"""Lädt ein Short über die YouTube Data API v3 hoch (Standard: privat).

Zugangsdaten kommen ausschließlich aus Umgebungsvariablen, die der Nutzer
selbst in den Einstellungen der Cloud-Umgebung einträgt:
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
Nichts davon wird ausgegeben oder gespeichert.

Aufruf:
  python3 yt_upload.py --video folge.mp4 --meta upload.json [--thumb thumbnail.png]
upload.json: {"title", "description", "tags": [...], "categoryId": "27",
              "privacyStatus": "private", "publishAt": optional ISO-Zeit,
              "playlistId": optional, "containsSyntheticMedia": false}
"""
import argparse, json, os, sys, urllib.error, urllib.parse, urllib.request

TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
THUMB_URL = "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={}"
PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet"


def env(name):
    v = os.environ.get(name)
    if not v:
        sys.exit(f"Fehlt: Umgebungsvariable {name} (in den Umgebungs-Einstellungen eintragen).")
    return v


def access_token():
    body = urllib.parse.urlencode({
        "client_id": env("YT_CLIENT_ID"),
        "client_secret": env("YT_CLIENT_SECRET"),
        "refresh_token": env("YT_REFRESH_TOKEN"),
        "grant_type": "refresh_token",
    }).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request(TOKEN_URL, data=body)) as r:
            return json.load(r)["access_token"]
    except urllib.error.HTTPError as e:
        sys.exit(f"Token-Erneuerung fehlgeschlagen (HTTP {e.code}). Refresh-Token abgelaufen oder widerrufen?")


def call(req):
    try:
        with urllib.request.urlopen(req) as r:
            return r
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")[:600]
        sys.exit(f"API-Fehler HTTP {e.code}: {detail}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--video", required=True)
    p.add_argument("--meta", required=True)
    p.add_argument("--thumb")
    a = p.parse_args()
    meta = json.load(open(a.meta, encoding="utf-8"))
    tok = access_token()
    auth = {"Authorization": f"Bearer {tok}"}

    status = {
        "privacyStatus": meta.get("privacyStatus", "private"),
        "selfDeclaredMadeForKids": False,
        "containsSyntheticMedia": bool(meta.get("containsSyntheticMedia", False)),
        "license": "youtube",
        "embeddable": True,
    }
    if meta.get("publishAt"):
        status["privacyStatus"] = "private"  # Pflicht für geplante Veröffentlichung
        status["publishAt"] = meta["publishAt"]
    resource = {
        "snippet": {
            "title": meta["title"],
            "description": meta["description"],
            "tags": meta.get("tags", []),
            "categoryId": str(meta.get("categoryId", "27")),
            "defaultLanguage": "de",
            "defaultAudioLanguage": "de",
        },
        "status": status,
    }
    size = os.path.getsize(a.video)
    init = urllib.request.Request(UPLOAD_URL, data=json.dumps(resource).encode(), method="POST", headers={
        **auth,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": str(size),
    })
    session_url = call(init).headers["Location"]

    with open(a.video, "rb") as f:
        up = urllib.request.Request(session_url, data=f.read(), method="PUT",
                                    headers={**auth, "Content-Type": "video/mp4"})
        with call(up) as r:
            video = json.load(r)
    vid = video["id"]
    print(f"Hochgeladen: https://youtube.com/shorts/{vid} (Status: {video['status']['privacyStatus']})")

    if a.thumb:
        with open(a.thumb, "rb") as f:
            req = urllib.request.Request(THUMB_URL.format(vid), data=f.read(), method="POST",
                                         headers={**auth, "Content-Type": "image/png"})
        try:
            urllib.request.urlopen(req).close()
            print("Thumbnail gesetzt.")
        except urllib.error.HTTPError as e:
            print(f"Thumbnail nicht gesetzt (HTTP {e.code}). Kanal per Telefon verifiziert? Für Shorts evtl. nicht unterstützt.")

    if meta.get("playlistId"):
        body = {"snippet": {"playlistId": meta["playlistId"],
                            "resourceId": {"kind": "youtube#video", "videoId": vid}}}
        req = urllib.request.Request(PLAYLIST_URL, data=json.dumps(body).encode(), method="POST",
                                     headers={**auth, "Content-Type": "application/json"})
        try:
            urllib.request.urlopen(req).close()
            print("Zur Playlist hinzugefügt.")
        except urllib.error.HTTPError as e:
            print(f"Playlist nicht gesetzt (HTTP {e.code}).")


if __name__ == "__main__":
    main()
