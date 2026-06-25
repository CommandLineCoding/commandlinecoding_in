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

    let commandPart = input;
    let grepFilter: string | null = null;

    if (input.includes('|')) {
      const segments = input.split('|');
      commandPart = segments[0].trim();
      
      const modifier = segments[1].trim();
      if (modifier.toLowerCase().startsWith('grep ')) {
        grepFilter = modifier.substring(5).trim();
      }
    }

    const args = commandPart.split(' ');
    const cmd = args[0].toLowerCase();
    let producedLines: string[] = [];

    switch (cmd) {
      case 'help':
        producedLines = [
          'AVAILABLE SYSTEM OPERATIONS:',
          '  ls          - List all main navigation nodes',
          '  cd <dir>    - Change directories (e.g., cd projects)',
          '  cat <id>    - Output contents of a technical log file (e.g., cat L01)',
          '  sysstat     - Echo live database/cluster metrics',
          '  clear       - Wipe terminal output history buffer',
          'PIPELINE OPERATORS ALLOWED:',
          '  <command> | grep <string> - Filter console rows matching specific patterns'
        ];
        break;

      case 'clear':
        this.lines.set([]);
        return;

      case 'ls':
        producedLines = ['home/', 'projects/', 'logs/', 'network/', 'protocols/'];
        break;

      case 'cd':
        this.handleNav(args[1]?.toLowerCase());
        return;

      case 'cat':
        this.handleCat(args[1]);
        return;

      case 'sysstat':
        producedLines = [
          'SYS_STATUS : OK',
          'UPTIME     : 99.9%',
          'ENGINE     : Angular 18 + Supabase Realtime',
          'ZONE       : Cloudflare Edge Network Node'
        ];
        break;

      default:
        producedLines = [`err: command fallback failed: '${cmd}' not recognized.`];
    }

    if (grepFilter) {
      const matchTerm = grepFilter.toLowerCase();
      const initialCount = producedLines.length;
      
      producedLines = producedLines.filter(line => 
        line.toLowerCase().includes(matchTerm)
      );

      if (producedLines.length === 0) {
        producedLines.push(`[sys: grep evaluated ${initialCount} lines - 0 matching tokens found for '${grepFilter}']`);
      }
    }
 
    this.lines.update(l => [...l, ...producedLines]);
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