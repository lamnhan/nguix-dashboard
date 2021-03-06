import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxFilesizeModule } from 'ngx-filesize';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardMediaTypeFilterPipeModule } from '../../pipes/media-type-filter/media-type-filter.module';
import { NguixDashboardMediaExtractTypesPipeModule } from '../../pipes/media-extract-types/media-extract-types.module';

import { NguixDashboardSpinnerComponentModule } from '../../components/spinner/spinner.module';
import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { MediaRoutingModule } from './media-routing.module';
import { MediaPage } from './media.component';

@NgModule({
  declarations: [
    MediaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgxFilesizeModule,
    RouterLinkDirectiveModule,
    NguixDashboardMediaTypeFilterPipeModule,
    NguixDashboardMediaExtractTypesPipeModule,
    NguixDashboardSpinnerComponentModule,
    NguixDashboardUploaderComponentModule,
    MediaRoutingModule,
  ]
})
export class NguixDashboardMediaPageModule { }
