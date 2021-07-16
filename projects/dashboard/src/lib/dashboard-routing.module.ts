import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'admin', pathMatch: 'full', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.NguixDashboardHomePageModule),
  },
  {
    path: 'admin/about', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/about/about.module').then(m => m.NguixDashboardAboutPageModule),
  },
  {
    path: 'admin/media', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/media/media.module').then(m => m.NguixDashboardMediaPageModule)
  },
  {
    path: 'admin/user', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/user/user.module').then(m => m.NguixDashboardUserPageModule)
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
  },
  {
    path: 'admin/copy/:part/:id', canLoad: [AdminGuard], canActivate: [AdminGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
    data: {copy: true},
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
