import { TestBed } from '@angular/core/testing';
import { BranchingPage } from './branching.page';
import { JobState, JobType, ActionKind } from '@/app/shared/domain/job.model';
import { IdlePanelComponent } from '@/app/shared/ui/job-state-panels';

describe('BranchingPage (standalone)', () => {
  it('creates and derives initial VM + panel', async () => {
    await TestBed.configureTestingModule({ imports: [BranchingPage] }).compileComponents();
    const fixture = TestBed.createComponent(BranchingPage);
    const page = fixture.componentInstance;

    fixture.detectChanges();

    expect(page.type()).toBe(JobType.Standard);
    expect(page.state()).toBe(JobState.Idle);

    const vm = page.vm();
    expect(vm.header).toContain('Standard job is idle');
    expect(vm.action.kind).toBe(ActionKind.Start);

    expect(page.panelComponent()).toBe(IdlePanelComponent);
  });

  it('updates VM when state/type changes via handlers', async () => {
    await TestBed.configureTestingModule({ imports: [BranchingPage] }).compileComponents();
    const fixture = TestBed.createComponent(BranchingPage);
    const page = fixture.componentInstance;

    page.onSelectType({ target: { value: JobType.Premium } } as any as Event);
    page.onSelectState({ target: { value: JobState.Running } } as any as Event);
    fixture.detectChanges();

    expect(page.type()).toBe(JobType.Premium);
    expect(page.state()).toBe(JobState.Running);
    expect(page.vm().header).toContain('Premium is processing');
  });
});