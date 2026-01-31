# How to Add New Writings

This guide shows you how to add new articles/writings to your newsletter section.

## Quick Steps

1. Open `content/writings/articles.ts`
2. Add a new article object to the `articles` array
3. Save and the site will automatically update!

## Article Format

```typescript
{
  id: "your-article-slug",           // Used in URL: /newsletter/your-article-slug
  title: "Your Article Title",       // Main headline
  subtitle: "Optional subtitle",     // Optional subheading
  date: "2026-01-30",               // Format: YYYY-MM-DD
  category: "On Music",             // One of: "On Music", "Life", "The Industry", "Philosophy", "Behind The Scenes"
  readTime: "5 min read",           // Estimated reading time
  excerpt: "Preview text...",       // Shows on main page (1-2 sentences)
  content: `Your full article...`,  // Full article text (see formatting below)
  published: true,                  // Set to false to hide from site
}
```

## Content Formatting

Your `content` field supports simple markdown:

### Headers
```
## This is a section header
```

### Bold Text
```
**This will be bold**
```

### Italics (for notes)
```
*(This will be italicized and gray)*
```

### Regular Paragraphs
Just write normally, separate paragraphs with blank lines:
```
This is paragraph one.

This is paragraph two.
```

## Example Article

```typescript
{
  id: "finding-my-sound",
  title: "Finding My Sound",
  subtitle: "The journey to artistic identity",
  date: "2026-02-01",
  category: "On Music",
  readTime: "6 min read",
  excerpt: "It took me years to figure out what 'my sound' even meant. Here's what I learned...",
  content: `
It took me years to figure out what 'my sound' even meant.

When I first started making music, I was copying everyone. Trying to sound like The Weeknd one day, Drake the next. Nothing felt authentic.

## The Turning Point

The shift happened when I stopped asking "what's hot?" and started asking "what's honest?"

**Your sound isn't something you find. It's something you uncover by being yourself.**

When I made "High Like This", I wasn't trying to make a hit. I was just making something that felt real to me. And that's when people started connecting.

- Kevin
  `,
  published: true,
}
```

## Tips

- **Be yourself**: This is YOUR space. Write like you talk.
- **No word limits**: Go long-form. Your real fans will read it.
- **Save drafts**: Set `published: false` while you're still working on it
- **Categories help**: Use them to organize different types of content
- **Update regularly**: Even one article a month builds connection

## Publishing

1. Add your article to `articles.ts`
2. Git commit and push
3. Vercel will automatically deploy
4. Your article is live at `kevingeorge.com/newsletter/your-article-slug`

That's it! No complicated CMS, no database. Just write and publish.
