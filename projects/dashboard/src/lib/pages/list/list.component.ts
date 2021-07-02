import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { SettingService, BuiltinListingItem } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem } from '../../services/config/config.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';

interface Status {
  text: string;
  count: number;
}

interface GroupingItem {
  origin: DatabaseItem;
  localizedSiblings: DatabaseItem[];
  searching: string;
}

@Component({
  selector: 'nguix-dashboard-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListPage implements OnInit {
  query: string = '';
  status: string = 'all';

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
    map(([part, allItems]) => {
      const locale = (this.settingService as any).defaultLocale as string;
      const locales = this.settingService.locales;
      const items = this.groupItems(allItems, locale);
      return {
        locale,
        locales,
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

  ngOnInit(): void {
  }

  groupItems(items: DatabaseItem[], locale: string): GroupingItem[] {
    return [];
  }

  // private setStatuses() {
  //   const all: Status = {
  //     text: 'All',
  //     count: 0
  //   };
  //   const published: Status = {
  //     text: 'Published',
  //     count: 0
  //   };
  //   const draft: Status = {
  //     text: 'Draft',
  //     count: 0
  //   };
  //   this.items.forEach(item => {
  //     if (item.locale === this.locale) {
  //       if (item.status === 'publish') {
  //         published.count++;
  //       } else if (item.status === 'draft') {
  //         draft.count++;
  //       }
  //       all.count++;
  //     }
  //   });
  //   this.statuses.push(all, published, draft);
  // }
}
