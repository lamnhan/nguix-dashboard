import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { RegisterComponentModule } from '../../components/register/register.module';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    RegisterComponentModule,
    RegisterRoutingModule,
  ]
})
export class RegisterPageModule {}
