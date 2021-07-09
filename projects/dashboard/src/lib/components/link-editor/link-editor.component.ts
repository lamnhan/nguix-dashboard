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

  @Output() save = new EventEmitter<any>();

  query = '';
  pageNo = 1;
  isEdit = false;
  selectedData: Record<string, any> = {};

  constructor() {}

  ngOnInit(): void {
    this.buildData();
  }
  
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
    this.selectedData = Object.keys(this.currentData || {})
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
