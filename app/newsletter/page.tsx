"use client";

import React from "react"

import { useState } from "react";

export default function NewsletterPage() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {"YOU'RE IN"}
          </h2>
          <p className="text-muted-foreground">
            {"Welcome to Kevin's world. You'll be the first to know about new music, merch drops, and exclusive content."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[60vh]">
      <div className="w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Get notified about exclusive
          <br />
          content, merch, and event drops
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number:
            </label>
            <div className="flex border border-border rounded-lg overflow-hidden bg-input">
              <div className="flex items-center px-3 bg-secondary border-r border-border">
                <span className="text-sm">US</span>
              </div>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="201-555-0123"
                className="flex-1 px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              E-Mail:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            By submitting my information, I agree to receive recurrent messages to the contact
            information provided and to the{" "}
            <a href="#" className="underline hover:text-foreground">
              terms & conditions
            </a>
            ,{" "}
            <a href="#" className="underline hover:text-foreground">
              privacy policy
            </a>
            , and{" "}
            <a href="#" className="underline hover:text-foreground">
              cookie policy
            </a>
            .
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "JOINING..." : "JOIN KEVIN'S WORLD"}
          </button>
        </form>
      </div>
    </div>
  );
}
