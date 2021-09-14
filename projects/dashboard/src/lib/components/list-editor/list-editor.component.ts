import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as Tagify from '@yaireo/tagify';

@Component({
  selector: 'nguix-dashboard-list-editor',
  templateUrl: './list-editor.component.html',
  styleUrls: ['./list-editor.component.scss']
})
export class ListEditorComponent implements OnInit, OnDestroy {  
  @Input() currentData: string[] = [];
  @Output() save = new EventEmitter<string[]>();

  @ViewChild('tagify') private set tagifyEl(ref: ElementRef) {
    setTimeout(() => {
      this.tagifyInstance = new Tagify(ref.nativeElement);
      this.tagifyInstance.addTags(this.currentData);
    }, 0);
  };

  private tagifyInstance!: Tagify;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.tagifyInstance.destroy();
  }

  onChanges() {
    this.save.emit(
      this.tagifyInstance
        .getCleanValue()
        .map(item => item.value)
    );
  }

}
