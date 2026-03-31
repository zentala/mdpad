# Ideas — mdpad

Raw ideas for future tasks. Not refined, not prioritized. Just captured.

## Plugin Enable/Disable in Settings

**Idea**: Add toggle switches in Settings to enable/disable individual remark/rehype plugins
(highlight, blur, superscript, subscript, wikilinks, etc.).

**Default**: All plugins enabled.

**Challenge**: When a plugin is disabled, the REFERENCE.md demo file will show raw markdown
syntax instead of rendered output. Need to either:
- Add inline explanations ("this is unformatted because the plugin is disabled")
- Show a banner at the top of REFERENCE.md listing disabled plugins
- Grey out / annotate sections that depend on disabled plugins

**Why deferred**: The UX for explaining "why this looks broken" is non-trivial.
Needs design thinking before implementation.

**Related**: REFERENCE.md content, SettingsView, remark/rehype plugin pipeline.
