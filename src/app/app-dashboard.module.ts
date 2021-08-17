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
          // register genre type of category part
          dashboardService => {
            dashboardService.categoryPart.contentTypes.push(
              { text: 'Genre', value: 'genre', icon: `icon-dashboard-part-category` },
            );
          },
          // test
          dashboardService => {
            dashboardService.frontPart.menuItem.subItems?.push({
              text: 'Test menu',
              routerLink: []
            });
          },
        ],
        allowDirectContent: true,
      }),
    }
  ]
})
export class AppDashboardModule {}
