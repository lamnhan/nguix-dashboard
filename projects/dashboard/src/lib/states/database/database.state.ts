import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, take, switchMap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardPart } from '../../services/config/config.service';

export interface DatabaseStateModel {
  [part: string]: any[];
}

export class GetPart {
  static readonly type = '[Database] Get part data (collection items)';
  constructor(public part: DashboardPart) {}
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
    const {part} = action;
    return (
      state[part.name]
        // loaded
        ? of(state[part.name])
        // fresh
        : (
          !part.dataService
            ? of([] as any[])
            : part.dataService.getCollection(ref => ref.orderBy('createdAt', 'desc'), false)
        )
    )
    .pipe(
      tap(items => patchState({[part.name]: items}))
    );
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
        )
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
        take(1),
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
        take(1),
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

}
