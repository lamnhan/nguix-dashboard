import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

import { ListingGrouping } from '../../services/config/config.service';

@Pipe({
  name: 'userExtractRoles'
})
export class UserExtractRolesPipe implements PipeTransform {
  transform(items: Profile[]): ListingGrouping[] {
    const all: ListingGrouping = {
      title: 'All',
      value: 'all',
      count: 0
    };
    const sadmin: ListingGrouping = {
      title: 'Super Admin',
      value: 'sadmin',
      count: 0
    };
    const admin: ListingGrouping = {
      title: 'Admin',
      value: 'admin',
      count: 0
    };
    const editor: ListingGrouping = {
      title: 'Editor',
      value: 'editor',
      count: 0
    };
    const author: ListingGrouping = {
      title: 'Author',
      value: 'author',
      count: 0
    };
    const contributor: ListingGrouping = {
      title: 'Contributor',
      value: 'contributor',
      count: 0
    };
    const subscriber: ListingGrouping = {
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
