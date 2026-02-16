# Dev Workflow

## Commands

### Development

```bash
bun dev            # SvelteKit dev server → localhost:5173
bun tauri:dev      # Tauri desktop dev (wraps vite dev)
bun build          # Web production build (adapter-static)
bun tauri:build    # Tauri desktop build (NO_STRIP=true is baked in)
bun preview        # Preview web production build
```

### Code Quality

```bash
bun fix            # Format + lint staged files (auto-runs on commit)
bun fix-all        # Format + lint entire src/ + svelte-kit sync + type-check
bun watch          # Continuous type checking (svelte-check --watch)
```

> No dedicated test runner — `bun fix-all` (type-check) is the quality gate.
> Run it and confirm zero errors before every commit.

### Troubleshooting

```bash
bun svelte-kit sync                            # Fix "Cannot find module" errors
rm -rf .svelte-kit && bun dev                  # Clear SvelteKit cache
rm -rf node_modules .svelte-kit && bun install # Full reset
```

## Git Hooks

| Hook         | Command               | Trigger         |
| ------------ | --------------------- | --------------- |
| `pre-commit` | `bun fix`             | On every commit |
| `commit-msg` | Validates type prefix | On every commit |
| `pre-push`   | `bun fix-all`         | On every push   |

**Never use `--no-verify`.** If a hook fails → run `bun fix-all`, fix all errors,
then commit again.

## Git Habits

- Stage specific files: `git add <file>` — avoid `git add .`
- Pre-commit hook auto-formats staged files
- If the commit-msg hook rejects: check the type list and format in `.gitmessage`

## Pre-Commit Checklist

- [ ] `bun fix-all` passes (zero errors, zero type errors)
- [ ] No console errors in the browser
- [ ] Changes tested at multiple screen sizes (mobile-first)
- [ ] Images have explicit `width`/`height`, `alt`, are ≤ 500 KB, WebP format
- [ ] External links have `target="_blank" rel="noopener noreferrer"`
- [ ] Every new page has `<Meta title="..." />`

## Common Issues

| Symptom                         | Fix                                                               |
| ------------------------------- | ----------------------------------------------------------------- |
| "Cannot find module `$lib/...`" | `bun svelte-kit sync`                                             |
| Pre-commit hook fails           | `bun fix-all`, then commit again                                  |
| Type errors in watch mode       | `bun watch` for detailed output                                   |
| Build fails unexpectedly        | `rm -rf .svelte-kit && bun build`                                 |
| Tauri build strips error        | Already handled — `NO_STRIP=true` is baked into `bun tauri:build` |
