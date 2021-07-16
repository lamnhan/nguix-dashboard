import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

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

  list() {}

  get(path: string) {
    return this.service.ref(path);
  }

  uploadFile(path: string, file: File, custom: UploadCustom = {}) {
    const {folder, customMetadata = {} } = custom;
    const filePath =
      (folder || this.options.uploadFolder || this.defaultFolder) + '/' +
      (!this.options.dateGrouping ? '' : (this.getDateGroupingPath() + '/')) +
      path;
    const ref = this.get(filePath);
    const task = ref.put(file, { customMetadata });
    return { ref, task };
  }

  private getDateGroupingPath() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return year + '/' + (month >= 10 ? month : `0${month}`);
  }
}
