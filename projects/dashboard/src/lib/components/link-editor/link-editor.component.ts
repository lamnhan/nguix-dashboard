import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  @Input() formGroup!: FormGroup;
  @Input() currentData?: Record<string, any>;
  @Input() sourcePart!: DashboardPart;
  @Input() destinationPart!: DashboardPart;
  @Input() preload?: number;
  @Input() activeLocale!: string;
  @Input() activeType!: string;
  @Input() typeFilter?: Record<string, string>;

  @Output() save = new EventEmitter<any>();

  isEdit = false;
  hasData = false;
  selectedData: Record<string, any> = {};

  query = '';
  isLoading: boolean = false;
  items: DatabaseItem[] = [];
  preloadSubscription?: Subscription;
  searchingSubscription?: Subscription;

  private contentType = 'default';

  constructor() {}

  ngOnInit(): void {}
  
  ngOnChanges(): void {
    this.contentType = (this.typeFilter || {})[this.activeType] || 'default';
    // preload items
    if (this.preload && this.destinationPart?.dataService) {
      if (this.preloadSubscription) {
        this.preloadSubscription.unsubscribe();
      }
      this.preloadSubscription = this.destinationPart.dataService
        .list(
          ref => {
            let query = ref
              .where('type', '==', this.contentType)
              .where('status', '==', 'publish');
            // i18n
            if (!this.destinationPart.noI18n && this.activeLocale) {
              query = query.where('locale', '==', this.activeLocale);
            }
            // result
            return query.limit(this.preload as number);
          },
          {
            name:
              `Preload linking:
                part=${this.destinationPart.name}
                type=${this.contentType}
                status=publish
                locale=${this.activeLocale}`,
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
    if (this.destinationPart?.dataService) {
      this.isLoading = true;
      if (this.searchingSubscription) {
        this.searchingSubscription.unsubscribe();
      }
      this.searchingSubscription = combineLatest([
        // match id
        this.destinationPart.dataService.get(this.query),
        // match searching
        this.destinationPart.dataService.setupSearching().pipe(
          switchMap(() =>
            (this.destinationPart.dataService as DatabaseData<any>)
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
    if (!this.destinationPart.dataService) {
      return;
    }
    const dataPickers = this.destinationPart.dataService.getDataPickers();
    const selectedData = { ...this.selectedData };
    selectedData[item.id] = this.destinationPart.dataService.getLinkingFields().reduce(
      (result, prop) => {
        const value = !dataPickers[prop]
          ? item[prop]
          : dataPickers[prop](item[prop], item);
        if (value) {
          result[prop] = value;
        }
        return result;
      },
      {} as any,
    );
    // notify linking
    this.destinationPart.dataService.onLinking('create', item, this.getLinkingContext());
    // re-assign
    this.selectedData = selectedData;
  }

  removeItem(item: any) {
    if (!this.destinationPart.dataService) {
      return;
    }
    const selectedData = { ...this.selectedData };
    delete selectedData[item.id];
    // notify linking
    this.destinationPart.dataService.onLinking('delete', item, this.getLinkingContext());
    // re-assign
    this.selectedData = selectedData;
  }

  submit() {
    this.isEdit = false;
    this.save.emit(this.selectedData);
    return false;
  }

  private getLinkingContext() {
    return {
      collection: (this.sourcePart.dataService as DatabaseData<any>).name,
      data: this.getDataSnapshot(),
    };
  }

  private getDataSnapshot() {
    return Object.keys(this.formGroup.controls).reduce(
      (result, name) => {
        const control = this.formGroup.controls[name];
        const value = control.value;
        result[name] = !isNaN(value) ? +value : value;
        return result;
      },
      {} as Record<string, any>
    );
  }
}
