import { InjectionToken } from '@angular/core';
import type { Rule } from '@/app/shared/rules/decision-engine';
import type { PrimaryAction } from '@/app/shared/domain/job.model';
import type { JobCtx } from '@/app/shared/domain/job.ctx';

export type Ctx = JobCtx;

export const ACTION_RULES = new InjectionToken<readonly Rule<Ctx, PrimaryAction>[]>('ACTION_RULES');
export const HEADER_RULES = new InjectionToken<readonly Rule<Ctx, string>[]>('HEADER_RULES');