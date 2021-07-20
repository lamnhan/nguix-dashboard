import { NgModule } from '@angular/core';

import { UserListingCounterPipe } from './user-listing-counter.pipe';

@NgModule({
  declarations: [UserListingCounterPipe],
  exports: [UserListingCounterPipe]
})
export class NguixDashboardUserListingCounterPipeModule { }
