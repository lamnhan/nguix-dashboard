import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem } from '../../services/config/config.service';

@Component({
  selector: 'nguix-dashboard-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss'],
})
export class LinkEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() part!: DashboardPart;
  @Input() fields!: string[];
  @Input() contentType!: string;
  @Input() contentLocale?: string;
  @Input() currentData?: Record<string, any>;
  @Input() preload?: number;

  @Output() save = new EventEmitter<any>();

  isEdit = false;
  hasData = false;
  selectedData: Record<string, any> = {};

  query = '';
  isLoading: boolean = false;
  items: DatabaseItem[] = [];
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
            let query = ref
              .where('type', '==', this.contentType)
              .where('status', '==', 'publish');
            // i18n
            if (!this.part.noI18n && this.contentLocale) {
              query = query.where('locale', '==', this.contentLocale);
            }
            // result
            return query.limit(this.preload as number);
          },
          {
            name:
              `Preload linking:
                part=${this.part.name}
                type=${this.contentType}
                status=publish
                locale=${this.contentLocale}`,
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

  loadItems() {
    if (this.part?.dataService) {
      this.isLoading = true;
      if (this.searchingSubscription) {
        this.searchingSubscription.unsubscribe();
      }
      this.searchingSubscription = combineLatest([
        // match id
        this.part.dataService.getDoc(this.query),
        // match searching
        this.part.dataService.setupSearching().pipe(
          switchMap(() =>
            (this.part.dataService as DatabaseData<any>)
            .search(this.query, 5, this.contentType === 'default' ? undefined : this.contentType)
              .list()
          ),
        )
      ])
      .subscribe(([byIdItem, bySearchingItems]) => {
        this.isLoading = false;
        // items
        const items = [] as DatabaseItem[];
        if (byIdItem) {
          items.push(byIdItem);
        }
        items.push(...bySearchingItems);
        // set items
        const duplicatedIds: string[] = [];
        this.items = items.filter(item => {
          const isDuplicated = duplicatedIds.includes(item.id);
          duplicatedIds.push(item.id);
          return !isDuplicated;
        });
      });
    }
  }

  addItem(item: any) {
    const dataPickers = this.part.dataService?.getDataPickers() || {};
    const selectedData = { ...this.selectedData };
    selectedData[item.id] = (this.fields || [])
      .map(prop => ({
        prop,
        value:
          !dataPickers[prop]
            ? item[prop]
            : dataPickers[prop](item[prop], item)
      }))
      .reduce(
        (result, item) => {
          result[item.prop] = item.value;
          return result;
        },
        {} as any,
      );
    // re-assign
    this.selectedData = selectedData;
  }

  removeItem(item: any) {
    const selectedData = { ...this.selectedData };
    delete selectedData[item.id];
    // re-assign
    this.selectedData = selectedData;
  }

  submit() {
    this.isEdit = false;
    this.save.emit(this.selectedData);
  }
}
