import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

export class GetProfiles {
  static readonly type = '[User] Get profiles';
  constructor(public pageNo = 1, public refresh = false) {}
}

export class SearchProfiles {
  static readonly type = '[User] Search profiles';
  constructor(public query: string) {}
}

export interface UserStateModel {
  profiles: Profile[];
  searchQuery?: string;
  searchResult?: Profile[];
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
    const { profiles: currentProfiles } = getState();
    const { pageNo, refresh } = action;
    if (currentProfiles.length) {
      if (refresh) {
        patchState({ profiles: currentProfiles });
      }
      return of(currentProfiles);
    } else {
      return this.profileDataService.getCollection(
        ref => ref
          .where('type', '==', 'default')
          .orderBy('createdAt', 'desc')
          .limit(1),
        false
      )
      .pipe(
        tap(profiles => patchState({ profiles }))
      );
    }
  }

  @Action(SearchProfiles)
  searchProfiles({ getState, patchState }: StateContext<UserStateModel>, action: SearchProfiles) {
    const {
      searchQuery: currentSearchQuery,
      searchResult: currentSearchResult
    } = getState();
    const { query } = action;
  }

}
