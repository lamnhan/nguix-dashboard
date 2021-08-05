import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';
import { NguixIconComponentModule, NguixContentComponentModule } from '@lamnhan/nguix-starter';

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
    NguixIconComponentModule,
    NguixContentComponentModule,
    LoginComponentModule,
    HomeRoutingModule
  ]
})
export class HomePageModule { }
