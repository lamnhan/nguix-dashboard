import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule
  ],
  providers: [],
  exports: [
    NguixDashboardHeaderComponentModule
  ]
})
export class NguixDashboardModule {}
