/* src/app/app.routes.ts */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/terminal-shell/terminal-shell'),
    children: [
      {
        path: '',
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
        path: 'logs/:id', // Dynamic log entry view vector
        loadComponent: () => import('./features/log-detail/log-detail')
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
    redirectTo: ''
  }
];