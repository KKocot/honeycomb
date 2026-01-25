"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidComponentProps {
  children: string;
}

let idCounter = 0;
function generateUniqueId() {
  return `mermaid-react-${idCounter++}`;
}

/**
 * Renders Mermaid diagrams from markdown code blocks
 */
export default function MermaidComponent({ children }: MermaidComponentProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(generateUniqueId());
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const renderMermaid = async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        suppressErrorRendering: true,
      });

      try {
        const { svg } = await mermaid.render(idRef.current, children);
        if (active) {
          setSvgContent(svg);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(String(err));
          setSvgContent(null);
          console.error("Mermaid render error:", err);
        }
      }
    };

    renderMermaid();

    return () => {
      active = false;
    };
  }, [children]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded text-wrap">
        <strong>Mermaid Error:</strong>
        {"\n"}
        {error}
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse bg-muted h-32 w-full rounded" />
      </div>
    );
  }

  return (
    <div
      ref={svgContainerRef}
      className="flex justify-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
