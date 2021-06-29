import { NgModule } from '@angular/core';
import { NguixDashboardModule, DASHBOARD_CONFIG, dashboardConfig } from '@lamnhan/nguix-dashboard';

@NgModule({
  exports: [NguixDashboardModule],
  imports: [],
  providers: [
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        collections: [
          'categories',
          'tags',
          'pages',
          'posts',
        ]
      })
    },
  ]
})
export class AppDashboardModule {}
