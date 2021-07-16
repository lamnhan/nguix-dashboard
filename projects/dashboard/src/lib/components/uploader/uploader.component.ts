import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AngularFireStorageReference } from '@angular/fire/storage';

import { StorageService } from '../../services/storage/storage.service';

interface FileInfo {
  name: string;
  size: number;
}

interface Uploading extends FileInfo {
  uploadPercent: Observable<undefined | number>;
}

interface Result extends FileInfo {
  ref: AngularFireStorageReference;
  downloadUrl: Observable<string>;
}

@Component({
  selector: 'nguix-dashboard-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() done = new EventEmitter<Result>();

  tab: 'upload' | 'image' = 'upload';
  closeOnCompleted = false;
  options: any = {
    usageStatistics: false,
  };

  uploading?: Uploading;
  result?: Result;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {}

  uploadFile(e: any) {
    const file = e.target.files[0];
    const {name, size} = file;
    const {ref, task} = this.storageService.uploadFile(name, file);
    this.uploading = {
      name,
      size,
      uploadPercent: task.percentageChanges(),
    };
    task.snapshotChanges().pipe(
      finalize(() => {
        this.result = {
          ref,
          name,
          size,
          downloadUrl: ref.getDownloadURL(),
        };
        this.done.emit(this.result);
      })
    ).subscribe();
  }

}
