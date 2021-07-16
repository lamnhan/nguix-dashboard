import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserPage } from './user.component';


@NgModule({
  declarations: [
    UserPage
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class NguixDashboardUserPageModule { }
