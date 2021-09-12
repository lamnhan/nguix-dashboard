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
import { ServerService } from './services/server/server.service';

import { FrontPartService } from './parts/front/front.service';
import { MediaPartService } from './parts/media/media.service';
import { UserPartService } from './parts/user/user.service';
import { CategoryPartService } from './parts/category/category.service';
import { TagPartService } from './parts/tag/tag.service';
import { PagePartService } from './parts/page/page.service';
import { PostPartService } from './parts/post/post.service';
import { OptionPartService } from './parts/option/option.service';
import { ProfilePartService } from './parts/profile/profile.service';
import { AudioPartService } from './parts/audio/audio.service';
import { VideoPartService } from './parts/video/video.service';
import { BundlePartService } from './parts/bundle/bundle.service';

import { DatabaseState } from './states/database/database.state';
import { MediaState } from './states/media/media.state';
import { UserState } from './states/user/user.state';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule,
    NgxsModule.forFeature([
      DatabaseState,
      MediaState,
      UserState,
    ]),
    ToastrModule.forRoot(),
  ],
  providers: [
    // services
    {
      provide: DASHBOARD_CONFIG,
      useValue: dashboardConfig({
        parts: [
          'front',
          'page',
          'post',
          'category',
          'tag',
          'media',
          'user',
        ]
      }),
    },
    ConfigService,
    SchemaService,
    DataService,
    DashboardService,
    ServerService,
    // parts
    FrontPartService,
    MediaPartService,
    UserPartService,
    CategoryPartService,
    TagPartService,
    PagePartService,
    PostPartService,
    OptionPartService,
    ProfilePartService,
    AudioPartService,
    VideoPartService,
    BundlePartService,
  ],
  exports: [
    NguixDashboardHeaderComponentModule
  ]
})
export class NguixDashboardModule {}
