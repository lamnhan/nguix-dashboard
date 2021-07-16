import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaPage } from './media.component';


@NgModule({
  declarations: [
    MediaPage
  ],
  imports: [
    CommonModule,
    MediaRoutingModule
  ]
})
export class NguixDashboardMediaPageModule { }
