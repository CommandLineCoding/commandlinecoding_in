/* src/app/core/services/term.service.ts */
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private router = inject(Router);
  private validPaths = ['home', 'projects', 'logs', 'network', 'protocols'];

  lines = signal<string[]>([
    'Mainframe system terminal active.',
    "Type 'help' to print the available command matrix."
  ]);

  history: string[] = [];

  exec(raw: string): void {
    const input = raw.trim();
    if (!input) return;

    this.lines.update(l => [...l, `> ${raw}`]);
    this.history.push(raw);

    const args = input.split(' ');
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        this.lines.update(l => [
          ...l,
          'AVAILABLE SYSTEM OPERATIONS:',
          '  ls          - List all main navigation nodes',
          '  cd <dir>    - Change directories (e.g., cd projects)',
          '  cat <id>    - Output contents of a technical log file (e.g., cat L01)',
          '  sysstat     - Echo live database/cluster metrics',
          '  clear       - Wipe terminal output history buffer'
        ]);
        break;

      case 'clear':
        this.lines.set([]);
        break;

      case 'ls':
        this.lines.update(l => [...l, 'home/   projects/   logs/   network/   protocols/']);
        break;

      case 'cd':
        this.handleNav(args[1]?.toLowerCase());
        break;

      case 'cat':
        this.handleCat(args[1]);
        break;

      case 'sysstat':
        this.lines.update(l => [
          ...l,
          'SYS_STATUS : OK',
          'UPTIME     : 99.9%',
          'ZONE       : Cloudflare Edge Network Node'
        ]);
        break;

      default:
        this.lines.update(l => [...l, `err: command fallback failed: '${cmd}' not recognized.`]);
    }
  }

  suggest(currentInput: string): string {
    const tokens = currentInput.trim().split(' ');
    if (tokens.length === 2 && tokens[0].toLowerCase() === 'cd') {
      const fragment = tokens[1].toLowerCase().replace(/^\//, '');
      const match = this.validPaths.find(p => p.startsWith(fragment));
      if (match) return `cd /${match}`;
    }
    return currentInput;
  }

  private handleNav(target: string): void {
    if (!target) {
      this.lines.update(l => [...l, 'err: target parameter omitted. Usage: cd <directory>']);
      return;
    }
    const dest = target.replace(/^\/|\/$/g, '');

    if (dest === 'home' || dest === '') {
      this.router.navigate(['/']);
      this.lines.update(l => [...l, 'Navigating to directory: ~/Home']);
    } else if (this.validPaths.includes(dest)) {
      this.router.navigate([`/${dest}`]);
      this.lines.update(l => [...l, `Navigating to directory: ~/${dest}`]);
    } else {
      this.lines.update(l => [...l, `err: directory slice not found: /${target}`]);
    }
  }

  private handleCat(targetId: string): void {
    if (!targetId) {
      this.lines.update(l => [...l, 'err: target file reference omitted. Usage: cat <log_id> (e.g., cat L01)']);
      return;
    }
    
    const fileId = targetId.toUpperCase();
    this.router.navigate([`/logs/${fileId}`]);
    this.lines.update(l => [...l, `Reading contents of object: /logs/${fileId}`]);
  }
}