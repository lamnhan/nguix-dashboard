import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';

// TODO: move this to @lamnhan/ngx-useful

export type VendorStorageService = AngularFireStorage;

export interface StorageOptions {
  driver?: string;
  uploadFolder?: string;
  dateGrouping?: boolean;
}

export interface UploadCustom {
  folder?: string;
  customMetadata?: Record<string, any>;
}

export interface UploadResult {
  path: string;
  ref: AngularFireStorageReference;
  downloadUrl: Observable<string>;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private options: StorageOptions = {};
  private service!: VendorStorageService;
  
  defaultFolder = 'app-content/uploads';
  driver = 'firebase';

  constructor() {}

  setOptions(options: StorageOptions) {
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    return this as StorageService;
  }

  init(vendorService: VendorStorageService) {
    this.service = vendorService;
    return this as StorageService;
  }

  ref(path: string) {
    return this.service.ref(path);
  }

  list(folder?: string) {
    return this.ref(this.getRootFolder(folder)).listAll();
  }

  uploadFile(path: string, file: File, custom: UploadCustom = {}) {
    const {folder, customMetadata = {} } = custom;
    const filePath =
      (this.getRootFolder(folder)) + '/' +
      (!this.options.dateGrouping ? '' : (this.getDateGroupingPath() + '/')) +
      path;
    const ref = this.ref(filePath);
    const task = ref.put(file, { customMetadata });
    return { path: filePath, ref, task };
  }

  private getRootFolder(folder?: string) {
    return folder || this.options.uploadFolder || this.defaultFolder;
  }

  private getDateGroupingPath() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return year + '/' + (month >= 10 ? month : `0${month}`);
  }
}
