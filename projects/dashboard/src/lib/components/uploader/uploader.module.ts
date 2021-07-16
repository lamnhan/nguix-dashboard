import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { UploaderComponent } from './uploader.component';

@NgModule({
  declarations: [UploaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    RouterLinkDirectiveModule,
  ],
  exports: [UploaderComponent]
})
export class NguixDashboardUploaderComponentModule { }
