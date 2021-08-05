import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StorageService, StorageItem } from '@lamnhan/ngx-useful';

import { ImageCropping } from '../../services/config/config.service';
import { AddUpload } from '../../states/media/media.state';

interface Uploading {
  name: string;
  size: number;
  uploadPercent$: Observable<undefined | number>;
}

@Component({
  selector: 'nguix-dashboard-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() closeOnCompleted = false;
  @Input() withLibrary = false;
  @Input() imageCropping?: ImageCropping;
  @Output() close = new EventEmitter<void>();
  @Output() done = new EventEmitter<StorageItem>();

  // uploader
  tab: 'library' | 'upload' | 'editor' = this.withLibrary ? 'library' : 'upload';
  selectedFile?: File;
  uploading?: Uploading;
  uploadResult?: StorageItem;
  cropResult?: Blob;

  // editor
  imageEditorOptions: any = {
    usageStatistics: false,
  };

  // cropper
  enforceCroppingSize = true;
  fileDataUrl?: string;
  cropperOptions!: Croppie.CroppieOptions;
  cropperResultOptions!: Croppie.ResultOptions;

  constructor(
    private store: Store,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {}
  
  ngOnChanges() {
    // default cropping size (no enforcement)
    if (!this.imageCropping) {
      this.imageCropping = { width: 500, height: 500 };
      this.enforceCroppingSize = false;
    }
    // calculate cropper data
    this.setCropperData();
  }

  croppingWidthChanges(e: any) {
    (this.imageCropping as ImageCropping).width = e.target.value;
    // calculate cropper data
    this.setCropperData();
  }

  croppingHeightChanges(e: any) {
    (this.imageCropping as ImageCropping).height = e.target.value;
    // calculate cropper data
    this.setCropperData();
  }

  selectFile(e: any) {
    const file = e.target.files[0] as File;
    const { name: path, size } = file;
    if (file) {
      this.selectedFile = file;
      if (['image/jpeg', 'image/png'].indexOf(file.type) !== -1) {
        this.storageService.readFileDataUrl(e.target.files[0])
        .subscribe(dataUrl => {
          this.fileDataUrl = dataUrl;
        });
      } else {
        this.upload(file, path, size);
      }
      e.target.value = null;
    }
  }

  doneCropping() {
    if (this.selectedFile && this.cropResult) {
      this.storageService
        .compressImage(this.cropResult)
        .subscribe(data => {
          const { name: path, size } = (this.selectedFile as File);
          this.upload(data, path, size);
        });
      // reset
      this.fileDataUrl = undefined;
      this.cropResult = undefined;
    }
  }

  upload(data: File | Blob, path: string, size: number) {
    const {name, fullPath, task} = this.storageService.upload(path, data);
    // uploading
    this.uploading = {
      name,
      size,
      uploadPercent$: task.percentageChanges(),
    };
    // completed
    task.snapshotChanges().pipe(
      finalize(() => {
        this.uploadResult = this.storageService.buildStorageItem(fullPath);
        // emit event
        this.done.emit(this.uploadResult);
        // update state
        this.store.dispatch(new AddUpload(this.uploadResult));
        // close modal
        if (this.closeOnCompleted) {
          this.closeAndReset();
        }
      })
    ).subscribe();
  }

  closeAndReset() {
    this.selectedFile = undefined;
    this.uploading = undefined;
    this.uploadResult = undefined;
    this.close.emit();
  }

  private setCropperData() {
    const { width: resultWidth, height: resultHeight } = this.imageCropping as ImageCropping;
    const ratio = resultWidth / resultHeight;
    const width = 250;
    const height = width / ratio;
    this.cropperOptions = {
      viewport: {
        width,
        height,
      },
      boundary: {
        width,
        height,
      },
      showZoomer: true,
    };
    this.cropperResultOptions = {
      size: {
        width: resultWidth,
        height: resultHeight,
      }
    };
  }
}
