import { Component, OnInit } from '@angular/core';
import { tap, take } from 'rxjs/operators';
import { MetaService, SettingService, NavService, AuthService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public readonly page$ = this.settingService.onLocaleChanged.pipe(
    tap(locale =>
      this.metaService.changePageMetas(
        {
          title: 'Register',
          description: 'Register new account',
        },
        true
      )
    )
  );

  authChecked = false;

  constructor(
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
    this.nav.navigate([url]);
  }

}
