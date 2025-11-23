import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('App routes', () => {
  it('navigates to /anti-pattern page', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/anti-pattern');
    const el = harness.routeNativeElement as HTMLElement;
    expect(el.textContent).toContain('Anti-pattern: branching hellNested');
  });
});