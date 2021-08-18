import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';
import { SettingService, BuiltinListingItem } from '@lamnhan/ngx-useful';

import { DatabaseItem, DashboardPart, ListingGrouping } from '../../services/config/config.service';
import { DataService } from '../../services/data/data.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

import { DatabaseStateModel, GetCounting, GetItems, GetTranslations, SearchItems } from '../../states/database/database.state';

@Component({
  selector: 'nguix-dashboard-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPage implements OnInit {
  private readonly viewPerPage = 2;

  part!: DashboardPart;
  isListingLoading!: boolean;
  type!: string;
  status!: string;
  pageNo!: number;
  query!: string;
  detailId!: string;
  defaultLocale!: string;
  allLocales!: Record<string, BuiltinListingItem>;

  public readonly page$ = this.route.params.pipe(
    switchMap(params => {
      this.part = this.dashboardService.getPart(params.part) as DashboardPart;
      this.isListingLoading = false;
      this.type = 'default';
      this.status = 'publish';
      this.pageNo = 1;
      this.query = '';
      this.detailId = '';
      this.defaultLocale = this.settingService.defaultLocale;
      this.allLocales = this.settingService.locales.reduce(
        (result, item) => { result[item.value] = item; return result; },
        {} as Record<string, BuiltinListingItem>
      );
      // not a valid part (stop right here)
      if (!this.part?.dataService) {
        return of({ ok: false });
      }
      // load couting and continue
      else {
        return this.store
          .dispatch(new GetCounting(this.part, this.defaultLocale))
          .pipe(
            map(() => ({ ok: true }))
          );
      }
    }),
    tap(page =>  !page.ok ? false : this.loadItems()),
  );

  public readonly data$ = this.store
    .select<DatabaseStateModel>(state => state.database)
    .pipe(
      filter(databaseState =>
        !!databaseState[this.part.name]?.counting && !!databaseState[this.part.name]?.itemsByGroup
      ),
      map(databaseState => {
        const currentPartData = databaseState[this.part.name];
        // reset loading
        this.isListingLoading = false;
        // extract data
        const totalPages = Math.ceil(
          (currentPartData.counting[this.type]?.[this.status] || 1) / this.viewPerPage
        );
        const listingStatuses = this.getStatuses(currentPartData.counting[this.type] || {});
        const groupItems = currentPartData.itemsByGroup?.[`${this.type}:${this.status}:${this.pageNo}`] || [];
        const fullItemsByOrigin = currentPartData.fullItemsByOrigin || {};
        const searchQuery = currentPartData.searchQuery;
        const searchItems = currentPartData.searchResult;
        return {
          totalPages,
          listingStatuses,
          groupItems,
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
    public dataService: DataService,
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

  changeStatus(value: string) {
    if (this.status === value) {
      return;
    }
    this.status = value;
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
      this.store.dispatch(new GetItems(this.part, this.type, this.status, this.pageNo, this.viewPerPage, true));
    }
  }

  private getStatuses(counting: Record<string, number>): ListingGrouping[] {
    const statuses: ListingGrouping[] = [
      {
        title: 'Publish',
        value: 'publish',
        count: 0
      },
      {
        title: 'Draft',
        value: 'draft',
        count: 0
      },
      {
        title: 'Archive',
        value: 'archive',
        count: 0
      },
      {
        title: 'Trash',
        value: 'trash',
        count: 0
      }
    ];
    return statuses.map(item => {
      item.count = counting[item.value] || 0;
      return item;
    });
  }

}
