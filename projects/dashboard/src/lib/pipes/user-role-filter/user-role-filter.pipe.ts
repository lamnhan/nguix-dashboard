import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

@Pipe({
  name: 'userRoleFilter'
})
export class UserRoleFilterPipe implements PipeTransform {
  transform(items: Profile[], role: string): Profile[] {
    return role === 'all'
      ? items
      : items.filter(item => item.role === role);
  }
}
