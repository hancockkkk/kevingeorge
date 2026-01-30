"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { siteContent } from "@/content/siteContent";
import { Instagram, Menu, X, Sun, Moon } from "lucide-react";

const navItems = [
  { label: "EPS", href: "/eps" },
  { label: "SINGLES", href: "/singles" },
  { label: "SHOP", href: "/shop" },
  { label: "NEWSLETTER", href: "/newsletter" },
  { label: "MY DARLING'S A DEMON", href: "/my-darlings-a-demon" },
  { label: "EVERYBODY'S IN MY EAR", href: "/everybodys-in-my-ear" },
];

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full py-6 px-4 md:px-8 relative z-50 bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm">
      {/* Social Icons + Theme Toggle */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <a
          href={siteContent.socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5" />
        </a>
        <a
          href={siteContent.socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="X (Twitter)"
        >
          <TwitterIcon className="w-5 h-5" />
        </a>
        <a
          href={siteContent.socialLinks.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="TikTok"
        >
          <TikTokIcon className="w-5 h-5" />
        </a>
        <a
          href={siteContent.socialLinks.appleMusic}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="Apple Music"
        >
          <AppleMusicIcon className="w-5 h-5" />
        </a>
        <a
          href={siteContent.socialLinks.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="Spotify"
        >
          <SpotifyIcon className="w-5 h-5" />
        </a>
        <a
          href={siteContent.socialLinks.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="YouTube"
        >
          <YouTubeIcon className="w-5 h-5" />
        </a>
        
        {/* Theme Toggle */}
        <div className="w-px h-5 bg-foreground/20 mx-2" />
        {mounted && (
          <button
            onClick={toggleTheme}
            className="text-foreground hover:opacity-70 transition-all p-1.5 rounded-full hover:bg-foreground/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex justify-center gap-8 lg:gap-12">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium tracking-wide text-foreground hover:opacity-70 transition-opacity"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-4 text-foreground p-2"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium tracking-wide text-foreground hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
