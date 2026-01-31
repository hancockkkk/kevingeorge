"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-12">
        {/* Breathing Circle */}
        <div className="flex justify-center">
          <div 
            className={`w-3 h-3 rounded-full bg-foreground transition-all duration-1000 ${
              mounted ? 'animate-pulse' : ''
            }`}
            style={{
              animation: 'breathe 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Artist Name */}
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-foreground/80 uppercase">
          Kevin George
        </h1>

        {/* Cryptic Message */}
        <p className="text-sm md:text-base text-foreground/40 font-light tracking-widest">
          SOMETHING'S COMING
        </p>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
