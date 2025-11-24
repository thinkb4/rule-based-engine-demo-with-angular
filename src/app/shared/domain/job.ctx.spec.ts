import { buildJobCtx } from './job.ctx';
import { JobState, JobType } from './job.model';

describe('buildJobCtx', () => {
  it('composes raw fields and derived facts', () => {
    const ctx = buildJobCtx(JobType.Standard, JobState.Ready);
    expect(ctx.type).toBe(JobType.Standard);
    expect(ctx.state).toBe(JobState.Ready);
    expect(ctx.facts.isStandard).toBe(true);
    expect(ctx.facts.isReady).toBe(true);
  });
});