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

function getYouTubeEmbedUrl(url: string) {
  const parsed = new URL(url);
  const videoId =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.replace("/", "")
      : parsed.searchParams.get("v");

  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export default function VideosPage() {
  return (
    <div className="min-h-screen px-4 pb-24">
      <section className="mx-auto w-full max-w-6xl py-12 md:py-16">
        <h1 className="text-center text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          VIDEOS
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
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
                  <h2 className="text-lg font-semibold text-foreground">
                    {video.title}
                  </h2>
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
