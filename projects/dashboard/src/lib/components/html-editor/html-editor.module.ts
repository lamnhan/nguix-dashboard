import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxTinymceModule } from 'ngx-tinymce';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { HtmlEditorComponent } from './html-editor.component';

@NgModule({
  declarations: [HtmlEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.8.2/'
    }),
    RouterLinkDirectiveModule,
  ],
  exports: [HtmlEditorComponent]
})
export class NguixDashboardHtmlEditorComponentModule { }
