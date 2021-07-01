import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardTranslationModule } from './dashboard-translation.module';

import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService, DASHBOARD_CONFIG, dashboardConfig } from './services/config/config.service';
import { DashboardService } from './services/dashboard/dashboard.service';

import { FrontPartService } from './parts/front/front.service';
import { CategoryPartService } from './parts/category/category.service';
import { TagPartService } from './parts/tag/tag.service';
import { PagePartService } from './parts/page/page.service';
import { PostPartService } from './parts/post/post.service';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    DashboardTranslationModule,
    NguixDashboardHeaderComponentModule
  ],
  providers: [
    // services
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        parts: [
          'post',
          'page',
        ]
      })
    },
    ConfigService,
    DashboardService,
    // parts
    FrontPartService,
    CategoryPartService,
    TagPartService,
    PagePartService,
    PostPartService,
  ],
  exports: [
    NguixDashboardHeaderComponentModule
  ]
})
export class NguixDashboardModule {}
