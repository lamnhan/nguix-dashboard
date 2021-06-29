import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'admin', pathMatch: 'full', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.NguixDashboardHomePageModule),
  },
  {
    path: 'admin/list/:collection', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/list/list.module').then(m => m.NguixDashboardListPageModule),
  },
  {
    path: 'admin/edit/:collection/:doc', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
