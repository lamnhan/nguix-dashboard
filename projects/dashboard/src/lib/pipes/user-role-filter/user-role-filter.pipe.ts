import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@lamnhan/schemata';

@Pipe({
  name: 'userRoleFilter'
})
export class UserRoleFilterPipe implements PipeTransform {
  transform(items: User[], role?: string): User[] {
    return !role || role === 'all'
      ? items
      : items.filter(item => item.claims?.role === role);
  }
}
