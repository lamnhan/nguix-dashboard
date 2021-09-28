import { NgModule } from '@angular/core';
import { NguixDashboardModule, DASHBOARD_CONFIG, dashboardConfig } from '@lamnhan/nguix-dashboard';

@NgModule({
  exports: [NguixDashboardModule],
  imports: [NguixDashboardModule],
  providers: [
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        parts: [
          'front',
          'option',
          'page',
          'post',
          'audio',
          'video',
          'bundle',
          'category',
          'tag',
          'media',
          'user',
        ],
        plugins: [
          // register genre type of category part
          dashboardService => {
            dashboardService.categoryPart.contentTypes.push(
              { text: 'Genre', value: 'genre', icon: `icon-dashboard-part-category` },
            );
          },
          // register search type for tag part
          dashboardService => {
            dashboardService.tagPart.contentTypes.push(
              { text: 'Search', value: 'search', icon: `icon-dashboard-part-tag` },
            );
          },
          // test
          dashboardService => {
            dashboardService.frontPart.menuItem.subItems?.push({
              text: 'Test menu',
              routerLink: []
            });
            dashboardService.postPart.contentTypes.push(
              { text: 'Foo', value: 'foo', icon: `icon-dashboard-part-post` },
            );
          },
        ],
        // allowDirectContent: true,
      }),
    }
  ]
})
export class AppDashboardModule {}
