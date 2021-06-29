import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListPage } from './list.component';


@NgModule({
  declarations: [
    ListPage
  ],
  imports: [
    CommonModule,
    ListRoutingModule
  ]
})
export class NguixDashboardListPageModule { }
