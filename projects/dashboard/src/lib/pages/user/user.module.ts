import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardUserRoleFilterPipeModule } from '../../pipes/user-role-filter/user-role-filter.module';
import { NguixDashboardUserExtractRolesPipeModule } from '../../pipes/user-extract-roles/user-extract-roles.module';
import { NguixDashboardUserGetRolePipeModule } from '../../pipes/user-get-role/user-get-role.module';

import { NguixDashboardSpinnerComponentModule } from '../../components/spinner/spinner.module';

import { UserRoutingModule } from './user-routing.module';
import { UserPage } from './user.component';

@NgModule({
  declarations: [
    UserPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLinkDirectiveModule,
    NguixDashboardUserRoleFilterPipeModule,
    NguixDashboardUserExtractRolesPipeModule,
    NguixDashboardUserGetRolePipeModule,
    NguixDashboardSpinnerComponentModule,
    UserRoutingModule,
  ]
})
export class NguixDashboardUserPageModule { }
