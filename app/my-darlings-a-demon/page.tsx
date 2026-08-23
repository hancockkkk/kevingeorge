import { siteContent } from "@/content/siteContent";

const albumEmbedUrl =
  "https://open.spotify.com/embed/album/1Z08UDoHKkFRdbgYV0CLSm?utm_source=generator&si=962ef30b8e944db8";

const archiveVideos = [
  {
    title: "MY DARLINGS A DEMON DOCUMENTARY",
    type: "Documentary",
    url: "https://youtu.be/l3r1sCZ2Ulc",
  },
  {
    title: "How I Made The Beat - I Better Find Your Love",
    type: "Beat Breakdown",
    url: "https://youtu.be/EmnjNDgTM84",
  },
  {
    title: "MDAD 2019 Merch Campaign",
    type: "Merch Film",
    url: "https://youtu.be/Lk5TX7JU1fs",
  },
];

const albumFacts = [
  "Only official Kevin George album",
  "Released through Island Records and Young Forever",
  "Built as music, fashion, visuals, and story",
  "The world around the album was bigger than what reached the public",
];

function getYouTubeEmbedUrl(url: string) {
  const parsed = new URL(url);
  const videoId =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function AppleMusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03c.525 0 1.048-.034 1.57-.1.823-.106 1.597-.35 2.296-.81.84-.553 1.472-1.287 1.88-2.208.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.47-2.105-1.36-.343-.955.047-2.013.95-2.547.362-.214.76-.336 1.17-.424.398-.086.8-.148 1.2-.222.21-.04.413-.098.603-.188.19-.09.287-.238.306-.452.01-.117.014-.234.014-.351V8.373c0-.3-.07-.386-.367-.434-.72-.116-1.44-.236-2.16-.35l-4.68-.762c-.09-.014-.18-.032-.27-.032-.26 0-.37.1-.396.36-.006.066-.008.134-.008.2v8.373c0 .457-.05.91-.238 1.334-.283.637-.768 1.039-1.448 1.218-.323.085-.654.136-.99.16-.9.065-1.727-.36-2.1-1.167-.418-.9-.093-1.968.748-2.567.42-.3.896-.46 1.396-.56.327-.065.66-.108.99-.168.3-.053.6-.116.883-.22.2-.073.313-.21.347-.42.016-.104.024-.21.024-.315V5.063c0-.202.03-.395.127-.578.13-.244.334-.395.6-.453.168-.037.34-.063.51-.092l6.03-.98 1.8-.295c.074-.012.15-.022.224-.027.18-.012.303.1.327.3.01.073.014.146.014.22v6.957z" />
    </svg>
  );
}

export default function MyDarlingsADemonPage() {
  const album = siteContent.myDarlingsADemon;

  return (
    <div className="min-h-screen px-4 pb-24">
      <section className="mx-auto grid w-full max-w-6xl gap-12 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/45">
              2019 Debut Album
            </p>
            <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl">
              {album.title}
            </h1>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-foreground/65">
              The only official Kevin George album: a debut released through
              Island Records and Young Forever, built to introduce the sound,
              the style, and the world around the artist.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={album.spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90"
            >
              <SpotifyIcon className="h-4 w-4" />
              Spotify
            </a>
            <a
              href={album.appleMusicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/20 px-5 text-sm font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <AppleMusicIcon className="h-4 w-4" />
              Apple
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {albumFacts.map((fact) => (
              <div
                key={fact}
                className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-4"
              >
                <p className="text-sm leading-relaxed text-foreground/65">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-5">
          <div className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                Official Album
              </p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">
                Stream MDAD
              </h2>
            </div>
            <p className="text-sm text-foreground/45">{album.year}</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-black">
            <iframe
              src={albumEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block rounded-lg"
            ></iframe>
          </div>
          <h3 className="pt-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
            Tracklist
          </h3>
          <div className="grid gap-2">
            {album.tracklist.map((track) => (
              <div
                key={track.number}
                className="grid grid-cols-[2rem_1fr] items-center gap-4 rounded-md px-2 py-2"
              >
                <span className="text-right text-sm text-foreground/35">
                  {track.number.toString().padStart(2, "0")}
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.08em] text-foreground">
                  {track.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 border-t border-foreground/10 py-12 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/45">
            The World
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            The album came out. The full world was still forming.
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-foreground/62">
          <p>
            MDAD was meant to be more than a collection of songs. The vision was
            an album tied to clothing, imagery, campaign films, production
            stories, and a visual language that could make the debut feel like
            its own universe.
          </p>
          <p>
            Some of that world reached people. Some of it stayed in folders,
            mood boards, private edits, and archived footage. This page keeps
            the official album at the center while bringing the lost rollout
            pieces back into view.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-foreground/10 pt-12">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/45">
            Archive
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            Pieces from the MDAD rollout
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {archiveVideos.map((video) => (
            <article
              key={video.title}
              className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03]"
            >
              <div className="aspect-video bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(video.url)}
                  title={`${video.title} video`}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                    {video.type}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {video.title}
                  </h3>
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55 transition-colors hover:text-foreground"
                >
                  YouTube
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
