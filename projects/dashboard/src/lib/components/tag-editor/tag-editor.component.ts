import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatabaseData } from '@lamnhan/ngx-useful';
import * as Tagify from '@yaireo/tagify';

import { DashboardPart, DatabaseItem } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-tag-editor',
  templateUrl: './tag-editor.component.html',
  styleUrls: ['./tag-editor.component.scss']
})
export class TagEditorComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() currentData?: Record<string, any>;
  @Input() sourcePart!: DashboardPart;
  @Input() destinationPart!: DashboardPart;
  @Input() preload?: number;
  @Input() activeLocale!: string;
  @Input() activeType!: string;
  @Input() typeFilter?: Record<string, string>;

  @Output() save = new EventEmitter<string[]>();

  @ViewChild('tagify') private set tagifyEl(ref: ElementRef) {
    setTimeout(() => {
      this.tagifyInstance = new Tagify(ref.nativeElement);
      this.tagifyInstance.addTags([]);
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
