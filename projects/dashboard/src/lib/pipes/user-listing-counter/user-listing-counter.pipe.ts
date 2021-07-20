import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@lamnhan/schemata';

@Pipe({
  name: 'userListingCounter'
})
export class UserListingCounterPipe implements PipeTransform {
  transform(items: User[], counting: {total: number}): User[] {
    counting.total = items.length;
    return items;
  }
}
