import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { Profile } from '@lamnhan/schemata';
import { ProfileDataService } from '@lamnhan/ngx-schemata';

import { ConfigService, ListingGrouping } from '../../services/config/config.service';

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

  public readonly data$ = this.store.select<UserStateModel>(state => state.dashboard_user).pipe(
    map(userState => {
      this.isListingLoading = false;
      // set data
      const totalCount = this.profileDataService.count('default');
      const totalPages = (!totalCount || totalCount < 1) ? 1 : Math.ceil(totalCount / this.getViewPerPage());
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
  detailItem?: Profile;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private profileDataService: ProfileDataService,
    private configService: ConfigService,
  ) {}

  ngOnInit(): void {}

  search(currentQuery = '') {
    if (this.query && this.query !== currentQuery) {
      this.isListingLoading = true;
      // dispatch action
      this.store.dispatch(new SearchProfiles(this.query, this.getViewPerPage()));
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
    this.store.dispatch(new GetProfiles(this.pageNo, this.getViewPerPage(), true));
  }

  private getRoles(totalCount: number): ListingGrouping[] {
    const roles: ListingGrouping[] = [
      {
        title: 'All',
        value: 'all',
        count: totalCount,
      },
      {
        title: 'Super Admin',
        value: 'sadmin',
        count: 0
      },
      {
        title: 'Admin',
        value: 'admin',
        count: 0
      },
      {
        title: 'Editor',
        value: 'editor',
        count: 0
      },
      {
        title: 'Author',
        value: 'author',
        count: 0
      },
      {
        title: 'Contributor',
        value: 'contributor',
        count: 0
      },
      {
        title: 'Subscriber',
        value: 'subscriber',
        count: 0
      }
    ];
    return roles;
  }

  private getViewPerPage() {
    return this.configService.getConfig().viewPerPage || 15;
  }
}
