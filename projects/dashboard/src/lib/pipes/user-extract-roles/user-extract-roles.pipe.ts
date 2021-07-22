import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

import { DashboardListingUserRole } from '../../services/dashboard/dashboard.service';

@Pipe({
  name: 'userExtractRoles'
})
export class UserExtractRolesPipe implements PipeTransform {
  transform(items: Profile[]): DashboardListingUserRole[] {
    const all: DashboardListingUserRole = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const sadmin: DashboardListingUserRole = {
      title: 'Super Admin',
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
      const badges = item.badges || [];
      if (badges.indexOf('sadmin') !== -1) {
        sadmin.count++;
      } else if (badges.indexOf('admin') !== -1) {
        admin.count++;
      } else if (badges.indexOf('editor') !== -1) {
        editor.count++;
      } else if (badges.indexOf('author') !== -1) {
        author.count++;
      } else if (badges.indexOf('contributor') !== -1) {
        contributor.count++;
      } else {
        subscriber.count++;
      }
      all.count++;
    });
    // result
    return [all, sadmin, admin, editor, author, contributor, subscriber];
  }
}
