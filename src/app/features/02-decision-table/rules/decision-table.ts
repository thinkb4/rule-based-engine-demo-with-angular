export type StaticRule<T> = Readonly<{ when: boolean; value: T | (() => T) }>;

export function pickByRules<T>(
  rules: readonly StaticRule<T>[],
  fallback: T | (() => T),
): T {
  for (const r of rules) {
    if (r.when) {
      return typeof r.value === 'function' ? (r.value as () => T)() : r.value;
    }
  }
  return typeof fallback === 'function' ? (fallback as () => T)() : fallback;
}