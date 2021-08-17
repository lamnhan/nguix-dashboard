import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardPart } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss'],
})
export class LinkEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() part!: DashboardPart;
  @Input() fields!: string[];
  @Input() contentType!: string;
  @Input() contentLocale!: string;
  @Input() currentData?: Record<string, any>;
  @Input() preload?: number;

  @Output() save = new EventEmitter<any>();

  isEdit = false;
  hasData = false;
  selectedData: Record<string, any> = {};

  query = '';
  isLoading: boolean = false;
  items: any[] = [];
  preloadSubscription?: Subscription;
  searchingSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {}
  
  ngOnChanges(): void {
    // preload items
    if (this.preload && this.part?.dataService) {
      if (this.preloadSubscription) {
        this.preloadSubscription.unsubscribe();
      }
      this.preloadSubscription = this.part.dataService
        .getCollection(
          ref => {
            let query = ref.where('type', '==', this.contentType);
            if (!this.part.noI18n) {
              query = query.where('locale', '==', this.contentLocale);
            }
            return query.limit(this.preload as number);
          },
          {
            name: `Preload linking: part=${this.part.name} type=${this.contentType} locale=${this.contentLocale}`,
          }
        )
        .subscribe(items => {
          this.items = items;
        });
    }
    // process current data
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

  ngOnDestroy() {
    if (this.preloadSubscription) {
      this.preloadSubscription.unsubscribe();
    }
    if (this.searchingSubscription) {
      this.searchingSubscription.unsubscribe();
    }
  }

  search() {
    if (this.part?.dataService) {
      this.isLoading = true;
      if (this.searchingSubscription) {
        this.searchingSubscription.unsubscribe();
      }
      this.searchingSubscription = this.part.dataService.setupSearching().pipe(
        switchMap(() =>
          (this.part.dataService as DatabaseData<any>)
          .search(this.query, 5, this.contentType === 'default' ? undefined : this.contentType)
            .list()
        ),
      )
      .subscribe(items => {
        this.isLoading = false;
        this.items = items;
      });
    }
  }

  toggleItem(item: any, e: any) {
    const id = e.target.value;
    const checked = e.target.checked;
    const selectedData = { ...this.selectedData };
    if (checked) {
      selectedData[id] = (this.fields || [])
        .map(key => ({key, value: item[key]}))
        .reduce(
          (result, item) => {
            result[item.key] = item.value;
            return result;
          },
          {} as any,
        );
    } else {
      delete selectedData[id];
    }
    this.selectedData = selectedData;
  }

  submit() {
    // event
    this.save.emit(this.selectedData);
    // exit
    this.isEdit = false;
  }
}
