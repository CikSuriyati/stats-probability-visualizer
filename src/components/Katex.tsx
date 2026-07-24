import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

import { cn } from "@/lib/utils";

interface KatexProps {
  /** LaTeX source (without delimiters). */
  math: string;
  display?: boolean;
  className?: string;
}

/** Renders a LaTeX string to HTML via KaTeX (replaces the old CDN auto-render). */
export function Katex({ math, display = false, className }: KatexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, display]);

  return (
    <span
      className={cn(display && "block overflow-x-auto", className)}
      // KaTeX output is generated from our own trusted LaTeX strings.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Renders a mixed string that may contain inline `$...$` math segments,
 * used by the interpretation / shaded-area explanation text.
 */
export function RichMath({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.math ? <Katex key={i} math={part.value} /> : <span key={i}>{part.value}</span>,
      )}
    </span>
  );
}

function splitMath(text: string): { value: string; math: boolean }[] {
  const segments: { value: string; math: boolean }[] = [];
  const regex = /\$([^$]+)\$/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) segments.push({ value: text.slice(last, match.index), math: false });
    segments.push({ value: match[1], math: true });
    last = regex.lastIndex;
  }
  if (last < text.length) segments.push({ value: text.slice(last), math: false });
  return segments;
}
