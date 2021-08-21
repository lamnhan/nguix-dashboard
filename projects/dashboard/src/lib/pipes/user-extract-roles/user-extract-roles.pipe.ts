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
      if (item.role === 'sadmin') {
        sadmin.count++;
      } else if (item.role === 'admin') {
        admin.count++;
      } else if (item.role === 'editor') {
        editor.count++;
      } else if (item.role === 'author') {
        author.count++;
      } else if (item.role === 'contributor') {
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
