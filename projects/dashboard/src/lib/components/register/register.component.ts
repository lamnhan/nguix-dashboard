import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nguix-dashboard-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() show = false;
  @Input() closeOnCompleted = false;
  @Output() close = new EventEmitter<void>();
  @Output() done = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
