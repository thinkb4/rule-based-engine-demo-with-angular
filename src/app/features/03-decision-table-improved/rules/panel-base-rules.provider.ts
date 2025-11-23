import { Provider, Type } from '@angular/core';
import { PANEL_RULES } from './panel.tokens';
import { JobCtx } from '@/app/shared/domain/job.ctx';
import {
  IdlePanelComponent,
  RunningPanelComponent,
  ReadyPanelComponent,
  FailedPanelComponent,
  JobStatePanel,
} from '@/app/shared/ui/job-state-panels';

export const PANEL_BASE_RULE_PROVIDERS: Provider[] = [
  { provide: PANEL_RULES, multi: true, useValue: { name: 'idle',    priority: 40, when: (c: JobCtx) => c.facts.isIdle,    value: IdlePanelComponent as Type<JobStatePanel> } },
  { provide: PANEL_RULES, multi: true, useValue: { name: 'running', priority: 30, when: (c: JobCtx) => c.facts.isRunning, value: RunningPanelComponent as Type<JobStatePanel> } },
  { provide: PANEL_RULES, multi: true, useValue: { name: 'ready',   priority: 20, when: (c: JobCtx) => c.facts.isReady,   value: ReadyPanelComponent as Type<JobStatePanel> } },
  { provide: PANEL_RULES, multi: true, useValue: { name: 'failed',  priority: 10, when: (c: JobCtx) => c.facts.isFailed,  value: FailedPanelComponent as Type<JobStatePanel> } },
];