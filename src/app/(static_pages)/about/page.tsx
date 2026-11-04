// src/app/blog/page.tsx
import { notFound } from 'next/navigation';
import { MarkdownArticle } from '@/components/web_components/MarkdownArticle';

export default async function BlogPage() {
  // Equivalent to getStaticProps with ISR revalidation every hour
  const res = await fetch(
    'https://areebuzair.github.io/areebuzair/README.md',
    {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    notFound();
  }

  const markdown = await res.text();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <MarkdownArticle content={markdown} />
    </main>
  );
}