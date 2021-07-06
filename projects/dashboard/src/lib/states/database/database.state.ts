import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { DatabaseData } from '@lamnhan/ngx-useful';

import { DashboardPart } from '../../services/config/config.service';

export interface DatabaseStateModel {
  [part: string]: any[];
}

export class GetPart {
  static readonly type = '[Database] Get part';
  constructor(public part: DashboardPart) {}
}

export class ChangeStatus {
  static readonly type = '[Database] Change status';
  constructor(public part: DashboardPart, public origin: string, public status: string) {}
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
