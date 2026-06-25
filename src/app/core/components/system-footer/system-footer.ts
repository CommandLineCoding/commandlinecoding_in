/* src/app/core/components/system-footer/system-footer.ts */
import { Component, inject, viewChild, ElementRef } from '@angular/core';
import { TermService } from '../../services/term';

@Component({
  selector: 'app-system-footer',
  standalone: true,
  imports: [],
  templateUrl: './system-footer.html',
  styleUrl: './system-footer.scss'
})
export default class SystemFooter {
  term = inject(TermService);
  private logEnd = viewChild<ElementRef>('logEnd');

  // Track the user's position when cycling through command history
  private historyIdx = -1;

  onSend(inputEl: HTMLInputElement): void {
    const val = inputEl.value;
    if (!val.trim()) return;

    this.term.exec(val);
    inputEl.value = '';
    this.historyIdx = -1; // Reset history traversal tracking index

    setTimeout(() => {
      this.logEnd()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }

  // Intercepts structural keyboard entries before the DOM processes them
  onKeyDown(event: KeyboardEvent, inputEl: HTMLInputElement): void {
    const history = this.term.history;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      
      if (this.historyIdx === -1) {
        this.historyIdx = history.length - 1;
      } else if (this.historyIdx > 0) {
        this.historyIdx--;
      }
      inputEl.value = history[this.historyIdx];
    } 
    
    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIdx === -1) return;
      
      if (this.historyIdx < history.length - 1) {
        this.historyIdx++;
        inputEl.value = history[this.historyIdx];
      } else {
        this.historyIdx = -1;
        inputEl.value = ''; // Clear line if user returns to bottom
      }
    } 
    
    else if (event.key === 'Tab') {
      event.preventDefault(); // Stop native browser focus from switching panels
      const completed = this.term.suggest(inputEl.value);
      inputEl.value = completed;
    }
  }
}