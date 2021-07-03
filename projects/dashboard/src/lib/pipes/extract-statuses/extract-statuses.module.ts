import { NgModule } from '@angular/core';

import { ExtractStatusesPipe } from './extract-statuses.pipe';

@NgModule({
  declarations: [ExtractStatusesPipe],
  exports: [ExtractStatusesPipe]
})
export class NguixDashboardExtractStatusesPipeModule { }
