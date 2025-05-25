import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-message" role="alert">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ message }}</span>
      </div>
      <button (click)="onClose()" class="close-button" type="button">✕</button>
    </div>
  `,
  styles: [`
    .error-message {
      background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .error-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
