/**
 * Guards that decide whether a value that looks like a function is a
 * "factory function we should invoke" or a constructor/Angular type we must return as-is.
 * This keeps our rule engines from accidentally calling Angular components or class constructors.
 *
 * Why this exists:
 * - In JS, classes are functions. Angular components/directives/pipes are also functions with Ivy markers.
 * - Our decision helpers allow `value` to be either a literal *or* a function.
 * - We only want to invoke *true* factory functions, never constructors or Ivy types.
 *
 * @see https://angular.dev/api/common/NgComponentOutlet
 * @see https://angular.dev/guide/signals
 */
 
/** Angular Ivy markers: components, directives, pipes, modules. */
export function isAngularIvyType(fn: unknown): boolean {
  if (typeof fn !== 'function') {
    return false;
  }
  // These ɵ* fields are added by Angular's Ivy compiler to the class function.
  // We treat any such entity as a "type" (value), not a factory to be invoked.
  const anyFn = fn as any;
  return !!(anyFn.ɵcmp || anyFn.ɵdir || anyFn.ɵpipe || anyFn.ɵmod);
}

/**
 * Heuristic for ES class constructors. With our `target: es2022`,
 * classes stringify with a leading `class`, which is stable for this project.
 */
export function isClassConstructor(fn: unknown): boolean {
  if (typeof fn !== 'function') {
    return false;
  }
  const src = Function.prototype.toString.call(fn);
  return /^\s*class\b/.test(src);
}

/**
 * True iff it's a safe "factory function" we should invoke.
 * We DO NOT invoke Angular types or ES class constructors.
 */
export function isFactoryFunction(fn: unknown): fn is (...args: any[]) => any {
  return typeof fn === 'function' && !isAngularIvyType(fn) && !isClassConstructor(fn);
}