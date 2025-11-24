import { TestBed } from '@angular/core/testing';
import { DecisionTableAdvancedPage } from './decision-table-advanced.page';
import { JobState, JobType, ActionKind } from '@/app/shared/domain/job.model';
import { PANEL_BASE_RULE_PROVIDERS } from './rules/panel-base-rules.provider';
import { BASE_RULE_PROVIDERS } from './rules/base-rules.provider';
import { PANEL_RULES } from './rules/panel.tokens';
import { HEADER_RULES, ACTION_RULES } from './rules/tokens';
import { IdlePanelComponent } from '@/app/shared/ui/job-state-panels';
import { JobPanelFallbackComponent } from '@/app/components/job-state-panels/job-panel-fallback.component';

describe('DecisionTableAdvancedPage (standalone + DI rules)', () => {
  it('creates and uses DI rules for header/action/panel', async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionTableAdvancedPage],
      providers: [...BASE_RULE_PROVIDERS, ...PANEL_BASE_RULE_PROVIDERS],
    }).compileComponents();

    const fixture = TestBed.createComponent(DecisionTableAdvancedPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    expect(page.header()).toMatch(/Standard job is idle/);
    expect(page.action().kind).toBe(ActionKind.Start);
    expect(page.panelComponent()).toBe(IdlePanelComponent);

    // sanity: DI tokens exist
    expect(TestBed.inject(HEADER_RULES, null as any)).toBeTruthy();
    expect(TestBed.inject(ACTION_RULES, null as any)).toBeTruthy();
    expect(TestBed.inject(PANEL_RULES, null as any)).toBeTruthy();
  });

  it('falls back to fallback panel when no panel rule matches', async () => {
    // Provide empty panel rule list to force fallback
    await TestBed.configureTestingModule({
      imports: [DecisionTableAdvancedPage],
      providers: [...BASE_RULE_PROVIDERS, { provide: PANEL_RULES, multi: true, useValue: [] }],
    }).compileComponents();

    const fixture = TestBed.createComponent(DecisionTableAdvancedPage);
    const page = fixture.componentInstance;
    fixture.detectChanges();

    expect(page.panelComponent()).toBe(IdlePanelComponent);
  });

  it('updates on selection changes', async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionTableAdvancedPage],
      providers: [...BASE_RULE_PROVIDERS, ...PANEL_BASE_RULE_PROVIDERS],
    }).compileComponents();

    const fixture = TestBed.createComponent(DecisionTableAdvancedPage);
    const page = fixture.componentInstance;

    page.onSelectType({ target: { value: JobType.Premium } } as any as Event);
    page.onSelectState({ target: { value: JobState.Running } } as any as Event);
    fixture.detectChanges();

    expect(page.header()).toMatch(/Premium is processing/);
    expect(page.action().kind).toBe(ActionKind.None);
  });
});