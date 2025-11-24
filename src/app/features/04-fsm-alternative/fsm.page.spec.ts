import { TestBed } from '@angular/core/testing';
import { FsmPage } from './fsm.page';
import { JobState, JobType } from '@/app/shared/domain/job.model';
import { FsmEvent } from './fsm/config';
import { RunningPanelComponent } from '@/app/shared/ui/job-state-panels';

describe('FsmPage (standalone)', () => {
  it('creates and supports legal transitions', async () => {
    await TestBed.configureTestingModule({ imports: [FsmPage] }).compileComponents();
    const fixture = TestBed.createComponent(FsmPage);
    const page = fixture.componentInstance;

    fixture.detectChanges();

    // start from idle/standard
    expect(page.state()).toBe(JobState.Idle);
    expect(page.type()).toBe(JobType.Standard);

    // start -> running
    expect(page.can(FsmEvent.Start)).toBe(true);
    page.dispatch(FsmEvent.Start);
    expect(page.state()).toBe(JobState.Running);

    // running -> fail
    expect(page.can(FsmEvent.Fail)).toBe(true);
    page.dispatch(FsmEvent.Fail);
    expect(page.state()).toBe(JobState.Failed);
  });

  it('selects panel by current state', async () => {
    await TestBed.configureTestingModule({ imports: [FsmPage] }).compileComponents();
    const fixture = TestBed.createComponent(FsmPage);
    const page = fixture.componentInstance;

    page.dispatch(FsmEvent.Start); // idle -> running
    fixture.detectChanges();

    expect(page.panelComponent()).toBe(RunningPanelComponent);
  });
});