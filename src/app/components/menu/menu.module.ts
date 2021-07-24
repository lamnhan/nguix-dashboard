import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';
import { NguixIconComponentModule } from '@lamnhan/nguix-starter';

import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    NguixIconComponentModule,
  ],
  exports: [MenuComponent]
})
export class MenuComponentModule { }
