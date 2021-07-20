import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@lamnhan/schemata';

import { DashboardListingUserRole } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'userExtractRoles'
})
export class UserExtractRolesPipe implements PipeTransform {
  transform(items: User[]): DashboardListingUserRole[] {
    const all: DashboardListingUserRole = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const sadmin: DashboardListingUserRole = {
      title: 'SAdmin',
      value: 'sadmin',
      count: 0
    };
    const admin: DashboardListingUserRole = {
      title: 'Admin',
      value: 'admin',
      count: 0
    };
    const editor: DashboardListingUserRole = {
      title: 'Editor',
      value: 'editor',
      count: 0
    };
    const author: DashboardListingUserRole = {
      title: 'Author',
      value: 'author',
      count: 0
    };
    const contributor: DashboardListingUserRole = {
      title: 'Contributor',
      value: 'contributor',
      count: 0
    };
    const subscriber: DashboardListingUserRole = {
      title: 'Subscriber',
      value: 'subscriber',
      count: 0
    };
    // counting
    items.forEach(item => {
      const { role = 'subscriber' } = item.claims || {};
      if (role === 'sadmin') {
        sadmin.count++;
      } else if (role === 'admin') {
        admin.count++;
      } else if (role === 'editor') {
        editor.count++;
      } else if (role === 'author') {
        author.count++;
      } else if (role === 'contributor') {
        contributor.count++;
      } else if (role === 'subscriber') {
        subscriber.count++;
      }
      all.count++;
    });
    // result
    return [all, sadmin, admin, editor, author, contributor, subscriber];
  }
}
