import { TestBed } from '@angular/core/testing';
import { DecisionTablePage } from './decision-table.page';
import { JobState, JobType, ActionKind } from '@/app/shared/domain/job.model';
import { IdlePanelComponent } from '@/app/shared/ui/job-state-panels';

describe('DecisionTablePage (standalone)', () => {
  it('creates and derives initial VM + panel', async () => {
    await TestBed.configureTestingModule({ imports: [DecisionTablePage] }).compileComponents();
    const fixture = TestBed.createComponent(DecisionTablePage);
    const page = fixture.componentInstance;

    fixture.detectChanges();

    expect(page.type()).toBe(JobType.Standard);
    expect(page.state()).toBe(JobState.Idle);
    expect(page.vm().action.kind).toBe(ActionKind.Start);
    expect(page.panelComponent()).toBe(IdlePanelComponent);
  });

  it('updates via handlers', async () => {
    await TestBed.configureTestingModule({ imports: [DecisionTablePage] }).compileComponents();
    const fixture = TestBed.createComponent(DecisionTablePage);
    const page = fixture.componentInstance;

    page.onSelectType({ target: { value: JobType.Premium } } as any as Event);
    page.onSelectState({ target: { value: JobState.Ready } } as any as Event);
    fixture.detectChanges();

    expect(page.vm().action.kind).toBe(ActionKind.View);
  });
});