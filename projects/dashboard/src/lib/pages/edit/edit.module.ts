import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { NguixDashboardJsonEditorComponentModule } from '../../components/json-editor/json-editor.module';
import { NguixDashboardLinkEditorComponentModule } from '../../components/link-editor/link-editor.module';
import { NguixDashboardHtmlEditorComponentModule } from '../../components/html-editor/html-editor.module';
import { NguixDashboardListEditorComponentModule } from '../../components/list-editor/list-editor.module';

import { NguixDashboardSpinnerComponentModule } from '../../components/spinner/spinner.module';
import { NguixDashboardUploaderComponentModule } from '../../components/uploader/uploader.module';

import { EditRoutingModule } from './edit-routing.module';
import { EditPage } from './edit.component';

@NgModule({
  declarations: [
    EditPage
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLinkDirectiveModule,
    NguixDashboardJsonEditorComponentModule,
    NguixDashboardLinkEditorComponentModule,
    NguixDashboardHtmlEditorComponentModule,
    NguixDashboardSpinnerComponentModule,
    NguixDashboardUploaderComponentModule,
    NguixDashboardListEditorComponentModule,
    EditRoutingModule
  ]
})
export class NguixDashboardEditPageModule { }
