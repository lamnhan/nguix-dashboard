import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaPage } from './media.component';

const routes: Routes = [{ path: '', component: MediaPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
