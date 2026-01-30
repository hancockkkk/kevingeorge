"use client";

import { useState } from "react";
import { siteContent } from "@/content/siteContent";
import type { EP } from "@/content/siteContent";
import { X } from "lucide-react";

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

// Helper function to extract Spotify ID from URL
function getSpotifyEmbedUrl(spotifyUrl: string): string {
  const albumMatch = spotifyUrl.match(/album\/([a-zA-Z0-9]+)/);
  if (albumMatch) {
    return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
  }
  return "";
}

export default function EPsPage() {
  const [selectedEP, setSelectedEP] = useState<EP | null>(null);

  return (
    <div className="flex flex-col items-center px-4 pb-20">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-8 text-center text-foreground">
        EPS
      </h1>

      {/* EPs Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl w-full">
        {siteContent.eps.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setSelectedEP(ep)}
            className="group text-left"
          >
            <div className="aspect-square rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl relative">
              <img
                src={ep.coverImage || "/placeholder.svg"}
                alt={`${ep.title} EP Cover`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6">
                <span className="text-white/70 text-sm mb-1">{ep.year}</span>
                <h3 className="text-2xl font-bold text-white text-center">{ep.title}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* EP Detail Modal */}
      {selectedEP && (
        <div className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEP(null)}
              className="absolute top-4 right-4 z-10 text-foreground hover:opacity-70 transition-opacity bg-background/80 backdrop-blur-sm rounded-full p-1"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden mb-4">
              <img
                src={selectedEP.coverImage || "/placeholder.svg"}
                alt={`${selectedEP.title} EP Cover`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{selectedEP.title}</h2>

            <p className="text-muted-foreground text-sm mb-4">{selectedEP.year}</p>

            {/* Spotify Embed Player */}
            {selectedEP.spotifyLink && (
              <div className="mb-6">
                <iframe
                  src={getSpotifyEmbedUrl(selectedEP.spotifyLink)}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </div>
            )}

            <div className="flex gap-2">
              <a
                href={selectedEP.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#1DB954] text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <SpotifyIcon className="w-4 h-4" />
                Spotify
              </a>
              <a
                href={selectedEP.appleMusicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-foreground text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <AppleMusicIcon className="w-4 h-4" />
                Apple
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
