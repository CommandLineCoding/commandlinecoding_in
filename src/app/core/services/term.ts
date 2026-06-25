/* src/app/core/services/term.service.ts */
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  private router = inject(Router);

  // Core navigation vectors used for autocomplete matching
  private validPaths = ['home', 'projects', 'logs', 'network', 'protocols'];

  lines = signal<string[]>([
    'Mainframe system terminal active.',
    "Type 'help' to print the available command matrix."
  ]);

  // Tracks historical commands entered across the session lifecycle
  history: string[] = [];

  exec(raw: string): void {
    const input = raw.trim();
    if (!input) return;

    this.lines.update(l => [...l, `> ${raw}`]);
    this.history.push(raw);

    const args = input.toLowerCase().split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'help':
        this.lines.update(l => [
          ...l,
          'AVAILABLE SYSTEM OPERATIONS:',
          '  ls          - List all main navigation nodes',
          '  cd <dir>    - Change directories (e.g., cd projects, cd /)',
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
        this.handleNav(args[1]);
        break;

      case 'sysstat':
        this.lines.update(l => [
          ...l,
          'SYS_STATUS : OK',
          'UPTIME     : 99.9%',
          'ENGINE     : Angular 21 + Supabase Realtime',
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
    
    const plainCmds = ['help', 'clear', 'ls', 'sysstat'];
    const matchCmd = plainCmds.find(c => c.startsWith(tokens[0].toLowerCase()));
    if (matchCmd && tokens.length === 1) return matchCmd;

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
}