---
id: E006-T03
epic: E006
status: pending
created: 2026-03-31
branch: feat/E006-T03-zen-hover-bar
---
# E006-T03: Zen Mode Hover Bar (JetBrains pattern)

## Goal
When in Zen Mode, hovering the top edge of the screen reveals a floating bar with:
- Mode switcher (Edit [Visual|Code] or Preview) — same as MenuBar center
- "Exit Zen Mode" button on the right

## Design

### Hover zone
- Invisible 16px tall zone at the very top of the viewport
- On mouse enter → bar slides down (transform translateY)
- On mouse leave from bar → bar hides after 1.5s delay (cancelable on re-enter)

### Zen Hover Bar contents
- Left: mdpad logo (small, 14px)
- Center: Mode switcher (reuse same markup/style as MenuBar modeSwitch)
- Right: "Exit Zen Mode" button (Minimize icon + text)

### Styling
- Position: fixed, top: 0, full width, z-index: 9999
- Background: var(--bg-surface) with subtle border-bottom
- Height: ~40px
- Slide animation: transform translateY(-100%) → translateY(0), 200ms ease
- Semi-transparent backdrop until fully revealed

### State
- No new global state needed — local useState in the component
- `visible: boolean` — controlled by mouse events
- `hideTimeout: ReturnType<typeof setTimeout>` — 1.5s delay on mouse leave

## Files
- Create: `prototype/src/components/layout/ZenHoverBar.tsx`
- Create: `prototype/src/components/layout/ZenHoverBar.module.css`
- Update: `prototype/src/App.tsx` — render ZenHoverBar when zenMode active

## Acceptance criteria
- [ ] Hovering top 16px of screen reveals bar
- [ ] Bar shows mode switcher + Exit Zen Mode button
- [ ] Exit button dispatches TOGGLE_ZEN_MODE
- [ ] Mode switcher works (can change modes while in zen)
- [ ] Bar auto-hides 1.5s after mouse leaves
- [ ] Works in dark/light/sepia themes
- [ ] All tests pass
