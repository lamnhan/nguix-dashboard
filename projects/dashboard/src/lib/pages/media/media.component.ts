import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';

import { UploaderComponent } from '../../components/uploader/uploader.component';

@Component({
  selector: 'nguix-dashboard-media-page',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaPage implements OnInit {

  constructor(private modalService: ModalDialogService, private viewRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  open() {
    this.modalService.openDialog(this.viewRef, {
      title: 'Upload',
      childComponent: UploaderComponent
    });
  }

}
