import { InjectionToken } from '@angular/core';
import type { Rule } from './decision-engine';

export type JobType = 'standard' | 'premium';
export type JobState = 'idle' | 'running' | 'ready' | 'failed';

export type Ctx = Readonly<{
  type: JobType;
  state: JobState;
  facts: Readonly<{
    isStandard: boolean;
    isPremium: boolean;
    isIdle: boolean;
    isRunning: boolean;
    isReady: boolean;
    isFailed: boolean;
  }>;
}>;

export type PrimaryAction =
  | { kind: 'start'; label: string }
  | { kind: 'view'; label: string }
  | { kind: 'retry'; label: string }
  | { kind: 'none'; label: string };

export const ACTION_RULES = new InjectionToken<readonly Rule<Ctx, PrimaryAction>[]>('ACTION_RULES');
export const HEADER_RULES = new InjectionToken<readonly Rule<Ctx, string>[]>('HEADER_RULES');