import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { EditRoutingModule } from './edit-routing.module';
import { EditPage } from './edit.component';


@NgModule({
  declarations: [
    EditPage
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLinkDirectiveModule,
    EditRoutingModule
  ]
})
export class NguixDashboardEditPageModule { }
