import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { NguixDashboardHeaderComponentModule } from './components/header/header.module';

import { ConfigService } from './services/config/config.service';
import { DashboardService } from './services/dashboard/dashboard.service';

import { CategoriesService } from './schematas/categories/categories.service';
import { TagsService } from './schematas/tags/tags.service';
import { PagesService } from './schematas/pages/pages.service';
import { PostsService } from './schematas/posts/posts.service';

@NgModule({
  declarations: [],
  imports: [
    DashboardRoutingModule,
    NguixDashboardHeaderComponentModule
  ],
  providers: [
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
