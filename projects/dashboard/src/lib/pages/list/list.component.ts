import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, combineLatest } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SettingService, HelperService } from '@lamnhan/ngx-useful';

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
  p = 1;

  public readonly data$ = this.route.params.pipe(
    switchMap(params => {
      const part = this.dashboardService.getPart(params.part);
      if (part?.getAll) {
        return combineLatest([
          of(part),
          part.getAll().pipe(catchError(() => of(null))),
        ]);
      } else {
        return of([]);
      }
    }),
    map(([part, databaseItems]) => {
      if (!part || !databaseItems) {
        return {};
      }
      const defaultLocale = this.settingService.defaultLocale;
      const listingLocales = this.settingService.locales.filter(item => item.value !== defaultLocale);
      const items = this.localeFiltering(databaseItems, defaultLocale);
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
    private helperService: HelperService,
    private settingService: SettingService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {}

  private localeFiltering(
    databaseItems: DatabaseItem[],
    defaultLocale: string
  ): DashboardListingItem[] {
    const items: DashboardListingItem[] = [];
    const localizedRecord: Record<string, Record<string, DatabaseItem>> = {};
    // extract origin & localized items
    databaseItems.forEach(dbItem => {
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
      // set siblings
      const id = item.origin.id as string;
      if (localizedRecord[id]) {
        item.localizedSiblings = localizedRecord[id];
      }
      // build search text
      const EOL = ' | ';
      item.searchText =
        ['origin', ...Object.keys(item.localizedSiblings)]
        .map(key => {
          const { title, description, keywords } =
            key === 'origin' ? item.origin : item.localizedSiblings[key];
          const text =
            (!title ? '' : (title + EOL)) +
            (!description ? '' : (description + EOL)) +
            (!keywords ? '' : keywords);
          return text +
            (EOL + text.toLowerCase()) +
            (key !== 'vi-VN' ? '' : EOL + this.helperService.cleanupStr(text));
        })
        .join(EOL);
      // final
      return item;
    });
  }
}
