import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

@Pipe({
  name: 'userListingCounter'
})
export class UserListingCounterPipe implements PipeTransform {
  transform(items: Profile[], counting: {total: number}): Profile[] {
    counting.total = items.length;
    return items;
  }
}
