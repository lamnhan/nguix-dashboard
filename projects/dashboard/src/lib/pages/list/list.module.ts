import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardQueryFilterPipeModule } from '../../pipes/query-filter/query-filter.module';
import { NguixDashboardStatusFilterPipeModule } from '../../pipes/status-filter/status-filter.module';
import { NguixDashboardExtractStatusesPipeModule } from '../../pipes/extract-statuses/extract-statuses.module';

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
    NguixDashboardQueryFilterPipeModule,
    NguixDashboardStatusFilterPipeModule,
    NguixDashboardExtractStatusesPipeModule,
    ListRoutingModule,
  ]
})
export class NguixDashboardListPageModule { }
