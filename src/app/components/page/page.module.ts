import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';
import { NguixContentComponentModule } from '@lamnhan/nguix-starter';

import { MenuComponentModule } from '../menu/menu.module';

import { PageComponent } from './page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    MenuComponentModule,
    NguixContentComponentModule,
    RouterLinkDirectiveModule,
  ],
  exports: [PageComponent]
})
export class PageComponentModule {}
