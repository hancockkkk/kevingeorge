import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const releases = JSON.parse(await readFile(new URL('../app/releases.json', import.meta.url), 'utf8'));
assert(releases.length > 0, 'At least one released song is required.');
const ids = new Set();
const albums = new Set();
let previousDate = '9999-12-31';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

for (const release of releases) {
  assert(release.id && !ids.has(release.id), `Duplicate or missing release id: ${release.id}`);
  ids.add(release.id);
  assert(release.title?.trim() && !/&#?\w+;/.test(release.title), 'Use a plain-text title, not HTML entities.');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(release.releaseDate), `Missing release date: ${release.title}`);
  assert(new Date(`${release.releaseDate}T12:00:00Z`).toISOString().startsWith(release.releaseDate), 'Invalid release date.');
  assert(release.releaseDate <= today, `Cannot publish a future release: ${release.title}`);
  assert(release.releaseDate <= previousDate, 'Keep releases in newest-first order.');
  previousDate = release.releaseDate;
  assert.equal(release.year, release.releaseDate.slice(0, 4));
  assert(/^https:\/\/open\.spotify\.com\/album\/[A-Za-z0-9]{22}$/.test(release.spotifyLink), 'Use a canonical Spotify album URL.');
  assert(!albums.has(release.spotifyLink), 'Duplicate Spotify album.');
  albums.add(release.spotifyLink);
  assert(/^https:\/\/music\.apple\.com\/us\/album\/[^/]+\/\d+$/.test(release.appleMusicLink), 'Use the verified Apple Music album URL.');
  assert(Array.isArray(release.tracklist) && release.tracklist.every(track => typeof track === 'string'), 'Invalid tracklist.');
  if (release.coverImage.startsWith('/media/')) {
    assert(!release.coverImage.includes('..'), 'Invalid local artwork path.');
    await access(new URL(`../public${release.coverImage}`, import.meta.url));
  } else {
    const artwork = new URL(release.coverImage);
    assert(artwork.protocol === 'https:' && ['i.scdn.co', 'is1-ssl.mzstatic.com'].includes(artwork.hostname), 'Use verified official artwork.');
  }
  if (release.allPlatformsLink) assert(new URL(release.allPlatformsLink).protocol === 'https:', 'Use an HTTPS smartlink.');
}
console.log(`Validated ${releases.length} releases; featured: ${releases[0].title}.`);
