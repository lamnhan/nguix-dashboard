import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, combineLatest } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SettingService, HelperService, BuiltinListingItem } from '@lamnhan/ngx-useful';

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
      const recordLocales = this.settingService.locales.reduce(
        (result, item) => { result[item.value] = item; return result; },
        {} as Record<string, BuiltinListingItem>
      );
      const items = this.localeFiltering(databaseItems, defaultLocale);
      return {
        defaultLocale,
        recordLocales,
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
      const all: DatabaseItem[] = [origin].concat(localizedRecord[id]);
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
