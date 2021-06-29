import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService } from './services/config/config.service';
import { DashboardService } from './services/dashboard/dashboard.service';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule
  ],
  providers: [
    ConfigService,
    DashboardService,
  ],
  exports: [
    NguixDashboardHeaderComponentModule
  ]
})
export class NguixDashboardModule {}
