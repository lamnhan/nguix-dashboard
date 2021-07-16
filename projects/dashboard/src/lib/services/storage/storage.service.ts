import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

// TODO: move this to @lamnhan/ngx-useful

export type VendorStorageService = AngularFireStorage;

export interface StorageOptions {
  driver?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private options: StorageOptions = {};
  private service!: VendorStorageService;
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

  get(path: string) {
    return this.service.ref(path);
  }

  upload(e: any, path: string) {
    return this.get(path).put(e.target.files[0]);
  }
}
