# Release updates

The homepage reads `app/releases.json` in newest-first order. The first entry is
featured; the others appear before the older album catalog. Keep every previous
entry. Releases with an `audio` object use the native full-song player and
download; other releases use the Spotify dialog and streaming links. One shared
audio element prevents two songs from playing together. Download buttons share
the existing 30-second courtesy cooldown.

## Official sources

- Spotify artist: https://open.spotify.com/artist/0UFKnbRkop5zKvIHhbnMCI
- Apple Music artist: https://music.apple.com/us/artist/kevin-george/1325859703
- Website: https://www.kevingeorge.xyz
- Repository: https://github.com/hancockkkk/kevingeorge

Find the newest release on these exact artist profiles. Open its album page and
verify artist, title, release date, artwork, and platform links. Do not match on
artist name alone, guess IDs or smartlinks, or publish a preorder before release.
Use the official capitalization and plain apostrophes, not HTML entities.
If a newer confirmed release is already present, do not duplicate or downgrade it.

Add a new entry following the existing schema. `allPlatformsLink` can be empty
when no official smartlink is available. Public official artwork URLs are
supported; retain an original asset supplied by the artist when available.
Streaming embeds do not provide an unrestricted full-song audio file. Do not
extract audio from streaming services. Only enable native playback or downloads
when the artist supplies the file and authorizes that use.

For supplied audio, create a 320 kbps MP3 at 44.1 kHz, preserving the original
file. Put the web copy in `public/media/` and add `audio.src`,
`audio.downloadName`, and the measured `audio.duration` in seconds to the release
entry. The same controls work when that release moves into the older collection.
Check switching between songs, seeking, playback, and actual file downloads.
Vercel's enabled "Protect song audio from rapid requests" rule covers both
`/media/apologies.mp3` and `/media/whered-she-go.mp3` at 60 requests per IP per
60 seconds. Include new authorized audio paths without removing existing paths
or changing the request limit.

## Validate and publish

1. Inspect local changes and fetch the current `main` branch; preserve user work.
2. Run `node scripts/validate-releases.mjs`, `node node_modules/typescript/bin/tsc
   --noEmit`, and `npm run build` using the installed Node runtime.
3. Check the homepage and Listen dialog in a browser, including phone width.
   Verify the official cover loads, platform URLs match, previous releases remain
   available, and email signup stays optional. Do not submit a real signup for a
   release-only check.
4. Publish the checked release files to `main`; Vercel deploys automatically.
   With the connected GitHub tools, use the observed parent SHA as a lease when
   updating the branch. Never publish local notes or credentials.
5. Confirm Vercel success and inspect the live page. Report a deployment as live
   only after confirmation. Capture a screenshot of the result.

The release cadence is every other Friday, anchored to October 16, 2026. The next
expected dates are October 30 and November 13. A missing release is not a reason
to invent one or change the current feature. Scheduled checks are managed by the
Codex app; keep the computer on and app running for this local workspace task.
Release website updates do not authorize email broadcasts or welcome-flow edits.
