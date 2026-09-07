"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, ChevronDown } from "lucide-react";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "MUSIC", href: "/music" },
  { label: "VIDEOS", href: "/videos" },
  { label: "SHOP", href: "/shop" },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="relative z-50 min-h-20 w-full px-4 py-6 md:px-8">
      {/* Dropdown Navigation Button - Top Left */}
      <div className="absolute top-6 left-4 md:left-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10"
            aria-label="Navigation menu"
          >
            <Menu className="w-4 h-4 text-foreground/70" />
            <ChevronDown className={`w-4 h-4 text-foreground/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className="block px-4 py-3 text-sm font-medium tracking-wide text-foreground hover:bg-foreground/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {mounted && (
        <button
          onClick={toggleTheme}
          className="absolute right-4 top-6 rounded-full p-1.5 text-foreground transition-all hover:bg-foreground/10 hover:opacity-70 md:right-8"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      )}

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

    </header>
  );
}
