import { NgModule } from '@angular/core';
import { NguixDashboardModule, DASHBOARD_CONFIG } from '@lamnhan/nguix-dashboard';

@NgModule({
  exports: [NguixDashboardModule],
  imports: [],
  providers: [
    {
      provide: DASHBOARD_CONFIG,
      useValue: {}
    },
  ]
})
export class AppDashboardModule {}
