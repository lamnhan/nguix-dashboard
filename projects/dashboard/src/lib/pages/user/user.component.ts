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
    map(params => {
      return { ok: true };
    }),
    tap(() => {
      this.store.dispatch(new GetProfiles(true));
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

  query = '';
  role = 'all';
  pageNo = 1;
  counting = {
    total: 0,
  };

  detailItem?: Profile;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

}
