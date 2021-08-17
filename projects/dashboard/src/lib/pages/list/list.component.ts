import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { SettingService, BuiltinListingItem } from '@lamnhan/ngx-useful';

import { DatabaseItem, DashboardPart } from '../../services/config/config.service';
import { DataService } from '../../services/data/data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

import { DatabaseStateModel, GetCounting, GetItems, GetTranslations, SearchItems } from '../../states/database/database.state';

@Component({
  selector: 'nguix-dashboard-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPage implements OnInit {
  private part?: DashboardPart;
  private readonly viewPerPage = 2;

  isListingLoading = false;
  type = 'default';
  status = 'all';
  query = '';
  pageNo = 1;
  defaultLocale!: string;
  allLocales!: Record<string, BuiltinListingItem>;

  detailId = '';

  public readonly page$ = this.route.params.pipe(
    map(params => {
      // reset filter
      this.type = 'default';
      this.status = 'all';
      this.query = '';
      this.pageNo = 1;
      this.defaultLocale = this.settingService.defaultLocale;
      this.allLocales = this.settingService.locales.reduce(
        (result, item) => { result[item.value] = item; return result; },
        {} as Record<string, BuiltinListingItem>
      );
      // set data
      this.part = this.dashboardService.getPart(params.part);
      if (this.part && this.part.contentTypes && this.part.contentTypes.length > 1) {
        this.type = this.part.contentTypes[0].value || '';
      }
      // ...
      return !this.part?.dataService ? {} : {part: this.part};
    }),
    tap(() => {

      this.loadItems();
    }),
  );

  public readonly data$ = this.store
    .select<DatabaseStateModel>(state => state.database)
    .pipe(
      map(databaseState => {
        // reset loading
        this.isListingLoading = false;
        // get data
        const part = this.part as DashboardPart;
        const totalCount = databaseState[part.name].count;
        const statusCounting = databaseState[part.name].statusCounting;
        const totalPages = !totalCount ? 1 : Math.ceil(totalCount/this.viewPerPage);
        const pageItems = databaseState[part.name].itemsByType[this.type][this.pageNo] || [];
        const fullItemsByOrigin = databaseState[part.name].fullItemsByOrigin || {};
        const searchQuery = databaseState[part.name].searchQuery;
        const searchItems = databaseState[part.name].searchResult;
        return {
          part,
          defaultLocale: this.defaultLocale,
          allLocales: this.allLocales,
          totalCount,
          statusCounting,
          totalPages,
          pageItems,
          fullItemsByOrigin,
          searchQuery,
          searchItems,
        };
      }),
    );

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private settingService: SettingService,
    private dashboardService: DashboardService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {}

  changeType(value: string) {
    if (this.type === value) {
      return;
    }
    this.type = value;
    this.pageNo = 1;
    this.loadItems();
  }

  search(currentQuery = '') {
    if (this.part && this.query && this.query !== currentQuery) {
      this.isListingLoading = true;
      // dispatch action
      this.store.dispatch(new SearchItems(this.part, this.type, this.query, this.viewPerPage));
    }
  }
  
  loadItemTranslations(databaseItem: DatabaseItem) {
    if (this.part) {
      this.store.dispatch(new GetTranslations(this.part, databaseItem));
    }
  }

  previousPage() {
    --this.pageNo;
    this.loadItems();
  }
  
  nextPage() {
    ++this.pageNo;
    this.loadItems();
  }

  private loadItems() {
    if (this.part) {
      this.isListingLoading = true;
      this.store.dispatch([
        new GetCounting(this.part, this.type, this.defaultLocale),
        new GetItems(this.part, this.type, this.pageNo, this.viewPerPage, true)
      ]);
    }
  }

}
