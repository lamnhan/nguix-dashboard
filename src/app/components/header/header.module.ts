import { NgModule } from '@angular/core';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';
import { NguixIconComponentModule } from '@lamnhan/nguix-starter';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    RouterLinkDirectiveModule,
    NguixIconComponentModule,
  ],
  exports: [HeaderComponent]
})
export class HeaderComponentModule { }
