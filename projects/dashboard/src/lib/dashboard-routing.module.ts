import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'admin', pathMatch: 'full', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.NguixDashboardHomePageModule),
  },
  {
    path: 'admin/list/:part', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/list/list.module').then(m => m.NguixDashboardListPageModule),
  },
  {
    path: 'admin/new/:part', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  },
  {
    path: 'admin/edit/:part/:id', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
