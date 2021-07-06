import { NgModule } from '@angular/core';

import { ListingCounterPipe } from './listing-counter.pipe';

@NgModule({
  declarations: [ListingCounterPipe],
  exports: [ListingCounterPipe]
})
export class NguixDashboardListingCounterPipeModule { }
