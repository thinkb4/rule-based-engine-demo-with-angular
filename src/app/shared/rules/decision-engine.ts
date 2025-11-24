import { isFactoryFunction } from '@/app/shared/utils/invocation-guards';

/**
 * Generic rule entry used by the improved engine.
 * - `when` can look at the full context.
 * - `value` can be a literal or computed from the context.
 * - `priority`: higher wins (ties preserve original order).
 */
export type Rule<C, T> = Readonly<{
  when: (ctx: C) => boolean;
  value: T | ((ctx: C) => T);
  priority?: number; // higher wins
  name?: string;     // useful in traces
}>;

/** A single trace step emitted during evaluation. */
export type DecisionTraceStep<T> = Readonly<{
  ruleName?: string;
  matched: boolean;
  selectedValue?: T;
}>;

/**
 * Sorts rules by priority and evaluates predicates against `ctx`.
 * Returns the first matching rule's value (literal or computed);
 * otherwise uses the fallback (literal or factory).
 *
 * We deliberately avoid invoking Angular Ivy types and class constructors
 * by delegating to `isFactoryFunction`.
 *
 * @param ctx      fully derived context (facts + raw fields)
 * @param rules    rule set to evaluate
 * @param fallback literal/factory fallback
 * @param trace    optional collector for debug/teaching
 *
 * @see https://angular.dev/guide/dependency-injection (for multi providers used to contribute rules)
 * @see https://refactoring.guru/design-patterns/chain-of-responsibility
 */
export function decideWithCtx<C, T>(
  ctx: C,
  rules: readonly Rule<C, T>[],
  fallback: T | ((ctx: C) => T),
  trace?: { collect: (s: DecisionTraceStep<T>) => void },
): T {
  // Higher priority first; stable for equal priority by preserving original order.
  const ordered = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const r of ordered) {
    const matched = r.when(ctx);
    if (trace) {
      trace.collect({ ruleName: r.name, matched });
    }
    if (matched) {
      const v = r.value as unknown;
      const val = isFactoryFunction(v) ? (v as (c: C) => T)(ctx) : (v as T);
      if (trace) {
        trace.collect({ ruleName: r.name, matched: true, selectedValue: val });
      }
      return val;
    }
  }

  const fb = fallback as unknown;
  const fbVal = isFactoryFunction(fb) ? (fb as (c: C) => T)(ctx) : (fb as T);
  if (trace) {
    trace.collect({ ruleName: 'fallback', matched: true, selectedValue: fbVal });
  }
  return fbVal;
}