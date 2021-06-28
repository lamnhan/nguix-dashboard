import { Injectable } from '@angular/core';
import { NavItem, MenuItem } from '@lamnhan/ngx-useful';

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // guides
  guideMenu: NavItem[] = [
    {
      text: 'Guides',
      level: 0
    },
      {
        text: 'Introduction',
        level: 1,
        routerLink: ['guide', 'introduction']
      },
  ];

  // components
  componentMenu: NavItem[] = [
    {
      text: 'General',
      level: 0,
    },
      {
        text: 'Comp 1',
        level: 1,
        routerLink: ['component', 'comp1']
      },
  ];

  // pages
  pageMenu: NavItem[] = [
    {
      text: 'General',
      level: 0,
    },
      {
        text: 'Page 1',
        level: 1,
        routerLink: ['page', 'page1']
      },
  ];

  constructor() { }
}
