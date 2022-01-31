import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsynchronousSequentialCircuitsRoutingModule } from './asynchronous-sequential-circuits-routing.module';
import { AsynchronousSequentialCircuitsComponent } from './asynchronous-sequential-circuits.component';


@NgModule({
  declarations: [
    AsynchronousSequentialCircuitsComponent
  ],
  exports: [
    AsynchronousSequentialCircuitsComponent
  ],
  imports: [
    CommonModule,
    AsynchronousSequentialCircuitsRoutingModule
  ]
})
export class AsynchronousSequentialCircuitsModule { }
