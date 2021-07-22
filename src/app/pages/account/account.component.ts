import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { MetaService, SettingService, NavService, AuthService, UserService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public readonly page$ = this.settingService.onLocaleChanged.pipe(
    tap(locale =>
      this.metaService.changePageMetas(
        {
          title: 'Account',
          description: 'Manage my account',
        },
        true
      )
    )
  );

  constructor(
    private metaService: MetaService,
    private settingService: SettingService,
    public readonly nav: NavService,
    public readonly auth: AuthService,
    public readonly user: UserService,
  ) {}

  ngOnInit(): void {}

  signOut() {
    const yes = confirm('Sign out now?');
    if (yes) {
      this.auth.signOut();
      this.nav.navigate(['']);
    }
  }
}
