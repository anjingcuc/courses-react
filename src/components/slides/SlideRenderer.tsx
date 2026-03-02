'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';

interface SlideRendererProps {
  content: string;
  course?: string;
  chapter?: string;
}

// Get basePath from runtime config
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    // In browser, check if we're on GitHub Pages
    if (window.location.pathname.startsWith('/courses-react')) {
      return '/courses-react';
    }
  }
  return '';
};

export function SlideRenderer({ content, course, chapter }: SlideRendererProps) {
  const processed = processContent(content);
  const basePath = getBasePath();

  // Helper to resolve relative URLs
  const resolveUrl = (src: string | undefined): string | undefined => {
    if (!src || typeof src !== 'string') return src;

    // Absolute URL - just add basePath if needed
    if (src.startsWith('/img/')) {
      return basePath ? `${basePath}${src}` : src;
    }
    if (src.startsWith('/')) {
      return basePath ? `${basePath}${src}` : src;
    }

    // Relative URL - prepend course/chapter path
    if (course && chapter && !src.startsWith('http')) {
      const resourcePath = `/courses/${course}/${chapter}/${src}`;
      return basePath ? `${basePath}${resourcePath}` : resourcePath;
    }

    return src;
  };

  return (
    <div className="slide-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className?.includes('block');

            if (isInline) {
              return <code {...props}>{children}</code>;
            }

            return (
              <CodeBlock
                language={match ? match[1] : 'text'}
                code={String(children).replace(/\n$/, '')}
              />
            );
          },
          img({ src, alt, ...props }) {
            const imageSrc = resolveUrl(src);
            return (
              <img
                src={imageSrc}
                alt={alt || ''}
                loading="lazy"
                {...props}
              />
            );
          },
          video({ src, ...props }) {
            const videoSrc = resolveUrl(src);
            return (
              <video
                src={videoSrc}
                controls
                {...props}
              />
            );
          },
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

function processContent(content: string): string {
  return content.replace(/\{:style="[^"]+"\}/g, '');
}
