# comrak Extensions Showcase — Welcome.md Content Spec

**Date**: 2026-03-30
**Epic**: [E004](../epics/E004-2026-03-30-comrak-extensions/PLAN.md)
**Purpose**: Content spec for the "Markdown Extensions" section of Welcome.md.
Each block below is ready to paste into Welcome.md verbatim once the corresponding
rendering task is implemented.

---

## Section to Add to Welcome.md

The section goes after the existing GFM showcase (tables, task lists, code blocks)
and before the Mermaid section.

---

```markdown
## Markdown Extensions

mdpad renders all comrak extensions beyond standard GFM.
Each section below demonstrates live rendering.

---

### Header Anchors

Every heading in mdpad gets a stable anchor link.
Hover any heading to reveal the `#` link. Click it to copy the URL.

```md
## My Section
### Sub-section
```

> Headings H1–H6 all get slugged IDs. Deep-linking into long specs works out of the box.

---

### Math (KaTeX)

Inline and block LaTeX math via KaTeX.

**Inline math** — wrap with single dollar signs:

Einstein's famous equation: $E = mc^2$

The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

**Block math** — wrap with double dollar signs:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

> AI-generated architecture specs, ML research notes, and algorithm documentation
> all benefit from proper formula rendering.

---

### Emoji Shortcodes

Use GitHub-compatible emoji shortcodes — they resolve to Unicode characters:

| Shortcode | Result |
|-----------|--------|
| `:rocket:` | :rocket: |
| `:warning:` | :warning: |
| `:white_check_mark:` | :white_check_mark: |
| `:x:` | :x: |
| `:bulb:` | :bulb: |
| `:memo:` | :memo: |
| `:hammer_and_wrench:` | :hammer_and_wrench: |
| `:sparkles:` | :sparkles: |
| `:bug:` | :bug: |
| `:fire:` | :fire: |

Status: :white_check_mark: Done &nbsp; In progress: :hammer_and_wrench: &nbsp; Blocked: :x:

---

### Highlight / Mark

Use `==double equals==` to mark important text:

The deployment window is ==Friday 23:00–01:00 UTC==. Do **not** deploy outside this window.

Review comments marked ==pending approval== must be addressed before merge.

Three acceptance criteria remain ==unverified== and need manual testing.

> Pairs well with spec review: highlight unknowns, decisions, blockers.

---

### Footnotes

Block footnotes — place the reference inline, definition at the bottom:

The CAP theorem[^cap] states that distributed systems can guarantee at most two of
three properties. Dynamo[^dynamo] chose availability and partition tolerance.

[^cap]: Brewer, E. A. (2000). Towards Robust Distributed Systems. PODC Keynote.
[^dynamo]: DeCandia et al. (2007). Dynamo: Amazon's Highly Available Key-value Store. SOSP.

Inline footnotes — definition right where you reference it:

The service uses exponential backoff^[Base delay 100ms, multiplier 2, max 30s, jitter ±20%.] for retries.

> Long ADRs and research reports benefit from citations without cluttering the prose.

---

### Superscript & Subscript

Superscript with `^carets^`:

Version 2^nd^ release · HTTP/1^st^ generation · O(n^2^) complexity · x^n+1^

Subscript with `~tildes~`:

Water: H~2~O · Carbon dioxide: CO~2~ · Sulfuric acid: H~2~SO~4~

Combined in a chemical equation:

CH~4~ + 2O~2~ → CO~2~ + 2H~2~O

> Note: `~~double tilde~~` is still strikethrough. ~~Deprecated API~~ keeps working.

---

### Wiki-links

Navigate the file graph with `[[wikilinks]]`:

See the [[Architecture]] document for system design decisions.

The [[ADR/001-use-postgres|database decision]] was made in Q1.

Refer to [[.plan/BACKLOG]] for the full feature backlog.

> Wiki-links display as styled purple links in the prototype. In the final Tauri app,
> they navigate to the linked file within the open folder.

---

### Insert (Track Changes)

Use `++double plus++` for inserted text, paired with ~~strikethrough~~ for edits:

The API ~~returns a list~~ ++returns a paginated cursor++ for all endpoints.

Status changed from ~~`draft`~~ to ++`approved`++.

> Useful in ADRs to show what changed between decision revisions.

---

### Multiline Blockquotes

Standard `>` blockquotes are line-by-line. Use `>>>` for multi-paragraph quotes:

>>>
This is a long quoted passage that spans multiple paragraphs.

It can contain **formatting**, `code`, lists, and other block elements
without needing a `>` prefix on every single line.

The closing `>>>` ends the blockquote.
>>>

> Useful for quoting long specification passages or referencing RFC sections.

---

### Description Lists

Term on its own line, definition preceded by `:`:

API Gateway
: Single entry point for all client requests. Handles auth, rate limiting, routing.
: Also responsible for SSL termination and request logging.

Circuit Breaker
: Design pattern that prevents cascading failures by temporarily blocking calls
  to a failing dependency.

Idempotency Key
: Client-generated unique ID that allows safe request retries without duplicate
  side effects.

> Perfect for DDD.md domain glossaries and architecture documentation.

---

### Spoiler Text

Reveal hidden text on click — useful for answers, solutions, or sensitive info:

The answer is ||42||.

The root password is ||hunter2|| (just kidding).

The plot twist: ||the butler did it||.

> In review docs or quiz-style onboarding guides, spoilers prevent accidental reveals.

---
```

---

## Implementation Notes

- Each section has a `---` separator for visual breathing room.
- The Math section requires `katex/dist/katex.min.css` imported in the app.
- Wiki-links in the prototype render purple with a tooltip; no file resolution yet.
- Spoiler CSS: `filter: blur(4px); cursor: pointer;` + `:hover { filter: none; }`
  or a click-to-toggle with `data-revealed` attribute.
- All emoji shortcodes in the table are live — they will render as actual emoji.
- Footnote section should render at the bottom of Welcome.md (comrak default behavior).
