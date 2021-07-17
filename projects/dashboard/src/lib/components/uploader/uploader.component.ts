import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StorageService, MediaItem } from '../../services/storage/storage.service';


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
export class UploaderComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() done = new EventEmitter<MediaItem>();

  tab: 'upload' | 'image' = 'upload';
  closeOnCompleted = false;
  options: any = {
    usageStatistics: false,
  };

  uploading?: Uploading;
  result?: MediaItem;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {}

  uploadFile(e: any) {
    const file = e.target.files[0];
    const {name, size} = file;
    const {fullPath, task} = this.storageService.uploadFile(name, file);
    // uploading
    this.uploading = {
      name,
      size,
      uploadPercent$: task.percentageChanges(),
    };
    // completed
    task.snapshotChanges().pipe(
      finalize(() => {
        this.result = this.storageService.buildMediaItem(name, fullPath);
        // done & close
        this.done.emit(this.result);
        if (this.closeOnCompleted) {
          this.close.emit();
        }
      })
    ).subscribe();
  }

}
