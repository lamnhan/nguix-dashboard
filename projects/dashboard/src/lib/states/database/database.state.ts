import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { Meta } from '@lamnhan/schemata';
import { DatabaseData, SettingService } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem } from '../../services/config/config.service';

export class GetCounting {
  static readonly type = '[Database] Get counting';
  constructor(
    public part: DashboardPart,
    public locale: string,
  ) {}
}

export class GetItems {
  static readonly type = '[Database] Get items';
  constructor(
    public part: DashboardPart,
    public type: string,
    public status: string,
    public pageNo: number,
    public limit: number,
    public refresh = false,
  ) {}
}

export class GetTranslations {
  static readonly type = '[Database] Get translations';
  constructor(
    public part: DashboardPart,
    public databaseItem: DatabaseItem,
  ) {}
}

export class SearchItems {
  static readonly type = '[User] Search items';
  constructor(
    public part: DashboardPart,
    public type: string,
    public searchQuery: string,
    public limit: number,
  ) {}
}

export class AddItem {
  static readonly type = '[Database] Add item';
  constructor(
    public part: DashboardPart,
    public databaseItem: DatabaseItem,
  ) {}
}

export class UpdateItem {
  static readonly type = '[Database] Update item';
  constructor(
    public part: DashboardPart,
    public databaseItem: DatabaseItem,
    public updateData: Record<string, any>,
  ) {}
}

export class RemoveItem {
  static readonly type = '[Database] Remove item';
  constructor(
    public part: DashboardPart,
    public databaseItem: DatabaseItem,
  ) {}
}

export interface DatabaseStatePartData extends Record<string, any> {
  // listing
  remoteLoaded: boolean;
  counting: Record<string, Record<string, number>>;
  itemsByGroup: Record<string, DatabaseItem[]>;
  fullItemsByOrigin?: Record<string, DatabaseFullItem>;
  // search
  searchQuery?: string;
  searchResult?: DatabaseItem[];
}

export interface DatabaseStateModel {
  [part: string]: DatabaseStatePartData;
}

export interface DatabaseFullItem {
  all: DatabaseItem[];
  missingTranslations?: string[];
}

@State<DatabaseStateModel>({
  name: 'database',
  defaults: {},
})
@Injectable()
export class DatabaseState {

  constructor(private settingService: SettingService) {}

  @Action(GetCounting)
  getCounting({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetCounting) {
    const state = getState();
    const { part, locale } = action;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData?.counting) {
      return of(currentPartData);
    } else {
      return part.dataService.getRemoteMetas(false)
      .pipe(
        tap(metaDoc => {
          const counting: Record<string, Record<string, number>> = {};
          Object.keys(metaDoc?.value?.documentCounting || {}).forEach(type => {
            counting[type] = metaDoc?.value?.documentCounting?.[type]?.[locale] || {
              draft: 0,
              publish: 0,
              trash: 0,
              archive: 0,
            };
          });
          return patchState(
            this.getPatchingData(
              partName,
              currentPartData,
              { counting },
            )
          );
        }),
      );
    }
  }

  @Action(GetItems)
  getItems({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetItems) {
    const state = getState();
    const { part, type, status, pageNo, limit, refresh } = action;
    const groupName = `${type}:${status}:${pageNo}`;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData.itemsByGroup?.[groupName] && currentPartData.remoteLoaded) {
      if (refresh) {
        patchState({[partName]: currentPartData});
      }
      return of(currentPartData);
    }
    // load data
    else {
      return part.dataService.getCollection(
        ref => {
          let query = ref
            .where('type', '==', type)
            .where('status', '==', status)
            .orderBy('createdAt', 'desc');
          if (!part.noI18n) {
            query = query.where('locale', '==', this.settingService.locale);
          }
          if (pageNo > 1) {
            const prevPageNo = pageNo - 1;
            const prevGroupName = `${type}:${status}:${prevPageNo}`;
            const lastItems = (currentPartData as DatabaseStatePartData).itemsByGroup[prevGroupName];
            const lastItem = lastItems[lastItems.length - 1];
            if (lastItem) {
              query = query.startAfter(lastItem.createdAt as string);
            }
          }
          return query.limit(limit);
        },
        false,
      )
      .pipe(
        tap((items: DatabaseItem[]) =>
          patchState(
            this.getPatchingData(
              partName,
              currentPartData,
              {
                remoteLoaded: true,
                itemsByGroup: {
                  [groupName]: items,
                },
              },
            )
          )
        )
      );
    }
  }

  @Action(GetTranslations)
  getTranslations({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetTranslations) {
    const state = getState();
    const { part, databaseItem } = action;
    const id = databaseItem.id;
    const origin = databaseItem.origin;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData.fullItemsByOrigin?.[origin]) {
      return of(currentPartData);
    }
    // load data
    else {
      return part.dataService.getCollection(
        ref => ref.where('origin', '==', origin),
        false,
      )
      .pipe(
        tap((localizedItems: DatabaseItem[]) => {
          const existingsTranslations = localizedItems.map(item => item.locale) as string[];
          const missingTranslations = this.settingService.locales
            .filter(item => !existingsTranslations.includes(item.value))
            .map(item => item.value);
          return patchState(
            this.getPatchingData(
              partName,
              currentPartData,
              {
                fullItemsByOrigin: {
                  [origin]: {
                    all: [
                      databaseItem,
                      ...localizedItems.filter(x => x.id !== id)
                    ],
                    missingTranslations,
                  },
                },
              },
            )
          )
        }),
      );
    }
  }

  @Action(SearchItems)
  searchItems({ getState, patchState }: StateContext<DatabaseStateModel>, action: SearchItems) {
    const state = getState();
    const { part, type, limit, searchQuery } = action;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData.searchQuery === searchQuery && currentPartData.searchResult?.length) {
      return of(currentPartData)
      .pipe(
        tap(() =>
          patchState(
            this.getPatchingData(
              partName,
              currentPartData,
              { searchResult: currentPartData.searchResult }
            ),
          )
        ),
      );
    }
    // load data
    else {
      return part.dataService.setupSearching(false, true).pipe(
        switchMap(() => (part.dataService as DatabaseData<any>)
          .search(searchQuery, limit, type === 'default' ? undefined : type)
            .list(1, false)
            .pipe(
              tap((searchResult: DatabaseItem[]) =>
                patchState(
                  this.getPatchingData(
                    partName,
                    currentPartData,
                    {
                      searchQuery,
                      searchResult,
                    }
                  )
                )
              ),
            )
        ),
      );
    }
  }

  @Action(AddItem)
  addItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: AddItem) {
    const state = getState();
    const { part, databaseItem } = action;
    const { id, type, status, locale, origin } = databaseItem;
    const groupName = `${type}:${status}:1`;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // add item
    return part.dataService.add(id, databaseItem)
    .pipe(
      tap(() => {
        patchState(
          this.getPatchingData(
            partName,
            currentPartData,
            {
              counting: {
                [type]: {
                  [status]: (currentPartData.counting?.[type]?.[status] || 0) + 1,
                }
              },
              itemsByGroup: {
                // add main item to the first page (check for locale first)
                ...(
                  part.noI18n || locale === this.settingService.locale
                  ? {
                    [groupName]: [databaseItem].concat(currentPartData.itemsByGroup?.[groupName] || []),
                  }
                  : {}
                )
              },
              // add localized item to its group (if data loaded)
              ...(
                origin && currentPartData.fullItemsByOrigin?.[origin]
                ? {
                  fullItemsByOrigin: {
                    [origin]: {
                      all: [
                        ...(currentPartData.fullItemsByOrigin?.[origin]?.all || []),
                        databaseItem,
                      ],
                      missingTranslations:
                        (currentPartData.fullItemsByOrigin?.[origin]?.missingTranslations || [])
                          .filter(locale => locale !== locale),
                    }
                  }
                }
                : {}
              ),
            },
          )
        )
      }),
    );
  }

  @Action(UpdateItem)
  updateItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateItem) {
    const state = getState();
    const { part, databaseItem, updateData } = action;
    const { id, type, status: currentStatus } = databaseItem;
    const { status: newStatus } = updateData;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // update data
    return part.dataService.update(id, updateData, databaseItem)
    .pipe(
      tap(() => 
        patchState(
          this.getPatchingData(
            partName,
            currentPartData,
            {
              ...(
                !newStatus || newStatus === currentStatus
                  ? {}
                  : {
                    counting: {
                      [type]: {
                        [currentStatus]: (currentPartData.counting?.[type]?.[currentStatus] || 0) - 1,
                        [newStatus]: (currentPartData.counting?.[type]?.[newStatus] || 0) + 1,
                      }
                    },
                  }
              ),
              ...this.updatePatchingItem(currentPartData, id, updateData, databaseItem),
            },
          )
        )
      )
    );
  }

  @Action(RemoveItem)
  removeItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: RemoveItem) {
    const state = getState();
    const { part, databaseItem } = action;
    const { id, type, status } = databaseItem;
    const partName = part.name;
    const currentPartData = state[partName] || {} as DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // remove item
    return part.dataService.delete(id, databaseItem)
    .pipe(
      tap(() =>
      patchState(
        this.getPatchingData(
          partName,
          currentPartData,
          {
            counting: {
              [type]: {
                [status]: (currentPartData.counting?.[type]?.[status] || 0) - 1,
              }
            },
           ...this.updatePatchingItem(currentPartData, id, null, databaseItem),
          },
        )
      )
      ),
    );
  }

  private getPatchingData(
    partName: string,
    currentPartData: DatabaseStatePartData,
    data: Record<string, any>,
  ) {
    const updateData = {} as Record<string, any>;
    const updateKeys = Object.keys(data);
    // direct data
    [
      'remoteLoaded',
      'searchQuery',
      'searchResult'
    ].forEach(key => {
      if (updateKeys.includes(key)) {
        updateData[key] = data[key];
      }
    });
    // nested
    ['itemsByGroup'].forEach(key => {
      if (updateKeys.includes(key)) {
        updateData[key] = {
          ...(currentPartData?.[key] || {}),
          ...(data[key] || {}),
        };
      }
    });
    // nested (2 levels)
    ['fullItemsByOrigin', 'counting'].forEach(key => {
      if (updateKeys.includes(key)) {
        const thisUpdateData = {} as Record<string, any>;
        Object.keys(data[key]).forEach(nestedKey => {
          thisUpdateData[nestedKey] = {
            ...(currentPartData?.[key]?.[nestedKey] || {}),
            ...data[key][nestedKey],
          };
        });
        updateData[key] = {
          ...(currentPartData?.[key] || {}),
          ...thisUpdateData,
        };
      }
    });
    // result
    return {
      [partName]: {
        ...currentPartData,
        ...updateData,
      }, 
    };
  }

  private updatePatchingItem(
    currentPartData: DatabaseStatePartData,
    id: string,
    updateData: null | Record<string, any>,
    databaseItem: DatabaseItem,
  ) {
    // itemsByGroup
    const itemsByGroup = (currentPartData.itemsByGroup || {});
    Object.keys(itemsByGroup).forEach(groupName => {
      if (updateData !== null) {
        itemsByGroup[groupName].forEach((item, i) => {
          if (item.id !== id) {
            return;
          }
          itemsByGroup[groupName][i] = {...item, ...updateData};
        });
      } else {
        itemsByGroup[groupName] = itemsByGroup[groupName].filter(item => item.id !== id);
      }
    });
    // fullItemsByOrigin
    const fullItemsByOrigin = (currentPartData.fullItemsByOrigin || {});
    Object.keys(fullItemsByOrigin).forEach(origin => {
      if (updateData !== null) {
        fullItemsByOrigin[origin].all.forEach((item, i) => {
          if (item.id !== id) {
            return;
          }
          fullItemsByOrigin[origin].all[i] = {...item, ...updateData};
        })
      } else {
        fullItemsByOrigin[origin].all = fullItemsByOrigin[origin].all.filter(item => item.id !== id);
      }
    });
    // searchResult
    let searchResult = currentPartData.searchResult;
    if (searchResult) {
      if (updateData !== null) {
        searchResult.forEach(item => {
          if (item.id !== id) {
            return;
          }
          item = {...item, ...updateData};
        });
      } else {
        searchResult = searchResult.filter(item => item.id !== id);
      }
    }
    // result
    return {
      itemsByGroup,
      fullItemsByOrigin,
      searchResult,
    };
  }

}
