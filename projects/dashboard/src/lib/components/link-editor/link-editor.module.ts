import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLinkDirectiveModule, O2aPipeModule } from '@lamnhan/ngx-useful';

import { LinkEditorComponent } from './link-editor.component';

@NgModule({
  declarations: [LinkEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    NgxPaginationModule,
    RouterLinkDirectiveModule,
    O2aPipeModule,
  ],
  exports: [LinkEditorComponent]
})
export class NguixDashboardLinkEditorComponentModule { }