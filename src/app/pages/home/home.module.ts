import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './home.component';

import { LoginComponentModule } from '../../components/login/login.module';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    LoginComponentModule,
    HomeRoutingModule
  ]
})
export class HomePageModule { }
