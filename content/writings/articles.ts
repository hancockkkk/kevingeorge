export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  category: "On Music" | "Life" | "The Industry" | "Philosophy" | "Behind The Scenes";
  readTime: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export const articles: Article[] = [
  {
    id: "why-i-make-music",
    title: "Why I Make Music",
    subtitle: "It's not what you think",
    date: "2026-01-30",
    category: "On Music",
    readTime: "5 min read",
    excerpt: "People always ask me why I do this. Why I keep making music when the industry is what it is. The truth might surprise you...",
    content: `
People always ask me why I do this. Why I keep making music when the industry is what it is. When the streams don't pay. When the algorithm doesn't care. When the "right people" aren't listening.

The truth is, I don't make music for any of that.

I make music because I have to. Because there are feelings inside me that only come out through melody. Thoughts that only make sense as lyrics. Stories that need to be told in 3-minute increments.

## The Real Reason

It's therapeutic. It's necessary. It's the only way I know how to process this weird, beautiful, painful, confusing life we're all living.

When I'm in the studio at 3am, nobody's watching. Nobody's streaming. It's just me and the music. That's when it's purest. That's when it matters most.

Everything else - the releases, the marketing, the socials - that's just sharing what already had to come out. The music exists whether anyone hears it or not.

But when you do hear it? When it connects? When someone tells me a song helped them through something? That's magic. That's why I share it.

**So yeah, I make music because I have to. But I share it for you.**

- Kevin
    `,
    published: true,
  },
  {
    id: "the-label-years",
    title: "The Label Years",
    subtitle: "What they don't tell you",
    date: "2026-01-28",
    category: "The Industry",
    readTime: "8 min read",
    excerpt: "I was signed to Island Records. Living the dream, right? Here's what actually happened...",
    content: `
In 2018, I signed to Island Records. 

I was 21. I thought I'd made it.

Here's what they don't tell you about getting signed...

## The Dream vs Reality

Everyone thinks signing to a label means you've "made it." But here's the truth: you've just traded independence for infrastructure.

*(Article content continues...)*

More coming soon as I process these experiences and share them with you all.

- Kevin
    `,
    published: true,
  },
  // Add more articles as you write them
];

export const categories = [
  "All",
  "On Music",
  "Life", 
  "The Industry",
  "Philosophy",
  "Behind The Scenes"
] as const;
