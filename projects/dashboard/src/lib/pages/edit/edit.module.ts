import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { EditPage } from './edit.component';


@NgModule({
  declarations: [
    EditPage
  ],
  imports: [
    CommonModule,
    EditRoutingModule
  ]
})
export class NguixDashboardEditPageModule { }
