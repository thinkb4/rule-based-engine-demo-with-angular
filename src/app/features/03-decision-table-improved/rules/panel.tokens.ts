import { InjectionToken, Type } from '@angular/core';
import { Rule } from '@/app/shared/rules/decision-engine';
import { JobCtx } from '@/app/shared/domain/job.ctx';
import { JobStatePanel } from '@/app/shared/ui/job-state-panels';

export const PANEL_RULES = new InjectionToken<readonly Rule<JobCtx, Type<JobStatePanel>>[]>('PANEL_RULES');