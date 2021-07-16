import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';

export interface UserStateModel {
  users: any[]
}

export class GetUsers {
  static readonly type = '[User] Get all items';
  constructor() {}
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: [],
  },
})
@Injectable()
export class UserState {

  constructor() {}

  @Action(GetUsers)
  getUsers({ getState, patchState }: StateContext<UserStateModel>, action: GetUsers) {
    const state = getState();
  }

}
