import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { DashboardPart } from '../services/config/config.service';

export interface DatabaseStateModel {
  [part: string]: any[];
}

export class GetPart {
  static readonly type = '[Database] Get part';
  constructor(public part: DashboardPart) {}
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
    const part = action.part;
    // loaded
    if (state[part.name]) {
      return of(state[part.name]);
    }
    // fresh
    return (
      !part.dataService
        ? of([] as any[])
        : part.dataService.getCollection(ref => ref.orderBy('createdAt', 'desc'), false)
    ).pipe(
      tap(items => patchState({[part.name]: items}))
    );
  }

}
