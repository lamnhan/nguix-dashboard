import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

@Pipe({
  name: 'userQueryFilter'
})
export class UserQueryFilterPipe implements PipeTransform {
  transform(items: Profile[], query?: string): Profile[] {
    return !query
      ? items
      : items.filter(item => item.id.indexOf(query) !== -1);
  }
}
