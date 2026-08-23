"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

type SignupStatus = "idle" | "submitting" | "success" | "error";

export default function HomePage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, email }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Could not join the list.");
      }

      setStatus("success");
      setMessage(result.message);
      setPhone("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 pb-16 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-150px)] w-full max-w-[820px] flex-col justify-center py-12 md:py-20">
        <div className="space-y-8 md:space-y-10">
          <div className="space-y-5">
            <h1 className="text-[3.1rem] font-black uppercase leading-[0.95] tracking-[0.01em] sm:text-7xl md:text-8xl">
              KevinWrites
            </h1>
            <p className="max-w-[600px] text-2xl font-black leading-snug sm:text-3xl">
              Be first to know when Kevin drops music, merch, writing, and live
              moments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block space-y-3">
              <span className="text-3xl font-normal tracking-[0.04em]">
                Phone Number:
              </span>
              <div className="flex h-16 items-center rounded-lg border-2 border-foreground/45 bg-background px-5">
                <span className="mr-4 flex items-center gap-2 border-r border-foreground/20 pr-4 text-lg">
                  <span aria-hidden="true">US</span>
                  <span>+1</span>
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="201-555-0123"
                  autoComplete="tel-national"
                  required
                  className="h-full min-w-0 flex-1 bg-transparent text-2xl tracking-[0.08em] text-foreground outline-none placeholder:text-foreground/28"
                />
              </div>
            </label>

            <label className="block space-y-3">
              <span className="text-3xl font-normal tracking-[0.04em]">
                E-Mail:
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                className="h-16 w-full rounded-lg border-2 border-foreground/45 bg-background px-5 text-2xl tracking-[0.04em] text-foreground outline-none placeholder:text-foreground/28"
              />
            </label>

            <p className="text-xl leading-relaxed tracking-[0.04em] text-foreground/80">
              By joining KevinWrites, I agree to receive email and text updates
              from Kevin George about releases, merch, shows, and related news.
              Message frequency may vary. Message and data rates may apply.
            </p>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex h-16 w-full items-center justify-center rounded-lg bg-foreground px-6 text-2xl font-normal uppercase tracking-[0.08em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "submitting" ? "Joining..." : "Join KevinWrites"}
            </button>

            {message && (
              <div
                className={`rounded-lg border-2 px-4 py-3 text-base leading-relaxed ${
                  status === "error"
                    ? "border-red-700 bg-red-50 text-red-800"
                    : "border-foreground/20 bg-foreground/5 text-foreground"
                }`}
                role={status === "error" ? "alert" : "status"}
              >
                {status === "success" && (
                  <Check className="mr-2 inline h-5 w-5 align-[-4px]" />
                )}
                {message}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
