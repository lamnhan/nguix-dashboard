import { Component, OnInit } from '@angular/core';

import { UploadResult } from '../../services/storage/storage.service';

@Component({
  selector: 'nguix-dashboard-media-page',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaPage implements OnInit {
  showUploader = false;

  constructor() {}

  ngOnInit(): void {
  }

  uploadComplete(result: UploadResult) {
    console.log(result);
  }
}
