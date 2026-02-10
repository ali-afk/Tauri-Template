# Code Style

Personal template. Conventions for consistency:

## Formatting

Biome auto-formats on commit. Key rules:

- Tabs for indentation
- Double quotes
- Semicolons

## Conventions

- **Design tokens only**: Never hardcode colors, spacing, etc.
- **Barrel exports**: `index.ts` for clean imports
- **Type safety**: Strict TypeScript, explicit types for props
- **Svelte 5 runes**: Use `$state`, `$props`, `$derived`, `$effect`
- **Accessibility**: ARIA labels, semantic HTML, keyboard support

## Commit Format

`<type>: <summary>`

Types: `feat`, `feat-rm`, `fix`, `update`, `refactor`, `docs`,
`style`, `config`, `content`, `chore`, `misc`

Examples:

```bash
feat: add QuoteCard component
fix: correct auto-contrast calculation
refactor: extract design tokens
docs: update architecture decisions
config: update Tauri window dimensions
```

## Resources

- [Architecture Decisions](docs/architecture-decisions.md)
- [CSS System](docs/css.md)
- [Color System](docs/color-system.md)
- [SvelteKit Patterns](docs/sveltekit.md)
