import { Component, NgZone, OnInit } from '@angular/core';
import { tap, take } from 'rxjs/operators';
import { MetaService, SettingService, NavService, AuthService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public readonly page$ = this.settingService.onLocaleChanged.pipe(
    tap(locale =>
      this.metaService.changePageMetas(
        {
          title: 'Login',
          description: 'Login your account',
        },
        true
      )
    )
  );

  authChecked = false;

  constructor(
    private ngZone: NgZone,
    private metaService: MetaService,
    private settingService: SettingService,
    public readonly nav: NavService,
    public readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged.pipe(take(1)).subscribe(nativeUser => {
      if (nativeUser) {
        this.onSignedIn();
      } else {
        this.authChecked = true;
      }
    });
  }

  onSignedIn() {
    const url = this.auth.redirectUrl ? this.auth.redirectUrl : '';
    this.auth.setRedirectUrl(null); // reset auth redirect
    this.ngZone.run(() => this.nav.navigate([url], {backwardable: false}));
  }

}
