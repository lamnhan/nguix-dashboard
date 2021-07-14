import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLinkDirectiveModule, O1iPipeModule } from '@lamnhan/ngx-useful';

import { NguixDashboardTypeFilterPipeModule } from '../../pipes/type-filter/type-filter.module';
import { NguixDashboardQueryFilterPipeModule } from '../../pipes/query-filter/query-filter.module';
import { NguixDashboardStatusFilterPipeModule } from '../../pipes/status-filter/status-filter.module';
import { NguixDashboardExtractStatusesPipeModule } from '../../pipes/extract-statuses/extract-statuses.module';
import { NguixDashboardListingCounterPipeModule } from '../../pipes/listing-counter/listing-counter.module';

import { ListRoutingModule } from './list-routing.module';
import { ListPage } from './list.component';


@NgModule({
  declarations: [
    ListPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterLinkDirectiveModule,
    O1iPipeModule,
    NguixDashboardTypeFilterPipeModule,
    NguixDashboardQueryFilterPipeModule,
    NguixDashboardStatusFilterPipeModule,
    NguixDashboardExtractStatusesPipeModule,
    NguixDashboardListingCounterPipeModule,
    ListRoutingModule,
  ]
})
export class NguixDashboardListPageModule { }
