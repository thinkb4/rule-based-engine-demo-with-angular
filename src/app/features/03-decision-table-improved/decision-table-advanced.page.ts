import { ChangeDetectionStrategy, Component, computed, inject, signal, Type } from '@angular/core';
import { JOB_STATES, JOB_TYPES, JobState, JobType, PrimaryAction, NO_ACTION } from '@/app/shared/domain/job.model';
import { buildJobCtx } from '@/app/shared/domain/job.ctx';
import { decideWithCtx } from '@/app/shared/rules/decision-engine';
import { ACTION_RULES, HEADER_RULES } from './rules/tokens';
import { BASE_RULE_PROVIDERS } from './rules/base-rules.provider';
import { NgComponentOutlet } from '@angular/common';
import { PANEL_RULES } from './rules/panel.tokens';
import { PANEL_BASE_RULE_PROVIDERS } from './rules/panel-base-rules.provider';
import type { JobStatePanel } from '@/app/shared/ui/job-state-panels';

@Component({
  standalone: true,
  selector: 'app-decision-table-advanced-page',
  imports: [NgComponentOutlet],
  providers: [...BASE_RULE_PROVIDERS, ...PANEL_BASE_RULE_PROVIDERS],
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
  private readonly panelRules = inject(PANEL_RULES, { optional: true }) ?? [];

  readonly header = computed(() => decideWithCtx(buildJobCtx(this.type(), this.state()), this.headerRules, () => 'Unknown state'));
  readonly action = computed<PrimaryAction>(() => decideWithCtx(buildJobCtx(this.type(), this.state()), this.actionRules, NO_ACTION));
  readonly trace = computed<string[]>(() => {
    const logs: string[] = [];
    const ctx = buildJobCtx(this.type(), this.state());
    decideWithCtx(ctx, this.headerRules, () => 'Unknown state', { collect: (m) => logs.push(JSON.stringify(m)) });
    decideWithCtx(ctx, this.actionRules, NO_ACTION,           { collect: (m) => logs.push(JSON.stringify(m)) });
    decideWithCtx(ctx, this.panelRules,  () => null as any,    { collect: (m) => logs.push(JSON.stringify(m)) });
    return logs;
  });

  readonly panelComponent = computed<Type<JobStatePanel>>(
    () => decideWithCtx(buildJobCtx(this.type(), this.state()), this.panelRules, IdlePanelFallback)
  );

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }
  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}

/** fallback as a tiny inline component to keep imports minimal */
import { Component as Cmp, ChangeDetectionStrategy as CDS } from '@angular/core';
@Cmp({
  standalone: true,
  selector: 'app-job-panel-fallback',
  template: `<div class="panel">Fallback Panel</div>`,
  changeDetection: CDS.OnPush,
})
class IdlePanelFallback {}