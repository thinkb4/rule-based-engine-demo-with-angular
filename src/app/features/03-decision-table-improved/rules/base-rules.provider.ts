import { Provider } from '@angular/core';
import { ActionKind } from '@/app/shared/domain/job.model';
import { HEADER_RULES, ACTION_RULES, Ctx } from './tokens';

/**
 * Base (default) rule set contributed via Angular multi providers.
 *
 * These rules are intentionally simple and self-contained so the page can
 * demonstrate how DI-driven, data-first rules select both headers and actions.
 *
 * Conventions:
 * - Higher `priority` wins. If priorities tie, original order is preserved.
 * - `when` receives the fully-derived `Ctx` (raw fields + facts).
 * - `value` may be a literal or a `(ctx) => T` factory. The shared decision
 *   engine only invokes true factories (never Angular classes/constructors).
 *
 * How to extend/override:
 * - Provide additional rules in any feature module/page with the same tokens
 *   (`HEADER_RULES`, `ACTION_RULES`) using `{ multi: true }`.
 * - Use a higher `priority` to take precedence, or a lower one to fall back.
 *
 * @see https://angular.dev/guide/dependency-injection
 * @see https://angular.dev/guide/dependency-injection-in-action#multi-providers
 * @see "@/app/shared/rules/decision-engine.ts" (priority + first-match semantics)
 */
export const BASE_RULE_PROVIDERS: Provider[] = [
  // ------------------
  // Header rules
  // ------------------

  /**
   * Header when the job is idle and type is Standard.
   * Priority 40 so it beats any generic `idle` header if one is later added.
   */
  {
    provide: HEADER_RULES,
    multi: true,
    useValue: {
      name: 'idle-standard',
      priority: 40,
      when: (c: Ctx) => c.facts.isIdle && c.facts.isStandard,
      value: 'Standard job is idle',
    },
  },

  /**
   * Header when the job is idle and type is Premium.
   * Same priority (40) as the Standard idle rule to keep them parallel.
   */
  {
    provide: HEADER_RULES,
    multi: true,
    useValue: {
      name: 'idle-premium',
      priority: 40,
      when: (c: Ctx) => c.facts.isIdle && c.facts.isPremium,
      value: 'Premium job is idle',
    },
  },

  /**
   * Header while the job is running.
   * Uses a factory to specialize copy based on type.
   * Priority 30 — below idle headers, above ready/failed.
   */
  {
    provide: HEADER_RULES,
    multi: true,
    useValue: {
      name: 'running',
      priority: 30,
      when: (c: Ctx) => c.facts.isRunning,
      value: (c: Ctx) => (c.facts.isPremium ? 'Premium is processing' : 'Standard is processing'),
    },
  },

  /**
   * Header when the job is ready.
   * Factory picks the correct label for Standard vs. Premium.
   * Priority 20 — below running, above failed.
   */
  {
    provide: HEADER_RULES,
    multi: true,
    useValue: {
      name: 'ready',
      priority: 20,
      when: (c: Ctx) => c.facts.isReady,
      value: (c: Ctx) => (c.facts.isPremium ? 'Premium result ready' : 'Standard result ready'),
    },
  },

  /**
   * Header when the job failed.
   * Lowest header priority (10) to allow all other states to win first.
   */
  {
    provide: HEADER_RULES,
    multi: true,
    useValue: {
      name: 'failed',
      priority: 10,
      when: (c: Ctx) => c.facts.isFailed,
      value: (c: Ctx) => (c.facts.isPremium ? 'Premium failed' : 'Standard failed'),
    },
  },

  // ------------------
  // Action rules
  // ------------------

  /**
   * When the job is ready, the primary action is to view results.
   * Highest action priority (100) so it always beats other actions.
   */
  {
    provide: ACTION_RULES,
    multi: true,
    useValue: {
      name: 'ready->view',
      priority: 100,
      when: (c: Ctx) => c.facts.isReady,
      value: { kind: ActionKind.View, label: 'Open Result' } as const,
    },
  },

  /**
   * While running, we surface a passive/disabled action (informational copy).
   * Priority 80 — below ready/view, above idle/start and failed/retry.
   */
  {
    provide: ACTION_RULES,
    multi: true,
    useValue: {
      name: 'running->none',
      priority: 80,
      when: (c: Ctx) => c.facts.isRunning,
      value: { kind: ActionKind.None, label: 'Processing…' } as const,
    },
  },

  /**
   * From idle, start the job. The label adapts to the job type.
   * Priority 60 — below running/none (80), above failed/retry (40).
   */
  {
    provide: ACTION_RULES,
    multi: true,
    useValue: {
      name: 'idle->start',
      priority: 60,
      when: (c: Ctx) => c.facts.isIdle,
      value: (c: Ctx) =>
        ({ kind: ActionKind.Start, label: c.facts.isPremium ? 'Start Premium' : 'Start Standard' }) as const,
    },
  },

  /**
   * When failed, surface a retry action.
   * Priority 40 — lowest action, so any more specific rule can override it.
   */
  {
    provide: ACTION_RULES,
    multi: true,
    useValue: {
      name: 'failed->retry',
      priority: 40,
      when: (c: Ctx) => c.facts.isFailed,
      value: { kind: ActionKind.Retry, label: 'Retry' } as const,
    },
  },
];