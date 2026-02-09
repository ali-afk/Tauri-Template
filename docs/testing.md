# Testing

## Setup

Vitest + happy-dom (no browser needed), configured in `vite.config.ts`. Runs via
`bun --bun vitest` — Bun engine so `Bun` globals available in tests.

- **Globals**: `describe`, `it`, `expect`, `vi` — no imports needed
- **Environment**: `happy-dom` — lightweight DOM, `getComputedStyle`,
  `document`, etc.
- **Custom matchers**: `@testing-library/jest-dom/vitest` — `toBeInDocument`,
  `toHaveStyle`, `toBeVisible`, etc.
- **Setup file**: `src/lib/scripts/test-setup.ts` (imports jest-dom)

## Running

| Command             | What                                      |
| ------------------- | ----------------------------------------- |
| `bun run test`      | All tests (vitest via Bun engine)         |
| `bun test:coverage` | + v8 coverage (text + lcov in `.vitest/`) |
| `bun test:bench`    | Vitest benchmarks                         |

Pre-push hook runs `bun test` automatically.

## Conventions

### File Location

Test files go in a `__tests__/` directory next to the source module:

```
src/lib/scripts/
├── media.ts
├── __tests__/
│   └── media.test.ts
├── gen/
│   ├── css.ts
│   └── __tests__/
│       └── css.test.ts
```

### Naming

Use `describe(fn, ...)` — pass the function itself as the label:

```ts
describe(parseBezierCoords, () => { ... });
describe(queryCssProperty, () => { ... });
```

The test name describes observable behavior:

```ts
it("throws if '--' prefix is missing", () => { ... });
it("returns empty string for undefined property", () => { ... });
```

### DOM Setup

If tests only read (no mutations between tests), set up DOM at module level — no
`beforeEach` needed:

```ts
const div = document.createElement("div");
div.style.setProperty("--test-width", "10px");
document.documentElement.style.setProperty("--test-color", "hotpink");
document.body.appendChild(div);

describe(queryCssProperty, () => {
  it("reads property from :root", () => {
    expect(queryCssProperty("--test-color")).toBe("hotpink");
  });
});
```

Add `beforeEach` only if a test mutates state.

### Mocking

#### Module Mock Pattern

Use `vi.hoisted` + `vi.mock`:

```ts
const mockMedia = vi.hoisted(() => ({
  current: false,
}));

vi.mock("$scripts/media", () => ({
  queryCssProperty() {
    return "cubic-bezier(.5,0,.5,1)";
  },
  getCurrentMedia() {
    return mockMedia.current;
  },
}));
```

- `vi.hoisted` runs before `vi.mock` (both are hoisted above imports)
- Tests control the mock via the hoisted ref: `mockMedia.current = true`
- Place at module level, not inside `describe` (vitest warns about nesting)

#### Mocking Svelte Reactivity Modules

`MediaQuery` from `svelte/reactivity` needs `matchMedia` (not in happy-dom):

```ts
vi.mock("svelte/reactivity", () => ({
  MediaQuery: class {
    get current() {
      return mockMedia.current;
    }
  },
}));
```

### What Not to Test

- **Private functions** — test them through their public callers unless
  extracting for testing (then document why)
- **Mock internals** — test the contract, not implementation details
- **Pure DOM behavior** — happy-dom handles this; trust it

### CSS Generator Tests

NOTE: This section is wrong The `gen/css.test.ts` tests module-level code
(`flattenDesignToken`, `getDefaultCssValues`, `getNearestConfig`) with mocked
`DesignTokens` and `Bun.write`. Uses `vi.hoisted` + `vi.mock` for
`$data/design-tokens` and `vi.stubGlobal` for `Bun`. The integration test calls
`genDesignTokens()` and asserts `@property` syntax in the output string.

### Gen CSS Test Setup

```ts
const mockTokens = vi.hoisted(() => ({ ... }));
vi.mock("$data/design-tokens", () => ({ DesignTokens: mockTokens }));
vi.spyOn(Bun, "write").mockImplementation(vi.fn());
```

## Commit Message Lint Tests

`scripts/commit-msg/lint-title.ts` enforces commit format via lefthook
(`runner: bun`). Tested via vitest at `scripts/__tests__/lint-title.test.ts`
using only Bun APIs:

**Pattern:** temp dir via `mktemp`, write via `Bun.write`, run via
`Bun.spawnSync`, assert:

```ts
async function run(msg: string) {
  const dir = Bun.spawnSync(["mktemp", "-d"]).stdout.toString().trim();
  await Bun.write(`${dir}/msg`, msg);
  const result = Bun.spawnSync(["bun", SCRIPT, `${dir}/msg`]);
  Bun.spawnSync(["rm", "-rf", dir]);
  return { exitCode: result.exitCode, output: result.stdout + result.stderr };
}
```

## Coverage

Reports written to `.vitest/` (gitignored). Run `bun test:coverage`.
