import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { ToastrModule } from 'ngx-toastr';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService, DASHBOARD_CONFIG, dashboardConfig } from './services/config/config.service';
import { SchemaService } from './services/schema/schema.service';
import { DataService } from './services/data/data.service';
import { DashboardService } from './services/dashboard/dashboard.service';

import { FrontPartService } from './parts/front/front.service';
import { MediaPartService } from './parts/media/media.service';
import { UserPartService } from './parts/user/user.service';
import { CategoryPartService } from './parts/category/category.service';
import { TagPartService } from './parts/tag/tag.service';
import { PagePartService } from './parts/page/page.service';
import { PostPartService } from './parts/post/post.service';

import { DatabaseState } from './states/database/database.state';
import { MediaState } from './states/media/media.state';
import { UserState } from './states/user/user.state';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule,
    NgxsModule.forRoot(
      [
        DatabaseState,
        MediaState,
        UserState,
      ],
      { developmentMode: false }
    ),
    ToastrModule.forRoot(),
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
          'category',
          'tag',
          'media',
        ]
      }),
    },
    ConfigService,
    SchemaService,
    DataService,
    DashboardService,
    // parts
    FrontPartService,
    MediaPartService,
    UserPartService,
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
