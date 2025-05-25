import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-spinner" [class]="size">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: inline-block;
    }

    .small .spinner { width: 16px; height: 16px; border-width: 2px; }
    .medium .spinner { width: 24px; height: 24px; border-width: 3px; }
    .large .spinner { width: 32px; height: 32px; border-width: 4px; }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid #4facfe;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
