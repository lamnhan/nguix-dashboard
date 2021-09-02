import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineGuard, DashboardGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'app-dashboard',
    pathMatch: 'full',
    canLoad: [OnlineGuard, DashboardGuard],
    canActivate: [OnlineGuard, DashboardGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.NguixDashboardHomePageModule),
  },
  {
    path: 'app-dashboard/about',
    canLoad: [OnlineGuard, DashboardGuard],
    canActivate: [OnlineGuard, DashboardGuard],
    loadChildren: () => import('./pages/about/about.module').then(m => m.NguixDashboardAboutPageModule),
  },
  {
    path: 'app-dashboard/media',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/media/media.module').then(m => m.NguixDashboardMediaPageModule)
  },
  {
    path: 'app-dashboard/user',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/user/user.module').then(m => m.NguixDashboardUserPageModule)
  },
  {
    path: 'app-dashboard/list/:part',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/list/list.module').then(m => m.NguixDashboardListPageModule),
  },
  {
    path: 'app-dashboard/new/:part',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  },
  {
    path: 'app-dashboard/edit/:part/:id',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
  },
  {
    path: 'app-dashboard/copy/:part/:id',
    canLoad: [DashboardGuard],
    canActivate: [DashboardGuard],
    loadChildren: () => import('./pages/edit/edit.module').then(m => m.NguixDashboardEditPageModule),
    data: {copy: true},
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
