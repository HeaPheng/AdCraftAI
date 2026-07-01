"use client"

import * as React from "react"

interface MarkdownRendererProps {
  content: string
}

/** Lightweight secure client-side Markdown rendering */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  // Split content by line breaks
  const lines = content.split("\n")

  return (
    <div className="space-y-1.5 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-2" />
        }

        // Check for bullet lists
        let isBullet = false
        let parsedLine = line
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          isBullet = true
          parsedLine = line.trim().replace(/^[-*]\s+/, "")
        }

        // Parse **bold** and *italic*
        const parts = []
        let lastIndex = 0
        const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g
        let match

        while ((match = regex.exec(parsedLine)) !== null) {
          const matchIndex = match.index

          if (matchIndex > lastIndex) {
            parts.push(parsedLine.substring(lastIndex, matchIndex))
          }

          if (match[2]) {
            parts.push(
              <strong key={matchIndex} className="font-semibold text-foreground">
                {match[2]}
              </strong>
            )
          } else if (match[4]) {
            parts.push(
              <em key={matchIndex} className="italic text-foreground/95">
                {match[4]}
              </em>
            )
          }

          lastIndex = regex.lastIndex
        }

        if (lastIndex < parsedLine.length) {
          parts.push(parsedLine.substring(lastIndex))
        }

        const renderedContent = parts.length > 0 ? parts : parsedLine

        if (isBullet) {
          return (
            <ul key={lineIdx} className="list-disc pl-5 my-1">
              <li className="text-sm">{renderedContent}</li>
            </ul>
          )
        }

        return <p key={lineIdx}>{renderedContent}</p>
      })}
    </div>
  )
}
export default MarkdownRenderer
