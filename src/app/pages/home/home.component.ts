import { Component, OnInit } from '@angular/core';
import { NavService, AuthService, UserService, SettingService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {
  constructor(
    public readonly navService: NavService,
    public readonly settingService: SettingService,
    public readonly authService: AuthService,
    public readonly userService: UserService,
  ) {}

  ngOnInit(): void {}

  gotoDashboard() {
    this.settingService.changePersona('dashboard');
    this.navService.navigate(['admin']);
  }

  signOut() {
    this.authService.signOut();
    this.settingService.changePersona('default');
  }
}
