import { Component, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as Tagify from '@yaireo/tagify';

@Component({
  selector: 'nguix-dashboard-list-editor',
  templateUrl: './list-editor.component.html',
  styleUrls: ['./list-editor.component.scss']
})
export class ListEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tagify') private tagifyEl!: ElementRef;

  @Input() currentData: string[] = [];
  @Output() save = new EventEmitter<string[]>();

  private tagifyInstance!: Tagify;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.tagifyInstance = new Tagify(this.tagifyEl.nativeElement);
    this.tagifyInstance.addTags(this.currentData);
  }

  ngOnDestroy() {
    this.tagifyInstance.destroy();
  }

  change() {
    this.save.emit(
      this.tagifyInstance
        .getCleanValue()
        .map(item => item.value)
    );
  }

}
