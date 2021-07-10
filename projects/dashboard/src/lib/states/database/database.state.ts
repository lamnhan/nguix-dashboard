import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardPart } from '../../services/config/config.service';

export interface DatabaseStateModel {
  [part: string]: any[];
}

export class GetPart {
  static readonly type = '[Database] Get part data (collection items)';
  constructor(public part: DashboardPart, public refresh = false) {}
}

export class ChangeStatus {
  static readonly type = '[Database] Change status by origin';
  constructor(public part: DashboardPart, public origin: string, public status: string) {}
}

export class AddItem {
  static readonly type = '[Database] Add item';
  constructor(public part: DashboardPart, public id: string, public data: any) {}
}

export class UpdateItem {
  static readonly type = '[Database] Update item';
  constructor(public part: DashboardPart, public id: string, public data: any) {}
}

export class UpdateBatch {
  static readonly type = '[Database] Update batch';
  constructor(public part: DashboardPart, public batch: Array<{id: string; data: any}>) {}
}

export class DeleteItem {
  static readonly type = '[Database] Delete item';
  constructor(public part: DashboardPart, public origin: string) {}
}

@State<DatabaseStateModel>({
  name: 'database',
  defaults: {},
})
@Injectable()
export class DatabaseState {

  constructor() {}

  @Action(GetPart)
  getPart({ getState, patchState }: StateContext<DatabaseStateModel>, action: GetPart) {
    const state = getState();
    const {part, refresh} = action;
    if (state[part.name]) {
      const items = state[part.name];
      if (refresh) {
        patchState({[part.name]: items})
      }
      return of(items);
    } else {
      return (
        !part.dataService
          ? of([] as any[])
          : part.dataService.getCollection(ref => ref.orderBy('createdAt', 'desc'), false)
      )
      .pipe(
        tap(items => patchState({[part.name]: items}))
      );
    }
  }

  @Action(ChangeStatus)
  changeStatus({ getState, patchState }: StateContext<DatabaseStateModel>, action: ChangeStatus) {
    const state = getState();
    const {part, origin, status} = action;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    } else {
      return combineLatest(
        state[part.name]
          .filter(item => item.origin === origin)
          .map(item => (part.dataService as DatabaseData<any>).update(item.id, {status}))
      )
      .pipe(
        tap(() =>
          patchState({
            [part.name]: state[part.name].map(item => {
              if (item.origin === origin) {
                item.status = status;
              }
              return item;
            }),
          })
        ),
      );
    }
  }

  @Action(AddItem)
  addItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: AddItem) {
    const state = getState();
    const {part, id, data} = action;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    } else {
      return (part.dataService as DatabaseData<any>).add(id, data).pipe(
        tap(() =>
          patchState({
            [part.name]: ([data] as any[]).concat(state[part.name]),
          })
        ),
      );
    }
  }

  @Action(UpdateItem)
  updateItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateItem) {
    const state = getState();
    const {part, id, data} = action;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    } else {
      return part.dataService.update(id, data).pipe(
        tap(() => {
          const items = state[part.name].map(item => {
            if (item.id === id) {
              item = {...item, ...data};
            }
            return item;
          });
          return patchState({ [part.name]: items});
        })
      );
    }
  }

  @Action(UpdateBatch)
  updateBatch({ getState, patchState }: StateContext<DatabaseStateModel>, action: UpdateBatch) {
    const state = getState();
    const {part, batch} = action;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    } else {
      return combineLatest(batch.map(item =>
        (part.dataService as DatabaseData<any>)
          .update(item.id, item.data)
          .pipe(
            map(() => item),
            catchError(() => of(null)),
          )
      ))
      .pipe(
        tap(resultItems => {
          // [] -> {}
          const recordItems = state[part.name].reduce(
            (result, item) => {
              result[item.id] = item;
              return result;
            },
            {} as Record<string, any>
          );
          // update items
          resultItems
            .filter(item => !!item)
            .forEach(item => {
              const {id, data} = item as {id: string; data: any};
              if (recordItems[id]) {
                recordItems[id] = { ...recordItems[id], ...data };
              }
            });
          // patch database
          return patchState({
            [part.name]: Object.keys(recordItems).map(id => recordItems[id]),
          });
        }),
      );
    }
  }

  @Action(DeleteItem)
  deleteItem({ getState, patchState }: StateContext<DatabaseStateModel>, action: DeleteItem) {
    const state = getState();
    const {part, origin} = action;
    if (!part.dataService) {
      throw new Error('No data service for this part.');
    } else {
      return combineLatest(
        state[part.name]
          .filter(item => item.origin === origin)
          .map(item => (part.dataService as DatabaseData<any>).delete(item.id))
      )
      .pipe(
        tap(() =>
          patchState({
            [part.name]: state[part.name].filter(item => item.origin !== origin),
          })
        ),
      );
    }
  }

}
