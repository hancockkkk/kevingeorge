"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { articles } from "@/content/writings/articles";
import { ArrowLeft } from "lucide-react";

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.articleId as string;
  
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">
            Article not found
          </h1>
          <Link
            href="/newsletter"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Back to writings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to writings
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <header className="mb-12 space-y-6">
          {/* Category & Meta */}
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 bg-foreground/5 rounded-full text-foreground/70 font-medium">
              {article.category}
            </span>
            <span className="text-foreground/40">•</span>
            <time className="text-foreground/50">
              {new Date(article.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-foreground/40">•</span>
            <span className="text-foreground/50">{article.readTime}</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl md:text-2xl text-foreground/50 font-light">
                {article.subtitle}
              </p>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          <div
            className="article-content space-y-6 text-foreground/80 leading-relaxed"
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.75",
            }}
          >
            {article.content.split("\n\n").map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-2xl font-light text-foreground mt-12 mb-6"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              // Handle bold text
              if (paragraph.includes("**")) {
                return (
                  <p key={index} className="text-foreground/80">
                    {paragraph.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="font-medium text-foreground">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              }
              // Handle italic text
              if (paragraph.startsWith("*(") && paragraph.endsWith(")*")) {
                return (
                  <p key={index} className="text-foreground/50 italic">
                    {paragraph.slice(2, -2)}
                  </p>
                );
              }
              // Regular paragraphs
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-foreground/80">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Footer / Signature */}
        <div className="mt-16 pt-8 border-t border-foreground/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground/50">
              Written by Kevin George
            </div>
            <Link
              href="/newsletter"
              className="text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              More writings →
            </Link>
          </div>
        </div>
      </article>

      {/* Email Signup Section */}
      <div className="border-t border-foreground/10 bg-foreground/[0.02]">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-20 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-light text-foreground">
            Enjoyed this?
          </h3>
          <p className="text-foreground/60 leading-relaxed">
            Subscribe to get notified when I drop new writings.
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-background border border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/30 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
