/**
 * Minimal generic transition entry for a table-driven FSM.
 */
export type Transition<S extends string, E extends string> = Readonly<{
  from: S;
  event: E;
  to: S;
}>;

/**
 * Advance the FSM one step if there's a matching transition; otherwise stay put.
 * Table-driven makes it obvious what is and isn't legal.
 *
 * @see https://en.wikipedia.org/wiki/Finite-state_machine
 */
export function step<S extends string, E extends string>(
  current: S,
  event: E,
  transitions: readonly Transition<S, E>[],
): S {
  const t = transitions.find((x) => x.from === current && x.event === event);
  return t ? t.to : current;
}