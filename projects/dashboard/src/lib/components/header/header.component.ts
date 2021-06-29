import { Component, OnInit } from '@angular/core';
import { MenuItem, AppService, UserService, NavService, SettingService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'nguix-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    public readonly app: AppService,
    public readonly user: UserService,
    public readonly nav: NavService,
    public readonly setting: SettingService,
  ) {}

  ngOnInit(): void {}

  exitDashboard() {
    this.setting.changePersona('default');
    this.nav.navigate(['']);
  }
}
