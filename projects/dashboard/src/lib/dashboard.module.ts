import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { HeaderComponentModule } from './components/header/header.module';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    HeaderComponentModule
  ],
  exports: [
    HeaderComponentModule
  ]
})
export class NguixDashboardModule { }
