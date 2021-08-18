import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkDirectiveModule, O1iPipeModule } from '@lamnhan/ngx-useful';

import { NguixDashboardSpinnerComponentModule } from '../../components/spinner/spinner.module';

import { ListRoutingModule } from './list-routing.module';
import { ListPage } from './list.component';


@NgModule({
  declarations: [
    ListPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLinkDirectiveModule,
    O1iPipeModule,
    NguixDashboardSpinnerComponentModule,
    ListRoutingModule,
  ]
})
export class NguixDashboardListPageModule { }
