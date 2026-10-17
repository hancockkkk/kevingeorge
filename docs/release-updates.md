# Release updates

The homepage reads `app/releases.json` in newest-first order. The first entry is
featured; the others appear before the older album catalog. Keep every previous
entry. Apologies retains its native full-song player and download in the music
collection. Other releases use the existing Spotify dialog and streaming links.

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
