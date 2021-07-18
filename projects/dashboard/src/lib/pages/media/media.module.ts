import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { NguixDashboardMediaTypeFilterPipeModule } from '../../pipes/media-type-filter/media-type-filter.module';
import { NguixDashboardMediaQueryFilterPipeModule } from '../../pipes/media-query-filter/media-query-filter.module';
import { NguixDashboardMediaExtractTypesPipeModule } from '../../pipes/media-extract-types/media-extract-types.module';
import { NguixDashboardMediaListingCounterPipeModule } from '../../pipes/media-listing-counter/media-listing-counter.module';

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
    RouterLinkDirectiveModule,
    NguixDashboardMediaTypeFilterPipeModule,
    NguixDashboardMediaQueryFilterPipeModule,
    NguixDashboardMediaExtractTypesPipeModule,
    NguixDashboardMediaListingCounterPipeModule,
    NguixDashboardUploaderComponentModule,
    MediaRoutingModule,
  ]
})
export class NguixDashboardMediaPageModule { }