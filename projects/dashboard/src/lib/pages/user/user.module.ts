import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardUserRoleFilterPipeModule } from '../../pipes/user-role-filter/user-role-filter.module';
import { NguixDashboardUserQueryFilterPipeModule } from '../../pipes/user-query-filter/user-query-filter.module';
import { NguixDashboardUserExtractRolesPipeModule } from '../../pipes/user-extract-roles/user-extract-roles.module';
import { NguixDashboardUserGetRolePipeModule } from '../../pipes/user-get-role/user-get-role.module';

import { UserRoutingModule } from './user-routing.module';
import { UserPage } from './user.component';

@NgModule({
  declarations: [
    UserPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    RouterLinkDirectiveModule,
    NguixDashboardUserRoleFilterPipeModule,
    NguixDashboardUserQueryFilterPipeModule,
    NguixDashboardUserExtractRolesPipeModule,
    NguixDashboardUserGetRolePipeModule,
    UserRoutingModule,
  ]
})
export class NguixDashboardUserPageModule { }
