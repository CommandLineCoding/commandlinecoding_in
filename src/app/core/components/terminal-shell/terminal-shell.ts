/* src/app/core/components/terminal-shell/terminal-shell.ts */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import TopNav from '../top-nav/top-nav';
import SystemFooter from '../system-footer/system-footer';

@Component({
  selector: 'app-terminal-shell',
  standalone: true,
  imports: [RouterOutlet, TopNav, SystemFooter],
  templateUrl: './terminal-shell.html',
  styleUrl: './terminal-shell.scss',
})
export default class TerminalShell {}
