import { InjectionToken } from '@angular/core';
import type { Rule } from '@/app/shared/rules/decision-engine';
import type { PrimaryAction } from '@/app/shared/domain/job.model';
import type { JobCtx } from '@/app/shared/domain/job.ctx';

/**
 * Public alias for the rule context used on this page.
 * We lean on the shared JobCtx so rules can be reused across features.
 */
export type Ctx = JobCtx;

/** DI token for action rules contributed by features/providers. */
export const ACTION_RULES = new InjectionToken<readonly Rule<Ctx, PrimaryAction>[]>('ACTION_RULES');

/** DI token for header rules contributed by features/providers. */
export const HEADER_RULES = new InjectionToken<readonly Rule<Ctx, string>[]>('HEADER_RULES');