import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { NavItem } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  @Input() menuName = '';
  @Input() menuItems: NavItem[] = [];
  @Input() content = '';
  @Input() contentSrc?: string;

  @Input() bodyTemplate?: TemplateRef<any>;

  errorMessage = '';

  constructor() { }

  ngOnInit(): void {}

  onError(e: any) {
    this.errorMessage = e.message;
  }

}
