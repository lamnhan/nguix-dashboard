import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

export interface UserStateModel {
  profiles: Profile[];
}

export class GetProfiles {
  static readonly type = '[User] Get all profiles';
  constructor(public refresh = false) {}
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    profiles: [],
  },
})
@Injectable()
export class UserState {

  constructor(
    private profileDataService: ProfileDataService,
  ) {}

  @Action(GetProfiles)
  getProfiles({ getState, patchState }: StateContext<UserStateModel>, action: GetProfiles) {
    const state = getState();
    if (state.profiles.length) {
      if (action.refresh) {
        patchState({ profiles: state.profiles });
      }
      return of(state.profiles);
    } else {
      return this.profileDataService.getCollection(
        ref => ref.where('type', '==', 'user'),
        false
      )
      .pipe(
        tap(profiles => patchState({ profiles }))
      );
    }
  }

}
