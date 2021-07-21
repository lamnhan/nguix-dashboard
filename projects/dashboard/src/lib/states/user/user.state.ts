import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { User } from '@lamnhan/schemata';
import { UserDataService, ProfileDataService } from '@lamnhan/ngx-schemata';

export interface UserStateModel {
  users: User[];
}

export class GetUsers {
  static readonly type = '[User] Get all user';
  constructor(public refresh = false) {}
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: [],
  },
})
@Injectable()
export class UserState {

  constructor(
    private userDataService: UserDataService,
    private profileDataService: ProfileDataService,
  ) {}

  @Action(GetUsers)
  getUsers({ getState, patchState }: StateContext<UserStateModel>, action: GetUsers) {
    const state = getState();
    if (state.users.length) {
      if (action.refresh) {
        patchState({ users: state.users });
      }
      return of(state.users);
    } else {
      return this.userDataService.getCollection(undefined, false).pipe(
        tap(users => patchState({ users }))
      );
    }
  }

}
