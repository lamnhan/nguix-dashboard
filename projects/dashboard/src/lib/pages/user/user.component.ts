import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

import { UserStateModel, GetProfiles, SearchProfiles } from '../../states/user/user.state';

@Component({
  selector: 'nguix-dashboard-user-page',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserPage implements OnInit {

  public readonly page$ = this.route.params.pipe(
    map(params => ({ ok: true })),
    tap(() => {
      this.store.dispatch(new GetProfiles(this.pageNo, true));
    }),
  );

  public readonly data$ = this.store.select<UserStateModel>(state => state.user).pipe(
    map(userState => {
      this.isListingLoading = false;
      // set data
      const totalCount = this.profileDataService.count('default');
      const totalPages = Math.round(totalCount/this.pagePerView);
      const pageItems = userState.profiles || [];
      const searchQuery = userState.searchQuery;
      const searchItems = userState.searchResult;
      return {
        totalCount,
        totalPages,
        pageItems,
        searchQuery,
        searchItems,
      };
    }),
  );

  isListingLoading = false;
  role = 'all';
  query = '';
  pageNo = 1;
  pagePerView = 1;

  detailItem?: Profile;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private profileDataService: ProfileDataService,
  ) {}

  ngOnInit(): void {}

  search(currentQuery = '') {
    if (this.query && this.query !== currentQuery) {
      this.isListingLoading = true;
      // dispatch action
      this.store.dispatch(new SearchProfiles(this.query));
    }
  }

  previousPage() {
    console.log(this.pageNo);
  }
  
  nextPage() {
    console.log(this.pageNo);
  }
}
