// src/components/web_components/MarkdownArticle.tsx
import { Marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'isomorphic-dompurify';

// Import a highlight.js theme in this component or in your root layout/globals.css
import 'highlight.js/styles/github-dark.css';

export function markdownToHtml(markdown: string): string {
  const markedInstance = new Marked(
    gfmHeadingId(),
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const rawHtml = markedInstance.parse(markdown, {
    async: false,
    gfm: true,
  }) as string;

  // Sanitize HTML while explicitly preserving heading `id`s and highlight.js `class` attributes
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['id', 'class'],
  });
}

interface MarkdownArticleProps {
  content: string;
  className?: string;
}

export function MarkdownArticle({ content, className = '' }: MarkdownArticleProps) {
  const safeHtml = markdownToHtml(content);

  return (
    <article
      className={`prose prose-invert max-w-none ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}