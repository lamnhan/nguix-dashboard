import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

@Pipe({
  name: 'userGetRole'
})
export class UserGetRolePipe implements PipeTransform {
  transform(item: Profile): string {
    const badges = item.badges || [];
    let role = '';
    if (badges.indexOf('sadmin') !== -1) {
      role = 'sadmin';
    } else if (badges.indexOf('admin') !== -1) {
      role = 'admin';
    } else if (badges.indexOf('editor') !== -1) {
      role = 'editor';
    } else if (badges.indexOf('author') !== -1) {
      role = 'author';
    } else if (badges.indexOf('contributor') !== -1) {
      role = 'contributor';
    } else {
      role = 'subscriber';
    }
    return role;
  }
}
