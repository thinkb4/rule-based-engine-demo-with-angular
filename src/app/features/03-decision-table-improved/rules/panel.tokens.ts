import { InjectionToken, Type } from '@angular/core';
import { Rule } from '@/app/shared/rules/decision-engine';
import { JobCtx } from '@/app/shared/domain/job.ctx';
import { JobStatePanel } from '@/app/shared/ui/job-state-panels';

/**
 * DI token for "which presentational panel to render" rules.
 * Values are Angular component classes, which our engine treats as values (not factories).
 */
export const PANEL_RULES = new InjectionToken<readonly Rule<JobCtx, Type<JobStatePanel>>[]>('PANEL_RULES');