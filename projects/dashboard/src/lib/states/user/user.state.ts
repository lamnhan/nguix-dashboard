import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { State, Action, StateContext } from '@ngxs/store';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

export class GetProfiles {
  static readonly type = '[User] Get profiles';
  constructor(public pageNo: number, public limit: number, public refresh = false) {}
}

export class SearchProfiles {
  static readonly type = '[User] Search profiles';
  constructor(public searchQuery: string, public limit: number) {}
}

export interface UserStateModel {
  profilesByPage: Record<string, Profile[]>;
  // search
  searchQuery?: string;
  searchResult?: Profile[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    profilesByPage: {},
  },
})
@Injectable()
export class UserState {

  constructor(
    private profileDataService: ProfileDataService,
  ) {}

  @Action(GetProfiles)
  getProfiles({ getState, patchState }: StateContext<UserStateModel>, action: GetProfiles) {
    const { profilesByPage: currentProfilesByPage } = getState();
    const { limit, pageNo, refresh } = action;
    if (currentProfilesByPage[pageNo]?.length) {
      if (refresh) {
        const profiles = currentProfilesByPage[pageNo];
        patchState({
          profilesByPage: { ...currentProfilesByPage, [pageNo]: profiles },
        });
      }
      return of(currentProfilesByPage[pageNo]);
    } else {
      return this.profileDataService.list(
        ref => {
          let query = ref
            .where('type', '==', 'default')
            .where('status', 'in', ['draft', 'publish', 'archive', 'trash']) // for indexing
            .orderBy('createdAt', 'desc');
          if (pageNo > 1) {
            const prevPageNo = pageNo - 1;
            const prevItems = currentProfilesByPage[prevPageNo];
            const lastItem = prevItems[prevItems.length - 1];
            query = query.startAfter(lastItem.createdAt);
          }
          return query.limit(limit);
        },
        false
      )
      .pipe(
        tap(profiles =>
          patchState({
            profilesByPage: { ...currentProfilesByPage, [pageNo]: profiles },
          })
        )
      );
    }
  }

  @Action(SearchProfiles)
  searchProfiles({ getState, patchState }: StateContext<UserStateModel>, action: SearchProfiles) {
    const {
      searchQuery: currentSearchQuery,
      searchResult: currentSearchResult
    } = getState();
    const { searchQuery, limit } = action;
    if (currentSearchQuery === searchQuery && currentSearchResult?.length) {
      return of(currentSearchResult).pipe(
        tap(() => patchState({ searchResult: currentSearchResult })),
      );
    } else {
      return combineLatest([
        // match id
        this.profileDataService.get(searchQuery, false),
        // match searching
        this.profileDataService.setupSearching().pipe(
          switchMap(() =>
            this.profileDataService.search(searchQuery, limit).list()
          ),
        ),
      ])
      .pipe(
        tap(([byIdItem, bySearchingItems]) => {
          // items
          const items = [] as Profile[];
          if (byIdItem) {
            items.push(byIdItem);
          }
          items.push(...bySearchingItems);
          const duplicatedIds: string[] = [];
          const searchResult = items
            .filter(item => {
              const isDuplicated = duplicatedIds.includes(item.id);
              duplicatedIds.push(item.id);
              return !isDuplicated;
            })
            .slice(0, limit);
          // patch
          return patchState({
            searchQuery,
            searchResult,
          });
        })
      );
    }
  }

}
