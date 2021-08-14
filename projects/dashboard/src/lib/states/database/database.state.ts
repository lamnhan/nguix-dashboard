import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
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

// export class ChangeStatus {
//   static readonly type = '[Database] Change status by origin';
//   constructor(public part: DashboardPart, public databaseItem: DatabaseItem, public status: string) {}
// }

// export class AddItem {
//   static readonly type = '[Database] Add item';
//   constructor(public part: DashboardPart, public id: string, public data: any) {}
// }

// export class UpdateItem {
//   static readonly type = '[Database] Update item';
//   constructor(public part: DashboardPart, public id: string, public data: any) {}
// }

// export class UpdateBatch {
//   static readonly type = '[Database] Update batch';
//   constructor(
//     public part: DashboardPart,
//     public batch: Array<{id: string; data: any}>,
//     public result: any[] = [],
//   ) {}
// }

// export class DeleteItem {
//   static readonly type = '[Database] Delete item';
//   constructor(public part: DashboardPart, public databaseItem: DatabaseItem) {}
// }

export interface DatabaseStatePartData {
  // listing
  remoteLoaded: boolean;
  itemsByType: Record<string, Record<string, DatabaseItem[]>>;
  localizedItemsByOrigin: Record<string, DatabaseItem[]>;
  // search
  searchQuery?: string;
  searchResult?: DatabaseItem[];
}

export interface DatabaseStateModel {
  [part: string]: DatabaseStatePartData;
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
    if (currentPartData?.itemsByType?.[type]?.[pageNo]) {
      if (refresh) {
        patchState({
          [partName]: currentPartData,
        });
      }
      return of(currentPartData.itemsByType[type][pageNo]);
    } else {
      return (
        !part.dataService
          ? of([] as any[])
          : part.dataService.getCollection(
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
                query = query.startAfter(lastItem.createdAt as string);
              }
              return query.limit(limit);
            },
            false,
          )
      )
      .pipe(
        tap((items: DatabaseItem[]) =>
          patchState({
            [partName]: {
              ...(currentPartData as DatabaseStatePartData || {}),
              itemsByType: {
                ...((currentPartData as DatabaseStatePartData)?.itemsByType || {}),
                [type]: {
                  ...((currentPartData as DatabaseStatePartData)?.itemsByType?.[type] || {}),
                  [pageNo]: items,
                }
              },
            }
          })
        )
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

  // @Action(AddItem)
  // addItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: AddItem) {
  //   const state = getState();
  //   const {part, id, data} = action;
  //   if (!part.dataService) {
  //     throw new Error('No data service for this part.');
  //   }
  //   return (part.dataService as DatabaseData<any>).add(id, data).pipe(
  //     tap(() =>
  //       patchState({
  //         [part.name]: ([data] as any[]).concat(state[part.name]),
  //       })
  //     ),
  //   );
  // }

  // @Action(UpdateItem)
  // updateItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateItem) {
  //   const state = getState();
  //   const {part, id, data} = action;
  //   if (!part.dataService) {
  //     throw new Error('No data service for this part.');
  //   }
  //   return part.dataService.update(id, data).pipe(
  //     tap(() => {
  //       const items = state[part.name].map(item => {
  //         if (item.id === id) {
  //           return {...item, ...data};
  //         } else {
  //           return item;
  //         }
  //       });
  //       return patchState({ [part.name]: items});
  //     })
  //   );
  // }

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

  // @Action(DeleteItem)
  // deleteItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: DeleteItem) {
  //   const state = getState();
  //   const {part, databaseItem} = action;
  //   const originOrId = databaseItem.origin || databaseItem.id;
  //   if (!part.dataService) {
  //     throw new Error('No data service for this part.');
  //   }
  //   return combineLatest(
  //     state[part.name]
  //       .filter(item => item.id === originOrId || item.origin === originOrId)
  //       .map(item => (part.dataService as DatabaseData<any>).delete(item.id))
  //   )
  //   .pipe(
  //     tap(() =>
  //       patchState({
  //         [part.name]: state[part.name]
  //           .filter(item => item.id !== originOrId && item.origin !== originOrId),
  //       })
  //     ),
  //   );
  // }

}
