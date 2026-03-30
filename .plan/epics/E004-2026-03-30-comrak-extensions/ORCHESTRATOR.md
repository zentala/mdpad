# Orchestrator — E004: comrak Extension Support

## Wave 1 (parallel — independent, no shared file touches)
- [x] T01 — Header IDs + Anchor Links (`rehype-slug`, heading hover `#`)
- [x] T02 — Math Rendering (`remark-math` + `rehype-katex`, inline + block)
- [x] T03 — Emoji Shortcodes (`remark-gemoji`, `:name:` → Unicode)
- [x] T04 — Highlight / Mark (custom plugin, `==text==` → `<mark>`)

## Wave 2 (parallel — depends on Wave 1 remark pipeline being stable)
- [x] T05 — Footnotes (block `[^1]` + inline `^[text]`, footer section)
- [x] T06 — Superscript & Subscript (`^sup^` / `~sub~`, conflict resolution)
- [x] T07 — Wiki-links (custom plugin, `[[page]]` / `[[label|page]]`, tooltip)
- [x] T08 — Insert + Multiline Blockquotes + Description Lists + Spoiler

## Wave 3 (sequential — content, depends on Wave 2 for live examples)
- [x] T09 — Welcome.md Extension Showcase (content only, no code)

## Merge Order
Wave 1 (T01–T04 parallel) → Wave 2 (T05–T08 parallel) → Wave 3 (T09)

## Status: 9/9 done. Epic complete.
