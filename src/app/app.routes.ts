/* src/app/app.routes.ts */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/terminal-shell/terminal-shell'),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home')
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects')
      },
      {
        path: 'logs',
        loadComponent: () => import('./features/logs/logs')
      },
      {
        path: 'network',
        loadComponent: () => import('./features/network/network')
      },
      {
        path: 'protocols',
        loadComponent: () => import('./features/protocols/protocols')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];