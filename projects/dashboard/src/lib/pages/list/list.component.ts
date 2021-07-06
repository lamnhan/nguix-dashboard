import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { SettingService, HelperService, BuiltinListingItem } from '@lamnhan/ngx-useful';

import { DatabaseItem, DashboardPart } from '../../services/config/config.service';
import { DashboardService, DashboardListingItem } from '../../services/dashboard/dashboard.service';

import { GetPart, DatabaseStateModel } from '../../states/database.state';

@Component({
  selector: 'nguix-dashboard-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPage implements OnInit {
  private part?: DashboardPart;

  query = '';
  status = 'all';
  pageNo = 1;
  detail = '';

  public readonly page$ = this.route.params.pipe(
    tap(console.log),
    map(params => {
      const part = this.dashboardService.getPart(params.part);
      return !part?.dataService ? {} : {part};
    }),
    tap(page => {
      this.part = page.part;
      if (this.part) {
        this.store.dispatch(new GetPart(this.part))
      }
    }),
  );

  public readonly data$ = this.store
    .select(state => state.database)
    .pipe(
      map(database => {
        const part = this.part as DashboardPart;
        const defaultLocale = this.settingService.defaultLocale;
        const recordLocales = this.settingService.locales.reduce(
          (result, item) => { result[item.value] = item; return result; },
          {} as Record<string, BuiltinListingItem>
        );
        const listingItems = this.buildListingItems(database[part.name] || [], defaultLocale);
        return {
          part,
          defaultLocale,
          recordLocales,
          listingItems,
        };
      }),
    );

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private helperService: HelperService,
    private settingService: SettingService,
    public dashboardService: DashboardService
  ) {}

  ngOnInit(): void {}

  private buildListingItems(
    databaseItems: DatabaseItem[],
    defaultLocale: string,
  ): DashboardListingItem[] {
    const items: DatabaseItem[] = [];
    const missingTranlationRecord: Record<string, string[]> = {};
    const localizedRecord: Record<string, DatabaseItem[]> = {};
    // extract items
    const allTranslations = this.settingService.locales.map(item => item.value);
    databaseItems.forEach(dbItem => {
      // origin item
      if (!dbItem?.locale || dbItem?.locale === defaultLocale) {
        items.push(dbItem);
        // util recording
        missingTranlationRecord[dbItem.id] = [...allTranslations];
      }
      // localized items
      else {
        const origin = dbItem.origin as string;
        if (!localizedRecord[origin]) {
          localizedRecord[origin] = [];
        }
        localizedRecord[origin].push(dbItem);
      }
    });
    return items.map(origin => {
      const id = origin.id as string;
      const EOL = ' | ';
      // all items
      const all: DatabaseItem[] = [origin].concat(localizedRecord[id] || []);
      // missing translations
      all.forEach(item => {
        const index = !item.locale ? -1 : missingTranlationRecord[id].indexOf(item.locale);
        if(index !== -1) {
          missingTranlationRecord[id].splice(index, 1);
        }
      });
      const missingTranslations = missingTranlationRecord[id];
      // search text
      const searchText = all
        .map(item => {
          const { title, description, keywords, locale } = item;
          const text =
            (!title ? '' : (title + EOL)) +
            (!description ? '' : (description + EOL)) +
            (!keywords ? '' : keywords);
          return text +
            (EOL + text.toLowerCase()) +
            (locale !== 'vi-VN' ? '' : EOL + this.helperService.cleanupStr(text));
        })
        .join(EOL);
      // final
      return { origin, all, missingTranslations, searchText };
    });
  }
}
