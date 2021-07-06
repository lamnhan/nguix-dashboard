import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService, DASHBOARD_CONFIG, dashboardConfig } from './services/config/config.service';
import { SchemaService } from './services/schema/schema.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { FrontPartService } from './parts/front/front.service';
import { CategoryPartService } from './parts/category/category.service';
import { TagPartService } from './parts/tag/tag.service';
import { PagePartService } from './parts/page/page.service';
import { PostPartService } from './parts/post/post.service';

import { DatabaseState } from './states/database.state';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule,
    NgxsModule.forRoot([DatabaseState], {developmentMode: false}),
  ],
  providers: [
    // services
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        parts: [
          'front',
          'post',
          'page',
        ]
      })
    },
    ConfigService,
    SchemaService,
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
