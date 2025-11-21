import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('App routes', () => {
  it('navigates to /with-strategy page', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();

    // Option A: use the route's native element directly
    await harness.navigateByUrl('/with-strategy');
    const el = harness.routeNativeElement as HTMLElement;
    expect(el.textContent).toContain('Part 2 — With Strategy');

    // Option B (alternative): get the fixture and cast if you prefer
    // const fixture = (await harness.navigateByUrl('/with-strategy')) as ComponentFixture<unknown>;
    // const el = fixture.nativeElement as HTMLElement;
    // expect(el.textContent).toContain('Part 2 — With Strategy');
  });
});