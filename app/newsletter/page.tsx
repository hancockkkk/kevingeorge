"use client";

import React, { useState } from "react";
import Link from "next/link";
import { articles, categories } from "@/content/writings/articles";

export default function NewsletterPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredArticles = articles.filter(
    (article) =>
      article.published &&
      (selectedCategory === "All" || article.category === selectedCategory)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
            KEVIN WRITES
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 font-light max-w-2xl mx-auto leading-relaxed">
            An intimate look into my world.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mt-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-foreground text-background"
                  : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/40 text-lg">
              No writings yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/newsletter/${article.id}`}
                className="group"
              >
                <article className="border-b border-foreground/10 pb-8 md:pb-12">
                  <div className="space-y-3">
                    {/* Category & Date */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-foreground/50 font-medium">
                        {article.category}
                      </span>
                      <span className="text-foreground/30">•</span>
                      <time className="text-foreground/50">
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <span className="text-foreground/30">•</span>
                      <span className="text-foreground/50">{article.readTime}</span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h2 className="text-2xl md:text-3xl font-light text-foreground group-hover:text-foreground/70 transition-colors">
                        {article.title}
                      </h2>
                      {article.subtitle && (
                        <p className="text-lg text-foreground/50 mt-1 font-light">
                          {article.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Excerpt */}
                    <p className="text-foreground/60 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Read More */}
                    <div className="pt-2">
                      <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Email Signup Section */}
      <div className="border-t border-foreground/10">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-light text-foreground">
              Join the Inner Circle
            </h3>
            <p className="text-foreground/60 leading-relaxed">
              Get notified when I drop new writings. No spam, just thoughts.
            </p>

            {isSubmitted ? (
              <div className="py-8">
                <p className="text-lg text-foreground/80">
                  ✓ You're in. Welcome to the inner circle.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
                  >
                    {isLoading ? "..." : "Subscribe"}
                  </button>
                </div>
                <p className="text-xs text-foreground/40 mt-3">
                  Unsubscribe anytime. I respect your inbox.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
