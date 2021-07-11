import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardPart } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss'],
})
export class LinkEditorComponent implements OnInit, OnChanges {
  @Input() part!: DashboardPart;
  @Input() items$!: Observable<any[]>;
  @Input() keys?: string[];
  @Input() currentData?: Record<string, any>;
  @Input() locale!: string;

  @Output() save = new EventEmitter<any>();
  
  isEdit = false;
  hasData = false;
  selectedData: Record<string, any> = {};

  query = '';
  isAnyLocale = false;
  isAnyStatus = false;
  pageNo = 1;

  constructor() {}

  ngOnInit(): void {}
  
  ngOnChanges(): void {
    this.buildData();
  }

  toggleItem(item: any, e: any) {
    const id = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      this.selectedData[id] = (['id', 'title'].concat(this.keys || []))
        .map(key => ({key, value: item[key]}))
        .reduce(
          (result, item) => {
            result[item.key] = item.value;
            return result;
          },
          {} as any,
        );
    } else {
      delete this.selectedData[id];
    }
  }

  submit() {
    // event
    this.save.emit(this.selectedData);
    // exit
    this.isEdit = false;
  }

  private buildData() {
    const currentDataKeys = Object.keys(this.currentData || {});
    this.hasData = !!currentDataKeys.length;
    this.selectedData = currentDataKeys
      .map(key => ({...(this.currentData as any)[key]}))
      .reduce(
        (result, item) => {
          result[item.id] = { ...item };
          return result;
        },
        {} as any,
      );
  }

}
