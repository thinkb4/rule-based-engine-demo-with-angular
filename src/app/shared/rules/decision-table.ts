import { isFactoryFunction } from '@/app/shared/utils/invocation-guards';

export type StaticRule<T> = Readonly<{ when: boolean; value: T | (() => T) }>;

export function pickByRules<T>(
  rules: readonly StaticRule<T>[],
  fallback: T | (() => T),
): T {
  for (const r of rules) {
    if (!r.when) continue;
    const v = r.value as unknown;
    return isFactoryFunction(v) ? (v as () => T)() : (v as T);
  }
  const fb = fallback as unknown;
  return isFactoryFunction(fb) ? (fb as () => T)() : (fb as T);
}