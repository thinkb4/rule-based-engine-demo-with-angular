import { Provider } from '@angular/core';
import { ActionKind } from '@/app/shared/domain/job.model';
import { HEADER_RULES, ACTION_RULES, Ctx } from './tokens';

export const BASE_RULE_PROVIDERS: Provider[] = [
  // Header rules
  { provide: HEADER_RULES, multi: true, useValue: { name: 'idle-standard', priority: 40, when: (c: Ctx) => c.facts.isIdle && c.facts.isStandard, value: 'Standard job is idle' } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'idle-premium',  priority: 40, when: (c: Ctx) => c.facts.isIdle && c.facts.isPremium,  value: 'Premium job is idle' } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'running',       priority: 30, when: (c: Ctx) => c.facts.isRunning, value: (c: Ctx) => (c.facts.isPremium ? 'Premium is processing' : 'Standard is processing') } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'ready',         priority: 20, when: (c: Ctx) => c.facts.isReady,   value: (c: Ctx) => (c.facts.isPremium ? 'Premium result ready' : 'Standard result ready') } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'failed',        priority: 10, when: (c: Ctx) => c.facts.isFailed,  value: (c: Ctx) => (c.facts.isPremium ? 'Premium failed' : 'Standard failed') } },

  // Action rules
  { provide: ACTION_RULES, multi: true, useValue: { name: 'ready->view',   priority: 100, when: (c: Ctx) => c.facts.isReady,   value: { kind: ActionKind.View,  label: 'Open Result' } as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'running->none', priority: 80,  when: (c: Ctx) => c.facts.isRunning, value: { kind: ActionKind.None,  label: 'Processing…' } as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'idle->start',   priority: 60,  when: (c: Ctx) => c.facts.isIdle,    value: (c: Ctx) => ({ kind: ActionKind.Start, label: c.facts.isPremium ? 'Start Premium' : 'Start Standard' }) as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'failed->retry', priority: 40,  when: (c: Ctx) => c.facts.isFailed,  value: { kind: ActionKind.Retry, label: 'Retry' } as const } },
];