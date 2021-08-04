import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { JsonEditorComponent } from './json-editor.component';

@NgModule({
  declarations: [JsonEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    RouterLinkDirectiveModule,
    NguixDashboardUploaderComponentModule,
  ],
  exports: [JsonEditorComponent]
})
export class NguixDashboardJsonEditorComponentModule { }
