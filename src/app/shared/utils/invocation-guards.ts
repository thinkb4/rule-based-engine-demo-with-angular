/** Angular Ivy markers: components, directives, pipes, modules */
export function isAngularIvyType(fn: unknown): boolean {
  if (typeof fn !== 'function') return false;
  const anyFn = fn as any;
  return !!(anyFn.ɵcmp || anyFn.ɵdir || anyFn.ɵpipe || anyFn.ɵmod);
}

/** Heuristic for ES class constructors (kept stable under ES2022 target) */
export function isClassConstructor(fn: unknown): boolean {
  if (typeof fn !== 'function') return false;
  const src = Function.prototype.toString.call(fn);
  return /^\s*class\b/.test(src);
}

/**
 * True iff it's a safe "factory function" we should invoke.
 * We DO NOT invoke Angular types or class constructors.
 */
export function isFactoryFunction(fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function' && !isAngularIvyType(fn) && !isClassConstructor(fn);
}