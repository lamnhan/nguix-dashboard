import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@lamnhan/schemata';

@Pipe({
  name: 'userQueryFilter'
})
export class UserQueryFilterPipe implements PipeTransform {
  transform(items: User[], query?: string): User[] {
    return !query
      ? items
      : items.filter(item => (item.email || '').indexOf(query) !== -1);
  }
}
