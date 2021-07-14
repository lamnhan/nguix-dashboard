import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutPage } from './about.component';


@NgModule({
  declarations: [
    AboutPage
  ],
  imports: [
    CommonModule,
    AboutRoutingModule
  ]
})
export class NguixDashboardAboutPageModule { }
