# TypeScript Patterns

Type safety patterns used in the BRITMUN codebase.
Strict mode is enabled (`noUncheckedIndexedAccess: true`).

## Index Signatures with Union Constraints

Instead of `[key: string]: string`, use mapped types:

```typescript
type ColorScale = {
  [K in 100 | 300 | 500 | 700 | 900]: string;
};

colors[500];  // ✓ Valid
colors[200];  // ✗ Compile error
```

See `ColorScale` in `src/lib/types/colors.ts`.

## Generic Intersection Types

Add common properties to multiple types:

```typescript
type PropertyGroup<T extends Record<string, unknown>> = T & {
  config?: PropertyConfig;
};

type FontWeights = PropertyGroup<{
  light: number;
  regular: number;
  bold: number;
}>;
```

See `PropertyNode` in `src/lib/types/design-tokens.ts`.

## The `satisfies` Operator

Get both type validation AND literal type preservation:

```typescript
// ✗ Type annotation loses literal types
const obj: Schema = { color: "#934599" };  // color is `string`

// ✓ satisfies preserves literals AND validates
const obj = { color: "#934599" } as const satisfies Schema;  // color is "#934599"
```

Used for `DefaultProperties` to enable type-safe design token access.

## Type Guards

Safe property access without `as any`:

```typescript
function getConfig(obj: unknown): PropertyConfig | undefined {
  if (
    typeof obj === "object" &&
    obj !== null &&
    "config" in obj
  ) {
    return (obj as { config?: PropertyConfig }).config;
  }
  return undefined;
}
```

## Strict Array Access

With `noUncheckedIndexedAccess`, array access returns `T | undefined`:

```typescript
// ✗ Might be undefined
const [_, value] = str.match(/regex/);

// ✓ Validate first
const match = str.match(/regex/);
if (!match?.[1]) return fallback;
const value = match[1];  // Now safe
```

See `parseCssTime()` in `src/lib/scripts/utils.ts`.

## Best Practices

**Do:**

- Use mapped types for fixed key sets
- Use `as const satisfies` for validated literals
- Write type guards instead of `as any`
- Validate arrays before accessing indices

**Don't:**

- Use `as any` to bypass checks
- Use `!` assertions without validation
- Destructure arrays without checking length
- Use `@ts-ignore` casually
