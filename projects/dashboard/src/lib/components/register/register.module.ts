import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    RouterLinkDirectiveModule,
  ],
  exports: [RegisterComponent]
})
export class NguixDashboardRegisterComponentModule { }
