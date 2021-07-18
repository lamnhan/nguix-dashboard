import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

export interface MediaItem {
  ref: AngularFireStorageReference;
  name: string;
  type: 'image' | 'audio' | 'video' | 'document' | 'archive' | 'unknown';
  fullPath: string;
  downloadUrl$: Observable<string>;
  cachedDownloadUrl?: string;
  metadata$: Observable<any>;
  cachedMetadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private options: StorageOptions = {};
  private service!: VendorStorageService;
  driver = 'firebase';
  defaultFolder = 'app-content/uploads';

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

  ref(fullPath: string) {
    return this.service.ref(fullPath);
  }

  list(folder?: string) {
    return this.ref(this.getRootFolder(folder)).listAll();
  }

  delete(fullPath: string) {
    return this.ref(fullPath).delete();
  }

  uploadFile(path: string, file: File, custom: UploadCustom = {}) {
    const {folder, customMetadata = {} } = custom;
    const fullPath =
      (this.getRootFolder(folder)) + '/' +
      (!this.options.dateGrouping ? '' : (this.getDateGroupingPath() + '/')) +
      path;
    const task = this.ref(fullPath).put(file, { customMetadata });
    return { fullPath, task };
  }

  buildMediaItem(name: string, fullPath: string): MediaItem {
    const ref = this.ref(fullPath);
    return {
      ref,
      name,
      type: this.getFileType(name),
      fullPath,
      downloadUrl$: ref.getDownloadURL(),
      metadata$: ref.getMetadata(),
    };
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

  private getFileType(name: string) {
    const ext = name.split('.').pop() as string;
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'wma', 'm4a'];
    const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'mpg', 'mpeg', '3gp', 'mkv'];
    const documentTypes = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'html', 'csv', 'xml', 'json'];
    const archiveTypes = ['zip', 'rar', 'tar', 'gz', '7z', 'bz2'];
    return (imageTypes.indexOf(ext) > -1) ? 'image' :
    (audioTypes.indexOf(ext) > -1) ? 'audio' :
    (videoTypes.indexOf(ext) > -1) ? 'video' :
      (documentTypes.indexOf(ext) > -1) ? 'document' :
      (archiveTypes.indexOf(ext) > -1) ? 'archive' :
      'unknown';
  }
}
