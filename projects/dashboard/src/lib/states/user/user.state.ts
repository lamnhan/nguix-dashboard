import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

export interface UserStateModel {
  profiles: Profile[];
}

export class GetProfiles {
  static readonly type = '[User] Get all profiles';
  constructor(public length = 10, public refresh = false) {}
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
    const { length, refresh } = action;
    if (state.profiles.length) {
      if (refresh) {
        patchState({ profiles: state.profiles });
      }
      return of(state.profiles);
    } else {
      return this.profileDataService.getCollection(
        ref => ref.where('type', '==', 'default').limit(length),
        false
      )
      .pipe(
        tap(profiles => patchState({ profiles }))
      );
    }
  }

}
