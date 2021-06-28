import { Component, OnInit } from '@angular/core';
import { NavService, AuthService, UserService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  constructor(
    public readonly navService: NavService,
    public readonly authService: AuthService,
    public readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.authService.onAuthStateChanged.subscribe(console.log);
    this.userService.onUserChanged.subscribe(console.log);
  }

  signOut() {
    this.authService.signOut();
  }
}
