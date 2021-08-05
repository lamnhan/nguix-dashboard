import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineGuard, DashboardGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'app-admin',
    pathMatch: 'full',
    canLoad: [OnlineGuard, DashboardGuard],
    canActivate: [OnlineGuard, DashboardGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.NguixDashboardHomePageModule),
  },
  {
    path: 'app-admin/about',
    canLoad: [OnlineGuard, DashboardGuard],
    canActivate: [OnlineGuard, DashboardGuard],
    loadChildren: () => import('./pages/about/about.module').then(m => m.NguixDashboardAboutPageModule),
  },
  {
    path: 'app-admin/media', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/media/media.module').then(m => m.NguixDashboardMediaPageModule)
  },
  {
    path: 'app-admin/user', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/user/user.module').then(m => m.NguixDashboardUserPageModule)
  },
  {
    path: 'app-admin/list/:part', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/list/list.module').then(m => m.NguixDashboardListPageModule),
  },
  {
    path: 'app-admin/new/:part', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  },
  {
    path: 'app-admin/edit/:part/:id', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  },
  {
    path: 'app-admin/copy/:part/:id', canLoad: [DashboardGuard], canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
    data: {copy: true},
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
