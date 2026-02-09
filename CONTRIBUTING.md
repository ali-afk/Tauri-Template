# Contributing

This is a personal template. If you're collaborating or using this as a base:

## Getting Started

1. Read the [Customizing Template Guide](docs/customizing-template.md) to adapt for your project
2. Read the [Development Guide](docs/development.md) for workflow and common tasks
3. Run `bun dev` and make a test change to verify your setup
4. Review guides in `docs/` for architectural patterns

## Code Style

Formatting is automatic via Biome (runs on commit). Key conventions:

- **Tabs** for indentation
- **Double quotes** for strings
- **PascalCase.svelte** for components, **kebab-case.ts** for scripts/data files
- **Always use design tokens**: `var(--color-primary-500)`, never hardcoded values
- **Preserve accessibility**: ARIA labels, semantic HTML, keyboard navigation

See [CSS Guide](docs/css.md) and [SvelteKit Guide](docs/sveltekit.md) for detailed patterns.

## Commit Format

```
<type>: <summary>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `update` - Improve existing feature
- `content` - Content updates
- `style` - Visual/CSS changes
- `refactor` - Code cleanup (no behavior change)
- `docs` - Documentation
- `config` - Configuration changes
- `chore` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add contact form component"
git commit -m "style: update button hover effects"
git commit -m "content: replace placeholder testimonials"
```

## Development Workflow

```bash
# Start development server
bun dev

# Run linter/formatter (auto-runs on commit)
bun run fix-all

# Type checking
bun run watch

# Production build
bun run build
bun preview
```

## Making Changes

1. **Create a branch** (if collaborating)
2. **Make your changes** - follow the patterns in existing code
3. **Test thoroughly** - check dev server, run build, verify types
4. **Commit with proper format** - Biome auto-formats on commit
5. **Push and deploy** (if applicable)

## Key Principles

- **Simple over clever** - Readable code beats "smart" code
- **Consistent patterns** - Follow existing component/file structure
- **Accessibility first** - Never sacrifice a11y for aesthetics
- **Type safety** - Define types for all data structures
- **Design tokens always** - Use variables, never hardcode colors/spacing

## Resources

| Guide | Purpose |
|-------|---------|
| [Customizing Template](docs/customizing-template.md) | Adapt template for new projects |
| [Development Guide](docs/development.md) | Daily workflow, troubleshooting |
| [CSS Guide](docs/css.md) | Design tokens, styling patterns |
| [SvelteKit Guide](docs/sveltekit.md) | Component patterns, Svelte 5 |
| [Architecture Decisions](docs/architecture-decisions.md) | Why things are built this way |
