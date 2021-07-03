import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { SettingService } from '@lamnhan/ngx-useful';

import { DatabaseItem } from '../../services/config/config.service';
import { DashboardService, DashboardListingItem } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'nguix-dashboard-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPage implements OnInit {
  query?: string;
  status = 'all';

  public readonly data$ = this.route.params.pipe(
    switchMap(params => {
      const part = this.dashboardService.getPart(params.part);
      if (part?.getAll) {
        return combineLatest([
          of(part),
          part.getAll(),
        ]);
      } else {
        return of([]);
      }
    }),
    map(([part, databaseItems]) => {
      const defaultLocale = this.dashboardService.getConfig().defaultLocale;
      const listingLocales = this.settingService.locales.filter(item => item.value !== defaultLocale);
      const items = this.localeFiltering(databaseItems, defaultLocale);
      console.log(items);
      return {
        defaultLocale,
        listingLocales,
        part,
        items,
      };
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private settingService: SettingService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {}

  queryChanged(e: any) {
    console.log(e.target?.value);
    this.query = e.target?.value;
  }

  private localeFiltering(
    databaseItems: DatabaseItem[],
    defaultLocale: string
  ): DashboardListingItem[] {
    console.log({databaseItems, defaultLocale});
    const items: DashboardListingItem[] = [];
    const localizedRecord: Record<string, Record<string, DatabaseItem>> = {};
    // extract origin & localized items
    databaseItems.forEach(dbItem => {
      console.log({dbItem});
      if (!dbItem?.locale || dbItem?.locale === defaultLocale) {
        items.push({
          origin: dbItem,
          localizedSiblings: {},
          searchText: '',
        });
      } else {
        const origin = dbItem.origin as string;
        const locale = dbItem.locale as string;
        if (!localizedRecord[origin]) {
          localizedRecord[origin] = {};
        }
        localizedRecord[origin][locale] = dbItem;
      }
    });
    return items.map(item => {
      const id = item.origin.id as string;
      // set siblings
      if (localizedRecord[id]) {
        item.localizedSiblings = localizedRecord[id];
      }
      // build search text
      let searchText = '';
      searchText += item.origin.title + ' ';
      item.searchText = searchText;
      // final
      return item;
    });
  }
}
