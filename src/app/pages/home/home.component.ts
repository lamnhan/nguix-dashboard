import { Component, OnInit } from '@angular/core';
import { NavService, AuthService, UserService, SettingService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  
  installContent =
`Install:
\`\`\`sh
npm i @lamnhan/nguix-dashboard
\`\`\``;

  usageContent =
`Create the module \`app-dashboard.module.ts\`, see example [here](https://github.com/lamnhan/nguix-dashboard/blob/main/src/app/app-dashboard.module.ts).

\`\`\`ts
// Import --> app.module.ts
import { AppDashboardModule } from './app-dashboard.module';

@NgModule({ imports: [AppDashboardModule] })
\`\`\``;

  constructor(
    public readonly navService: NavService,
    public readonly settingService: SettingService,
    public readonly authService: AuthService,
    public readonly userService: UserService,
  ) {}

  ngOnInit(): void {}

  gotoDashboard() {
    this.settingService.changePersona('dashboard');
    this.navService.navigate(['app-dashboard']);
  }

  signOut() {
    this.authService.signOut();
    this.settingService.changePersona('default');
  }
}
