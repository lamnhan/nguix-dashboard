import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDialogModule } from 'ngx-modal-dialog';

import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { MediaRoutingModule } from './media-routing.module';
import { MediaPage } from './media.component';


@NgModule({
  declarations: [
    MediaPage
  ],
  imports: [
    CommonModule,
    ModalDialogModule.forRoot(),
    NguixDashboardUploaderComponentModule,
    MediaRoutingModule,
  ]
})
export class NguixDashboardMediaPageModule { }
