import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { MediaRoutingModule } from './media-routing.module';
import { MediaPage } from './media.component';


@NgModule({
  declarations: [
    MediaPage
  ],
  imports: [
    CommonModule,
    NguixDashboardUploaderComponentModule,
    MediaRoutingModule,
  ]
})
export class NguixDashboardMediaPageModule { }
