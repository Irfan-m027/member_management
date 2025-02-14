// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'members',
        loadComponent: () => import('./components/members/members.component')
          .then(m => m.MembersComponent)
      },
    //   {
    //     path: 'alerts',
    //     loadComponent: () => import('./components/alerts/alerts.component')
    //       .then(m => m.AlertsComponent)
    //   },
    //   {
    //     path: 'cards',
    //     loadComponent: () => import('./components/cards/cards.component')
    //       .then(m => m.CardsComponent)
    //   },
    //   {
    //     path: 'forms',
    //     loadComponent: () => import('./components/forms/forms.component')
    //       .then(m => m.FormsComponent)
    //   },
    //   {
    //     path: 'typography',
    //     loadComponent: () => import('./components/typography/typography.component')
    //       .then(m => m.TypographyComponent)
    //   }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];