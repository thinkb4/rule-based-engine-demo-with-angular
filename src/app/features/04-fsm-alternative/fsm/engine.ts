export type Transition<S extends string, E extends string> = Readonly<{
  from: S;
  event: E;
  to: S;
}>;

export function step<S extends string, E extends string>(
  current: S,
  event: E,
  transitions: readonly Transition<S, E>[],
): S {
  const t = transitions.find((x) => x.from === current && x.event === event);
  return t ? t.to : current;
}