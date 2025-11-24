import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Tiny presentational fallback panel used by the improved rules view.
 * It exists so the demo can render *something* even if no panel rule matches.
 * 
 * Kept intentionally simple: no inputs, no logic, standalone.
 * The container page provides the `.panel` class styling.
 */
@Component({
  standalone: true,
  selector: 'app-job-panel-fallback',
  template: `<div class="panel">Fallback Panel</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobPanelFallbackComponent {}