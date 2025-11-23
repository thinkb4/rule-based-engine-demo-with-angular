import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { JOB_STATES, JOB_TYPES, JobState, JobType, PrimaryAction, ActionKind, NO_ACTION } from '@/app/shared/domain/job.model';
import { buildJobCtx } from '@/app/shared/domain/job.ctx';
import { decideWithCtx } from '@/app/shared/rules/decision-engine';
import { ACTION_RULES, HEADER_RULES } from './rules/tokens';
import { BASE_RULE_PROVIDERS } from './rules/base-rules.provider';

@Component({
  standalone: true,
  selector: 'app-decision-table-advanced-page',
  imports: [],
  providers: [...BASE_RULE_PROVIDERS],
  templateUrl: './decision-table-advanced.page.html',
  styleUrls: ['./decision-table-advanced.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionTableAdvancedPage {
  readonly types = JOB_TYPES;
  readonly states = JOB_STATES;

  readonly type = signal<JobType>(JobType.Standard);
  readonly state = signal<JobState>(JobState.Idle);

  private readonly headerRules = inject(HEADER_RULES, { optional: true }) ?? [];
  private readonly actionRules = inject(ACTION_RULES, { optional: true }) ?? [];

  readonly header = computed(() => {
    const ctx = buildJobCtx(this.type(), this.state());
    return decideWithCtx(ctx, this.headerRules, () => 'Unknown state');
  });

  readonly action = computed<PrimaryAction>(() => {
    const ctx = buildJobCtx(this.type(), this.state());
    return decideWithCtx(ctx, this.actionRules, NO_ACTION);
  });

  readonly trace = computed<string[]>(() => {
    const logs: string[] = [];
    const ctx = buildJobCtx(this.type(), this.state());
    decideWithCtx(ctx, this.headerRules, () => 'Unknown state', { collect: (m) => logs.push(JSON.stringify(m)) });
    decideWithCtx(ctx, this.actionRules, NO_ACTION, { collect: (m) => logs.push(JSON.stringify(m)) });
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