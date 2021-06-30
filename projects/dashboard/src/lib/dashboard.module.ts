import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTranslationModule } from './dashboard-translation.module';

import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService, DASHBOARD_CONFIG, dashboardConfig } from './services/config/config.service';
import { DashboardService } from './services/dashboard/dashboard.service';

import { CategoriesService } from './schematas/categories/categories.service';
import { TagsService } from './schematas/tags/tags.service';
import { PagesService } from './schematas/pages/pages.service';
import { PostsService } from './schematas/posts/posts.service';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    DashboardTranslationModule,
    NguixDashboardHeaderComponentModule
  ],
  providers: [
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        collections: [
          'posts',
          'pages',
        ]
      })
    },
    ConfigService,
    DashboardService,
    CategoriesService,
    TagsService,
    PagesService,
    PostsService,
  ],
  exports: [
    NguixDashboardHeaderComponentModule
  ]
})
export class NguixDashboardModule {}
