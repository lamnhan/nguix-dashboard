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
      this.loadProfiles();
    }),
  );

  public readonly data$ = this.store.select<UserStateModel>(state => state.user).pipe(
    map(userState => {
      this.isListingLoading = false;
      // set data
      const totalCount = this.profileDataService.count('default');
      const totalPages = Math.ceil(totalCount/this.pagePerView);
      const pageItems = userState.profilesByPage[this.pageNo] || [];
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
  pagePerView = 30;

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
      this.store.dispatch(new SearchProfiles(this.query, this.pagePerView));
    }
  }

  previousPage() {
    --this.pageNo;
    this.loadProfiles();
  }
  
  nextPage() {
    ++this.pageNo;
    this.loadProfiles();
  }
  
  private loadProfiles() {
    this.isListingLoading = true;
    this.store.dispatch(new GetProfiles(this.pageNo, this.pagePerView, true));
  }
}
