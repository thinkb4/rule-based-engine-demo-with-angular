export type Rule<C, T> = Readonly<{
  when: (ctx: C) => boolean;
  value: T | ((ctx: C) => T);
  priority?: number; // higher wins
  name?: string;     // useful in traces
}>;

export type DecisionTraceStep<T> = Readonly<{
  ruleName: string | undefined;
  matched: boolean;
  selectedValue?: T;
}>;

export type DecisionTrace<T> = Readonly<{
  steps: DecisionTraceStep<T>[];
  fallbackUsed: boolean;
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
    if (trace) {
      trace.collect({ ruleName: r.name, matched });
    }
    if (matched) {
      const val = typeof r.value === 'function' ? (r.value as (c: C) => T)(ctx) : r.value;
      if (trace) {
        trace.collect({ ruleName: r.name, matched: true, selectedValue: val });
      }
      return val;
    }
  }
  const fb = typeof fallback === 'function' ? (fallback as (c: C) => T)(ctx) : fallback;
  if (trace) {
    trace.collect({ ruleName: 'fallback', matched: true, selectedValue: fb });
  }
  return fb;
}

/** Detect rules that are always shadowed by higher-priority rules on given sample contexts. */
export function detectShadowed<C, T>(
  samples: readonly C[],
  rules: readonly Rule<C, T>[],
): number[] {
  const ordered = [...rules].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const shadowed: number[] = [];
  ordered.forEach((r, idx) => {
    const above = ordered.slice(0, idx);
    const allShadowed = samples.every((s) => {
      if (!r.when(s)) {
        return true; // non-applicable on this sample
      }
      return above.some((u) => u.when(s));
    });
    if (allShadowed) {
      shadowed.push(idx);
    }
  });
  return shadowed;
}