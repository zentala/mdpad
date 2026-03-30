# Orchestrator — E004: comrak Extension Support

## Wave 1 (parallel — independent, no shared file touches)
- [ ] T01 — Header IDs + Anchor Links (`rehype-slug`, heading hover `#`)
- [ ] T02 — Math Rendering (`remark-math` + `rehype-katex`, inline + block)
- [ ] T03 — Emoji Shortcodes (`remark-gemoji`, `:name:` → Unicode)
- [ ] T04 — Highlight / Mark (custom plugin, `==text==` → `<mark>`)

## Wave 2 (parallel — depends on Wave 1 remark pipeline being stable)
- [ ] T05 — Footnotes (block `[^1]` + inline `^[text]`, footer section)
- [ ] T06 — Superscript & Subscript (`^sup^` / `~sub~`, conflict resolution)
- [ ] T07 — Wiki-links (custom plugin, `[[page]]` / `[[label|page]]`, tooltip)
- [ ] T08 — Insert + Multiline Blockquotes + Description Lists + Spoiler

## Wave 3 (sequential — content, depends on Wave 2 for live examples)
- [ ] T09 — Welcome.md Extension Showcase (content only, no code)

## Merge Order
Wave 1 (T01–T04 parallel) → Wave 2 (T05–T08 parallel) → Wave 3 (T09)

## Task Dependencies
```
T01 → T05 (footnotes need slug for back-links)
T02 (independent)
T03 (independent)
T04 (independent)
T06 (independent — but must verify against T05 footnotes plugin)
T07 (independent)
T08 (independent — bundles 4 small extensions)
All → T09 (Welcome.md needs all features working)
```

## Notes
- T08 bundles 4 small extensions (insert, multiline blockquotes, description lists,
  spoiler) into one task because each is <30 lines of custom plugin code.
- T07 (wiki-links) renders as decorative links in prototype only. Full resolution
  against the file system requires the Tauri backend (tracked in BACKLOG.md).
- comrak Rust configuration is documented per-task; backend task will consolidate
  into a single `ExtensionOptions` builder in a future epic.
