import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { ComponentsRoutingModule } from './components-routing.module';
import { ComponentsComponent } from './components.component';


@NgModule({
  declarations: [
    ComponentsComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsPageModule {}
