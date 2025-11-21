import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  signal,
} from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  /** Toggle state for the menu popover */
  readonly menuOpen = signal(false);

  /** Nav items (ensure these match your route paths) */
  readonly items = [
    { label: 'Anti-pattern', link: '/anti-pattern' },
    { label: 'Rule-based', link: '/rule-based' },
    { label: 'Improved Rule-based', link: '/rule-based-improved' },
    { label: 'FSM Alternative', link: '/fsm-alternative' },
  ] as const;

  constructor(private router: Router, private host: ElementRef<HTMLElement>) {
    // Close menu on navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu(ev: Event): void {
    ev.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  close(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    // Close when clicking outside the header area
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.menuOpen.set(false);
    }
  }
}