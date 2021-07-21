import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

@Pipe({
  name: 'userRoleFilter'
})
export class UserRoleFilterPipe implements PipeTransform {
  transform(items: Profile[], role?: string): Profile[] {
    return !role || role === 'all'
      ? items
      : items.filter(item => {
        const badges = item.badges || [];
        if (role !== 'subscriber') {
          return badges.indexOf(role) !== -1;
        } else {
          return true;
        }
      });
  }
}
