import { decideWithCtx, type Rule } from '@/app/shared/rules/decision-engine';
import { buildJobCtx } from '@/app/shared/domain/job.ctx';
import { JobState, JobType, ActionKind, NO_ACTION } from '@/app/shared/domain/job.model';
import { BASE_RULE_PROVIDERS } from './base-rules.provider';
import { HEADER_RULES, ACTION_RULES, type Ctx } from './tokens';

describe('BASE_RULE_PROVIDERS (integration via decideWithCtx)', () => {
  const headerRules = BASE_RULE_PROVIDERS
    .filter(p => (p as any).provide === HEADER_RULES)
    .map(p => (p as any).useValue) as Rule<Ctx, string>[];

  const actionRules = BASE_RULE_PROVIDERS
    .filter(p => (p as any).provide === ACTION_RULES)
    .map(p => (p as any).useValue) as Rule<Ctx, any>[];

  it('resolves header and action for typical contexts', () => {
    const ctx1 = buildJobCtx(JobType.Standard, JobState.Idle);
    expect(decideWithCtx(ctx1, headerRules, 'fb')).toMatch(/Standard job is idle/);
    expect(decideWithCtx(ctx1, actionRules, NO_ACTION).kind).toBe(ActionKind.Start);

    const ctx2 = buildJobCtx(JobType.Premium, JobState.Running);
    expect(decideWithCtx(ctx2, headerRules, 'fb')).toMatch(/Premium is processing/);
    expect(decideWithCtx(ctx2, actionRules, NO_ACTION).kind).toBe(ActionKind.None);
  });

  it('priorities make ready->view outrank others', () => {
    const ctx = buildJobCtx(JobType.Premium, JobState.Ready);
    const act = decideWithCtx(ctx, actionRules, NO_ACTION);
    expect(act.kind).toBe(ActionKind.View);
  });
});