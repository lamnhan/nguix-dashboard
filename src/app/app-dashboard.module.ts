import { NgModule } from '@angular/core';
import { NguixDashboardModule, DASHBOARD_CONFIG, dashboardConfig } from '@lamnhan/nguix-dashboard';

@NgModule({
  exports: [NguixDashboardModule],
  imports: [],
  providers: [
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        parts: [
          'front',
          'post',
          'page',
          'category',
          'tag',
          'media',
          'user'
        ],
        plugins: [
          dashboardService => {
            dashboardService.frontPart.menuItem.subItems?.push({
              text: 'Test menu',
              routerLink: []
            });
          },
          dashboardService => {
            dashboardService.pagePart.dataTypes.push({text: 'Test', value: 'test'});
          },
        ],
        directContent: true,
      }),
    }
  ]
})
export class AppDashboardModule {}
