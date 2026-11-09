import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'catalogo', loadComponent: () => import('./catalogo/catalogo').then(m => m.Catalogo) },
  { path: 'producto/:id', loadComponent: () => import('./producto-detalle/producto-detalle').then(m => m.ProductoDetalle) },
  { path: 'productor/:id', loadComponent: () => import('./productor-perfil/productor-perfil').then(m => m.ProductorPerfil) },
  { path: 'dashboard-agricultor', loadComponent: () => import('./dashboard-agricultor/dashboard-agricultor').then(m => m.DashboardAgricultor) },
  { path: 'dashboard-comprador', loadComponent: () => import('./dashboard-comprador/dashboard-comprador').then(m => m.DashboardComprador) },
  { path: '**', redirectTo: '' }
];
