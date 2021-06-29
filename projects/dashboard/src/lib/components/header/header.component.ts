import { Component, OnInit } from '@angular/core';
import { MenuItem, AppService, NavService, SettingService, UserService } from '@lamnhan/ngx-useful';

import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'nguix-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(
    public readonly appService: AppService,
    public readonly navService: NavService,
    public readonly settingService: SettingService,
    public readonly userService: UserService,
    public readonly dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.menuItems = this.dashboardService.getMenu();
  }

  exitDashboard() {
    this.settingService.changePersona('default');
    this.navService.navigate(['']);
  }
}
