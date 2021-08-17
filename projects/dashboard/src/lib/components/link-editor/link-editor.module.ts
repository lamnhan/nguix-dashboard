import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLinkDirectiveModule, O2aPipeModule } from '@lamnhan/ngx-useful';

import { NguixDashboardSpinnerComponentModule } from '../spinner/spinner.module';

import { LinkEditorComponent } from './link-editor.component';

@NgModule({
  declarations: [LinkEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    RouterLinkDirectiveModule,
    O2aPipeModule,
    NguixDashboardSpinnerComponentModule,
  ],
  exports: [LinkEditorComponent]
})
export class NguixDashboardLinkEditorComponentModule { }
