import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxFilesizeModule } from 'ngx-filesize';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { ImageCropperComponentModule } from '../image-cropper/image-cropper.module';

import { UploaderComponent } from './uploader.component';

@NgModule({
  declarations: [UploaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    NgxFilesizeModule,
    RouterLinkDirectiveModule,
    ImageCropperComponentModule,
  ],
  exports: [UploaderComponent]
})
export class NguixDashboardUploaderComponentModule { }
