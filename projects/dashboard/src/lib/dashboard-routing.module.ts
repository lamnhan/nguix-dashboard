import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@lamnhan/ngx-useful';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    pathMatch: 'full',
    canLoad: [AdminGuard],
    canActivate: [AdminGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
