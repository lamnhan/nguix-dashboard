import { Injectable } from '@angular/core';
import { of, combineLatest, ObjectUnsubscribedError } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { DatabaseData, SettingService } from '@lamnhan/ngx-useful';

import { DashboardPart, DatabaseItem } from '../../services/config/config.service';

export class GetItems {
  static readonly type = '[Database] Get items';
  constructor(
    public part: DashboardPart,
    public type: string,
    public pageNo: number,
    public limit: number,
    public refresh = false,
  ) {}
}

export class GetTranslations {
  static readonly type = '[Database] Get translations';
  constructor(
    public part: DashboardPart,
    public item: DatabaseItem,
  ) {}
}

export class SearchItems {
  static readonly type = '[User] Search items';
  constructor(public part: DashboardPart, public type: string, public query: string, public limit: number) {}
}

// export class ChangeStatus {
//   static readonly type = '[Database] Change status by origin';
//   constructor(public part: DashboardPart, public databaseItem: DatabaseItem, public status: string) {}
// }

export class AddItem {
  static readonly type = '[Database] Add item';
  constructor(
    public part: DashboardPart,
    public type: string,
    public id: string,
    public data: any,
  ) {}
}

export class UpdateItem {
  static readonly type = '[Database] Update item';
  constructor(public part: DashboardPart, public type: string, public id: string, public data: any, public currentData: any) {}
}

// export class UpdateBatch {
//   static readonly type = '[Database] Update batch';
//   constructor(
//     public part: DashboardPart,
//     public batch: Array<{id: string; data: any}>,
//     public result: any[] = [],
//   ) {}
// }

export class RemoveItem {
  static readonly type = '[Database] Remove item';
  constructor(public part: DashboardPart, public databaseItem: DatabaseItem) {}
}

export interface DatabaseStatePartData extends Record<string, any> {
  // listing
  remoteLoaded: boolean;
  itemsByType: Record<string, Record<string, DatabaseItem[]>>;
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

  @Action(GetItems)
  getItems({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetItems) {
    const state = getState();
    const { part, type, pageNo, limit, refresh } = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // alraady loaded
    if (currentPartData?.itemsByType?.[type]?.[pageNo] && currentPartData?.remoteLoaded) {
      if (refresh) {
        patchState({
          [partName]: currentPartData,
        });
      }
      return of(currentPartData.itemsByType[type][pageNo]);
    }
    // load data
    else {
      return part.dataService.getCollection(
        ref => {
          let query = ref
            .where('type', '==', type)
            .orderBy('createdAt', 'desc');
          if (!part.noI18n) {
            query = query.where('locale', '==', this.settingService.locale);
          }
          if (pageNo > 1) {
            const prevPageNo = pageNo - 1;
            const prevItems = (currentPartData as DatabaseStatePartData).itemsByType[type][prevPageNo];
            const lastItem = prevItems[prevItems.length - 1];
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
              (currentPartData as DatabaseStatePartData || {}),
              {
                remoteLoaded: true,
                itemsByType: {
                  [type]: {
                    [pageNo]: items,
                  },
                },
              },
            )
          )
          // patchState({
          //   [partName]: {
          //     ...(currentPartData as DatabaseStatePartData || {}),
          //     remoteLoaded: true,
          //     itemsByType: {
          //       ...((currentPartData as DatabaseStatePartData)?.itemsByType || {}),
          //       [type]: {
          //         ...((currentPartData as DatabaseStatePartData)?.itemsByType?.[type] || {}),
          //         [pageNo]: items,
          //       }
          //     },
          //   }
          // })
        )
      );
    }
  }

  @Action(GetTranslations)
  getTranslations({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetTranslations) {
    const state = getState();
    const { part, item } = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;
    const id = item.id;
    const origin = item.origin;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData?.fullItemsByOrigin?.[origin]) {
      return of(currentPartData?.fullItemsByOrigin?.[origin]);
    }
    // load data
    else {
      return part.dataService.getCollection(
        ref => ref.where('origin', '==', origin),
        false,
      )
      .pipe(
        tap((localizedItems: DatabaseItem[]) => {
          const existingsTranslations = localizedItems.map(x => x.locale) as string[];
          const missingTranslations = this.settingService.locales
            .filter(x => !existingsTranslations.includes(x.value))
            .map(x => x.value);
          patchState(
            this.getPatchingData(
              partName,
              (currentPartData as DatabaseStatePartData || {}),
              {
                fullItemsByOrigin: {
                  [origin]: {
                    all: [
                      item,
                      ...localizedItems.filter(x => x.id !== id)
                    ],
                    missingTranslations,
                  },
                },
              },
            )
          )
          // patchState({
          //   [partName]: {
          //     ...(currentPartData as DatabaseStatePartData || {}),
          //     fullItemsByOrigin: {
          //       ...((currentPartData as DatabaseStatePartData)?.fullItemsByOrigin || {}),
          //       [origin]: {
          //         all: [
          //           item,
          //           ...localizedItems.filter(x => x.id !== id)
          //         ],
          //         missingTranslations,
          //       },
          //     },
          //   }
          // })
        }),
      );
    }
  }

  @Action(SearchItems)
  searchItems({ getState, patchState }: StateContext<DatabaseStateModel>, action: SearchItems) {
    const state = getState();
    const { part, type, limit, query } = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;// no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // already loaded
    if (currentPartData?.searchQuery === query && currentPartData?.searchResult?.length) {
      return of(currentPartData?.searchResult).pipe(
        tap(() =>
          patchState(
            this.getPatchingData(
              partName,
              currentPartData,
              { searchResult: currentPartData?.searchResult }
            ),
          )
        ),
      );
    }
    // load data
    else {
      return part.dataService.setupSearching(true).pipe(
        switchMap(() =>
          (part.dataService as DatabaseData<any>).search(query, limit, type)
            .list()
            .pipe(
              tap(searchResult =>
                patchState(
                  this.getPatchingData(
                    partName,
                    currentPartData as DatabaseStatePartData,
                    {
                      searchQuery: query,
                      searchResult: searchResult as any[],
                    }
                  )
                )
              ),
            )
        ),
      );
    }
  }

  // @Action(ChangeStatus)
  // changeStatus({ getState, patchState }: StateContext<DatabaseStateModel>, action: ChangeStatus) {
  //   const state = getState();
  //   const {part, databaseItem, status} = action;
  //   const originOrId = databaseItem.origin || databaseItem.id;
  //   if (!part.dataService) {
  //     throw new Error('No data service for this part.');
  //   }
  //   return combineLatest(
  //     state[part.name]
  //       .filter(item => item.id === originOrId || item.origin === originOrId)
  //       .map(item => (part.dataService as DatabaseData<any>).update(item.id, {status}))
  //   )
  //   .pipe(
  //     tap(() =>
  //       patchState({
  //         [part.name]: state[part.name].map(item => {
  //           if (item.id === originOrId || item.origin === originOrId) {
  //             item.status = status;
  //           }
  //           return item;
  //         }),
  //       })
  //     ),
  //   );
  // }

  @Action(AddItem)
  addItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: AddItem) {
    const state = getState();
    const { part, type, id, data } = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;
    // no data service
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    // add item
    return part.dataService.add(id, data)
    .pipe(
      tap(() => {
        const partData = currentPartData as DatabaseStatePartData;
        patchState(
          this.getPatchingData(
            partName,
            (partData || {}),
            {
              remoteLoaded: !(part.noI18n || data.locale === this.settingService.locale),
              // itemsByType: {
              //   [type]: {
              //     // add main item to the first page (check for locale first)
              //     ...(
              //       part.noI18n || data.locale === this.settingService.locale
              //       ? {
              //         '1': [data].concat(partData?.itemsByType?.[type]?.['1'] || []),
              //       }
              //       : {}
              //     )
              //   }
              // },
              // add localized item to its group (if data loaded)
              ...(
                data.origin && partData?.fullItemsByOrigin?.[data.origin]
                ? {
                  fullItemsByOrigin: {
                    [data.origin]: {
                      all: [
                        ...(partData?.fullItemsByOrigin?.[data.origin]?.all || []),
                        data,
                      ],
                      missingTranslations:
                        (partData?.fullItemsByOrigin?.[data.origin]?.missingTranslations || [])
                          .filter(locale => locale !== data.locale),
                    }
                  }
                }
                : {}
              ),
            },
          )
        )
      }
        // patchState({
        //   [partName]: {
        //     ...(currentPartData as DatabaseStatePartData || {}),
        //     remoteLoaded: false,
        //     itemsByType: {
        //       ...((currentPartData as DatabaseStatePartData)?.itemsByType || {}),
        //       [type]: {
        //         ...((currentPartData as DatabaseStatePartData)?.itemsByType?.[type] || {}),
        //         // add main item to the first page
        //         ...(
        //           part.noI18n || data.locale === this.settingService.locale
        //           ? {
        //             '1':
        //             [data].concat((currentPartData as DatabaseStatePartData)?.itemsByType?.[type]?.['1'] || []),
        //           }
        //           : {}
        //         )
        //       }
        //     },
        //     // add localized item to its group (if other loaded)
        //     ...(
        //       data.origin && (currentPartData as DatabaseStatePartData)?.fullItemsByOrigin?.[data.origin]
        //       ? {
        //         fullItemsByOrigin: {
        //           ...((currentPartData as DatabaseStatePartData)?.fullItemsByOrigin || {}),
        //           [data.origin]: {
        //             all: [
        //               ...((currentPartData as DatabaseStatePartData)?.fullItemsByOrigin?.[data.origin]?.all || []),
        //               data,
        //             ],
        //             missingTranslations: ((currentPartData as DatabaseStatePartData)?.fullItemsByOrigin?.[data.origin]?.missingTranslations || []).filter(locale => locale !== data.locale),
        //           }
        //         }
        //       }
        //       : {}
        //     ),
        //   }
        // })
      ),
    );
  }

  @Action(UpdateItem)
  updateItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateItem) {
    const state = getState();
    const {part, type, id, data, currentData} = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    return part.dataService.update(id, data, currentData)
    .pipe(
      tap(() => 
        patchState(
          this.getPatchingData(
            partName,
            (currentPartData || {} as DatabaseStatePartData),
            this.updatePatchingItem(
              type,
              id,
              data,
              currentPartData as DatabaseStatePartData
            ),
          )
        )
      )
    );
  }

  // @Action(UpdateBatch)
  // updateBatch({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateBatch) {
  //   const state = getState();
  //   const {part, batch, result} = action;
  //   if (!part.dataService) {
  //     throw new Error('No data service for this part.');
  //   }
  //   // no items
  //   if (!batch || !batch.length) {
  //     return of([]);
  //   }
  //   // update remote
  //   return combineLatest(
  //     batch.map(item =>
  //       (part.dataService as DatabaseData<any>).update(item.id, item.data).pipe(
  //         map(() => ({ error: false, item })),
  //         catchError(() => of({ error: true, item })),
  //       )
  //     )
  //   )
  //   // patch state
  //   .pipe(
  //     tap(latestResults => {
  //       // [] -> {}
  //       const recordItems = state[part.name].reduce(
  //         (result, item) => {
  //           result[item.id] = item;
  //           return result;
  //         },
  //         {} as Record<string, any>
  //       );
  //       // update items
  //       latestResults.forEach(latestResult => {
  //         const {id, data} = latestResult.item;
  //         if (!latestResult.error && recordItems[id]) {
  //           recordItems[id] = { ...recordItems[id], ...data };
  //         }
  //         result.push({
  //           error: latestResult.error,
  //           item: recordItems[id]
  //         });
  //       });
  //       // patch database
  //       return patchState({
  //         [part.name]: Object.keys(recordItems).map(id => recordItems[id]),
  //       });
  //     }),
  //   );    
  // }

  @Action(RemoveItem)
  removeItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: RemoveItem) {
    const state = getState();
    const { part, databaseItem } = action;
    const partName = part.name;
    const currentPartData = state[partName] as undefined | DatabaseStatePartData;
    const id = databaseItem.id;
    const type = databaseItem.type;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    }
    return part.dataService.delete(id)
    .pipe(
      tap(() =>
      patchState(
        this.getPatchingData(
          partName,
          (currentPartData || {} as DatabaseStatePartData),
          this.updatePatchingItem(
            type,
            id,
            null,
            currentPartData as DatabaseStatePartData
          ),
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
    ['remoteLoaded', 'searchQuery', 'searchResult'].forEach(key => {
      if (updateKeys.includes(key)) {
        updateData[key] = data[key];
      }
    });
    // nested data
    ['itemsByType', 'fullItemsByOrigin'].forEach(key => {
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
    type: string,
    id: string,
    data: any,
    partData: DatabaseStatePartData
  ) {
    // itemsByType
    const thisItemsByType = (partData?.itemsByType?.[type] || {});
    Object.keys(thisItemsByType).forEach(page => {
      if (data !== null) {
        thisItemsByType[page].forEach((item, i) => {
          if (item.id !== id) {
            return;
          }
          thisItemsByType[page][i] = {...item, ...data};
        });
      } else {
        thisItemsByType[page] = thisItemsByType[page].filter(item => item.id !== id);
      }
    });
    // fullItemsByOrigin
    const fullItemsByOrigin = (partData?.fullItemsByOrigin || {});
    Object.keys(fullItemsByOrigin).forEach(origin => {
      if (data !== null) {
        fullItemsByOrigin[origin].all.forEach((item, i) => {
          if (item.id !== id) {
            return;
          }
          fullItemsByOrigin[origin].all[i] = {...item, ...data};
        })
      } else {
        fullItemsByOrigin[origin].all = fullItemsByOrigin[origin].all.filter(item => item.id !== id);
      }
    });
    // searchResult
    let searchResult = partData?.searchResult;
    if (searchResult) {
      if (data !== null) {
        searchResult.forEach(item => {
          if (item.id !== id) {
            return;
          }
          item = {...item, ...data};
        });
      } else {
        searchResult = searchResult.filter(item => item.id !== id);
      }
    }
    // result
    return {
      itemsByType: {
        [type]: thisItemsByType,
      },
      fullItemsByOrigin,
      searchResult,
    };
  }

}
