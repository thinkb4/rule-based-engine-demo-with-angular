import { isFactoryFunction } from '@/app/shared/utils/invocation-guards';

export type Rule<C, T> = Readonly<{
  when: (ctx: C) => boolean;
  value: T | ((ctx: C) => T);
  priority?: number; // higher wins
  name?: string;
}>;

export type DecisionTraceStep<T> = Readonly<{
  ruleName?: string;
  matched: boolean;
  selectedValue?: T;
}>;

export function decideWithCtx<C, T>(
  ctx: C,
  rules: readonly Rule<C, T>[],
  fallback: T | ((ctx: C) => T),
  trace?: { collect: (s: DecisionTraceStep<T>) => void },
): T {
  const ordered = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  for (const r of ordered) {
    const matched = r.when(ctx);
    if (trace) trace.collect({ ruleName: r.name, matched });
    if (matched) {
      const v = r.value as unknown;
      const val = isFactoryFunction(v) ? (v as (c: C) => T)(ctx) : (v as T);
      if (trace) trace.collect({ ruleName: r.name, matched: true, selectedValue: val });
      return val;
    }
  }

  const fb = fallback as unknown;
  const fbVal = isFactoryFunction(fb) ? (fb as (c: C) => T)(ctx) : (fb as T);
  if (trace) trace.collect({ ruleName: 'fallback', matched: true, selectedValue: fbVal });
  return fbVal;
}