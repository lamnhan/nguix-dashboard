import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { Profile } from '@lamnhan/schemata';

import { GetProfiles } from '../../states/user/user.state';

@Component({
  selector: 'nguix-dashboard-user-page',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserPage implements OnInit {

  public readonly page$ = this.route.params.pipe(
    map(params => ({ ok: true })),
    tap(() => {
      this.store.dispatch(new GetProfiles(this.viewPerPage, true));
    }),
  );

  public readonly data$ = this.store.select(state => state.user).pipe(
    map(user => {
      const listingItems = user.profiles || [];
      return {
        listingItems,
      };
    }),
  );

  viewPerPage = 10;
  pageNo = 1;
  role = 'all';
  query = '';

  detailItem?: Profile;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  changeViewPerPage(e: any) {
    const no = +e.target.value;
    console.log({ no });
  }

  changePage(page: number) {
    console.log({ page });
  }

}
