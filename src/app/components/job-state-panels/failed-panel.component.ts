import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-job-panel-failed',
  template: `<div class="panel failed">🟥 Failed Panel — something went wrong</div>`,
  styles: [`
    .panel { padding: 12px; border-radius: 8px; border: 1px solid #ddd; }
    .failed { background: #ffe6e6; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailedPanelComponent {}