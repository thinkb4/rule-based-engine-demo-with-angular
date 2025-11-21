import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Provider,
  signal,
} from '@angular/core';
import { decideWithCtx } from './rules/decision-engine';
import {
  ACTION_RULES,
  HEADER_RULES,
  Ctx,
  JobState,
  JobType,
  PrimaryAction,
} from './rules/tokens';

function deriveCtx(type: JobType, state: JobState): Ctx {
  const facts = {
    isStandard: type === 'standard',
    isPremium: type === 'premium',
    isIdle: state === 'idle',
    isRunning: state === 'running',
    isReady: state === 'ready',
    isFailed: state === 'failed',
  } as const;
  return { type, state, facts };
}

// Base DI-provided rules (unchanged)
const baseProviders: Provider[] = [
  { provide: HEADER_RULES, multi: true, useValue: { name: 'idle-standard', priority: 40, when: (c: Ctx) => c.facts.isIdle && c.facts.isStandard, value: 'Standard job is idle' } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'idle-premium',  priority: 40, when: (c: Ctx) => c.facts.isIdle && c.facts.isPremium,  value: 'Premium job is idle' } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'running',       priority: 30, when: (c: Ctx) => c.facts.isRunning, value: (c: Ctx) => (c.facts.isPremium ? 'Premium is processing' : 'Standard is processing') } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'ready',         priority: 20, when: (c: Ctx) => c.facts.isReady,   value: (c: Ctx) => (c.facts.isPremium ? 'Premium result ready' : 'Standard result ready') } },
  { provide: HEADER_RULES, multi: true, useValue: { name: 'failed',        priority: 10, when: (c: Ctx) => c.facts.isFailed,  value: (c: Ctx) => (c.facts.isPremium ? 'Premium failed' : 'Standard failed') } },

  { provide: ACTION_RULES, multi: true, useValue: { name: 'ready->view',   priority: 100, when: (c: Ctx) => c.facts.isReady,   value: { kind: 'view',  label: 'Open Result' } as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'running->none', priority: 80,  when: (c: Ctx) => c.facts.isRunning, value: { kind: 'none',  label: 'Processing…' } as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'idle->start',   priority: 60,  when: (c: Ctx) => c.facts.isIdle,    value: (c: Ctx) => ({ kind: 'start', label: c.facts.isPremium ? 'Start Premium' : 'Start Standard' }) as const } },
  { provide: ACTION_RULES, multi: true, useValue: { name: 'failed->retry', priority: 40,  when: (c: Ctx) => c.facts.isFailed,  value: { kind: 'retry', label: 'Retry' } as const } },
];

@Component({
  standalone: true,
  selector: 'app-decision-table-advanced-page',
  imports: [],
  providers: [...baseProviders],
  templateUrl: './decision-table-advanced.page.html',
  styleUrls: ['./decision-table-advanced.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionTableAdvancedPage {
  readonly types: readonly JobType[] = ['standard', 'premium'] as const;
  readonly states: readonly JobState[] = ['idle', 'running', 'ready', 'failed'] as const;

  readonly type = signal<JobType>('standard');
  readonly state = signal<JobState>('idle');

  private readonly headerRules = inject(HEADER_RULES, { optional: true }) ?? [];
  private readonly actionRules = inject(ACTION_RULES, { optional: true }) ?? [];

  // PURE computed for header and action using decision engine
  readonly header = computed(() => {
    const ctx = deriveCtx(this.type(), this.state());
    return decideWithCtx(ctx, this.headerRules, () => 'Unknown state');
  });

  readonly action = computed<PrimaryAction>(() => {
    const ctx = deriveCtx(this.type(), this.state());
    return decideWithCtx(ctx, this.actionRules, { kind: 'none', label: 'No action' } as const);
  });

  // Trace as a computed array: recompute logs without mutating any signals.
  readonly trace = computed<string[]>(() => {
    const logs: string[] = [];
    const ctx = deriveCtx(this.type(), this.state());

    // Collect rule-matching trace for header
    decideWithCtx(ctx, this.headerRules, () => 'Unknown state', {
      collect: (msg) => logs.push(JSON.stringify(msg)),
    });

    // Collect rule-matching trace for action
    decideWithCtx(ctx, this.actionRules, { kind: 'none', label: 'No action' } as const, {
      collect: (msg) => logs.push(JSON.stringify(msg)),
    });

    return logs;
  });

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}