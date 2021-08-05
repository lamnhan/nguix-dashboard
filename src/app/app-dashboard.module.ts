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
          'user',
          'option',
          'audio',
          'video',
          'bundle',
        ],
        plugins: [
          dashboardService => {
            dashboardService.frontPart.menuItem.subItems?.push({
              text: 'Test menu',
              routerLink: []
            });
          },
          dashboardService => {
            dashboardService.pagePart.contentTypes.push({text: 'Test', value: 'test'});
          },
        ],
        allowDirectContent: true,
      }),
    }
  ]
})
export class AppDashboardModule {}
