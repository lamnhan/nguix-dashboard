import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), pathMatch: 'full' },
  // guides
  { path: 'guides', loadChildren: () => import('./pages/guides/guides.module').then(m => m.GuidesPageModule) },
  { path: 'guide/:id', loadChildren: () => import('./pages/guide/guide.module').then(m => m.GuidePageModule) },
  // components
  { path: 'components', loadChildren: () => import('./pages/components/components.module').then(m => m.ComponentsPageModule) },
  // pages
  { path: 'pages', loadChildren: () => import('./pages/pages/pages.module').then(m => m.PagesPageModule) },
  // 404
  { path: '**', loadChildren: () => import('@lamnhan/nguix-starter').then(m => m.NguixOopsPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
