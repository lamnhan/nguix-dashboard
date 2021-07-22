import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { LoginComponentModule } from '../../components/login/login.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    LoginComponentModule,
    LoginRoutingModule,
  ]
})
export class LoginPageModule {}
