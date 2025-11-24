import { isFactoryFunction } from '@/app/shared/utils/invocation-guards';

/**
 * Minimalistic rule cell for a decision table ("first match wins").
 * `value` can be a literal or a 0-arg factory; we invoke only true factories.
 */
export type StaticRule<T> = Readonly<{ when: boolean; value: T | (() => T) }>;

/**
 * Evaluate a small decision table (ordered rules).
 * The first rule with `when === true` wins; otherwise we return the fallback.
 *
 * This is the "data-driven Chain of Responsibility" idea in a tiny helper.
 * It keeps policy in data and removes nested branching from call-sites.
 *
 * @param rules    Ordered rules; first truthy `when` wins.
 * @param fallback Literal or factory used when no rule matches.
 * @returns Match result or fallback.
 *
 * @see https://en.wikipedia.org/wiki/Decision_table
 * @see https://refactoring.guru/design-patterns/chain-of-responsibility
 */
export function pickByRules<T>(
  rules: readonly StaticRule<T>[],
  fallback: T | (() => T),
): T {
  for (const r of rules) {
    if (!r.when) {
      continue;
    }
    const v = r.value as unknown;
    return isFactoryFunction(v) ? (v as () => T)() : (v as T);
  }
  const fb = fallback as unknown;
  return isFactoryFunction(fb) ? (fb as () => T)() : (fb as T);
}