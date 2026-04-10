import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registros } from './pages/registros/registros';
import { Admin } from './pages/admin/admin';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminDetalle } from './pages/admin-detalle/admin-detalle';
import { Landing } from './pages/landing/landing';
export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'registros',
    component: Registros,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard], // 🔥 doble protección
  },
  {
    path: 'admin/usuario/:id',
    component: AdminDetalle,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
{ path: '', component: Landing },
];
