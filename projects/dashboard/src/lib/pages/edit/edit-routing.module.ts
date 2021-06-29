import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPage } from './edit.component';

const routes: Routes = [{ path: '', component: EditPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
