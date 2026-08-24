"use client";

import { FormEvent, useRef, useState } from "react";
import { Check, Pause, Play, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type SignupStatus = "idle" | "submitting" | "success" | "error";

const transmission = {
  title: "Apologies",
  audio: "/audio/apologies.mp3",
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function LivingTransmission() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(161);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [message, setMessage] = useState("");

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  }

  function handleSeek(value: number) {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Could not join the list.");
      }

      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section
      className="min-h-[calc(100svh-5rem)] bg-background text-foreground"
      aria-label="Kevin George homepage"
    >
      <div className="relative mx-auto min-h-[calc(100svh-5rem)] w-full max-w-[1600px]">
        <div className="absolute inset-0 flex items-center justify-center px-5 pb-24 sm:px-8 sm:pb-0">
          <div className="flex w-full max-w-md flex-col items-center">
            <button
              type="button"
              onClick={togglePlayback}
              className="flex size-16 shrink-0 items-center justify-center rounded-full border border-foreground bg-foreground text-background transition-transform hover:scale-105"
              aria-label={
                isPlaying
                  ? `Pause ${transmission.title}`
                  : `Play ${transmission.title}`
              }
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="size-6 fill-current" />
              ) : (
                <Play className="ml-0.5 size-6 fill-current" />
              )}
            </button>

            <div className="mt-5 w-full min-w-0">
              <div className="mb-2 flex items-center justify-between gap-4 text-xs font-medium tabular-nums sm:text-sm">
                <span>{isPlaying ? "On Air" : "Ready"}</span>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer accent-current"
                aria-label="Song position"
              />
            </div>
          </div>
        </div>

        <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="group absolute bottom-6 left-5 right-5 flex h-12 items-center justify-between border border-foreground/50 bg-background px-4 text-sm font-semibold uppercase transition-colors hover:bg-foreground hover:text-background sm:bottom-8 sm:left-auto sm:right-8 sm:w-56 lg:bottom-10 lg:right-12"
              >
                Stay Connected
                <Plus className="size-4 transition-transform group-hover:rotate-90" />
              </button>
            </SheetTrigger>

            <SheetContent className="w-full max-w-none gap-0 border-foreground/20 p-0 sm:max-w-[440px]">
              <SheetHeader className="border-b border-foreground/15 px-6 py-8 pr-14 text-left sm:px-8 sm:py-10">
                <p className="text-xs font-medium uppercase">
                  Direct from Kevin
                </p>
                <SheetTitle className="text-4xl font-black uppercase leading-none sm:text-5xl">
                  Stay Connected
                </SheetTitle>
                <SheetDescription className="pt-3 text-base leading-relaxed text-foreground/65">
                  Music, releases, shows, and whatever comes next.
                </SheetDescription>
              </SheetHeader>

              <form
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col px-6 py-8 sm:px-8"
              >
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium uppercase">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                      className="h-14 w-full border border-foreground/35 bg-transparent px-4 text-base outline-none placeholder:text-foreground/35 focus:border-foreground"
                    />
                  </label>
                </div>

                <p className="mt-7 text-xs leading-relaxed text-foreground/55">
                  By joining, I agree to receive email updates from Kevin
                  George about releases, merch, shows, and related news. I can
                  unsubscribe at any time.
                </p>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-7 h-14 w-full bg-foreground px-5 text-sm font-semibold uppercase text-background transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50"
                >
                  {status === "submitting" ? "Joining..." : "Join the List"}
                </button>

                {message && (
                  <div
                    className={`mt-5 border px-4 py-3 text-sm leading-relaxed ${
                      status === "error"
                        ? "border-red-600 text-red-600"
                        : "border-foreground/25 text-foreground"
                    }`}
                    role={status === "error" ? "alert" : "status"}
                  >
                    {status === "success" && (
                      <Check className="mr-2 inline size-4 align-[-3px]" />
                    )}
                    {message}
                  </div>
                )}
              </form>
            </SheetContent>
        </Sheet>
      </div>

      <audio
        ref={audioRef}
        src={transmission.audio}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
    </section>
  );
}
