const playlistEmbedUrl =
  "https://open.spotify.com/embed/playlist/7r5R1HDzORkJbNe9DLbk0t?utm_source=generator";
const playlistUrl =
  "https://open.spotify.com/playlist/7r5R1HDzORkJbNe9DLbk0t?si=a378550fd36d4e97";

const videos = [
  {
    title: "THE WAVE",
    date: "March 2, 2022",
    url: "https://youtu.be/W_fKMb9SXJ8?si=nRp0pCdm8Ygxtw5F",
  },
  {
    title: "THE NUMBER 2",
    date: "March 17, 2022",
    url: "https://youtu.be/FzxaQXrAWWc",
  },
  {
    title: "AIN'T BEEN THE SAME",
    date: "March 31, 2022",
    url: "https://youtu.be/HUnlpXlVpNA",
  },
  {
    title: "WE UP",
    date: "April 14, 2022",
    url: "https://youtu.be/p0VwdfXTZ8E",
  },
  {
    title: "WHAT IT TAKES",
    date: "April 28, 2022",
    url: "https://youtu.be/_sfBmNsKVS4",
  },
  {
    title: "LOST MY MIND",
    date: "May 12, 2022",
    url: "https://youtu.be/LCyqyxs6xEw",
  },
  {
    title: "HICCUP",
    date: "May 26, 2022",
    url: "https://youtu.be/75inFU3Xe8c",
  },
  {
    title: "SOME NIGHTS",
    date: "June 24, 2022",
    url: "https://youtu.be/q1OjHoTrjJA",
  },
  {
    title: "ANGEL NUMBERS",
    date: "July 7, 2022",
    url: "https://youtu.be/qv6zHD77lcQ",
  },
  {
    title: "CASH IN THE CLUB",
    date: "July 21, 2022",
    url: "https://youtu.be/Omc4iXpG_v4",
  },
  {
    title: "BIG MAN",
    date: "August 4, 2022",
    url: "https://youtu.be/3KMBSj3uLIA",
  },
  {
    title: "SUPER ROMANTIC",
    date: "August 18, 2022",
    url: "https://youtu.be/uyszr3JoTTE",
  },
  {
    title: "THAT'S MY WOMAN",
    date: "September 1, 2022",
    url: "https://youtu.be/UzuVZPPPpC8",
  },
  {
    title: "THE WAY IT GOES",
    date: "September 15, 2022",
    url: "https://youtu.be/Mwba6dZm1gw",
  },
  {
    title: "IN WITH ME",
    date: "September 29, 2022",
    url: "https://youtu.be/9J1nUkvID58",
  },
  {
    title: "STAY WITH ME",
    date: "October 18, 2022",
    url: "https://youtu.be/IFNiqmRNsKg",
  },
];

const intendedRollout = [
  "24 songs released every two weeks",
  "24 visuals built to let people see the artist as much as hear the music",
  "3 EP batches created for the commercial release structure",
  "8 remaining songs released independently after the final option was not renewed",
];

function getYouTubeEmbedUrl(url: string) {
  const parsed = new URL(url);
  const videoId =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export default function GloryRoadPage() {
  return (
    <div className="min-h-screen px-4 pb-24">
      <section className="mx-auto grid w-full max-w-6xl gap-12 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-20">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/45">
              2022 Playlist Era
            </p>
            <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-7xl">
              Glory Road
            </h1>
            <p className="max-w-2xl text-xl font-light leading-relaxed text-foreground/65">
              Glory Road was not built as an album or an EP. It was meant to be
              a 24-song playlist era, a release every two weeks with a visual
              attached, designed to let people see Kevin, feel the world, and
              become fans one moment at a time.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {intendedRollout.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-4"
              >
                <p className="text-sm leading-relaxed text-foreground/65">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-l border-foreground/20 pl-5">
            <h2 className="text-2xl font-semibold text-foreground">
              What happened
            </h2>
            <p className="text-base leading-relaxed text-foreground/62">
              The original vision was always bigger than the format it had to
              live inside. For the commercial release, the music was split into
              three EP batches, with an option to renew after each one. By the
              third batch, the release strategy no longer lined up with the
              business side of the deal, so the final option was not renewed.
              The remaining eight songs came out independently, without the same
              budget and infrastructure around the original rollout.
            </p>
            <p className="text-base leading-relaxed text-foreground/62">
              This page keeps the era intact: the playlist, the visuals that
              exist, and the story behind why this release system still matters.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3">
            <iframe
              src={playlistEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90"
          >
            Open Playlist
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-foreground/10 pt-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/45">
              Visual Archive
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
              Videos from the rollout
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((video) => (
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
                  <h3 className="text-lg font-semibold text-foreground">
                    {video.title}
                  </h3>
                  <p className="text-sm text-foreground/45">{video.date}</p>
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
