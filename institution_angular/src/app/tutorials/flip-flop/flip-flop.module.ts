import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlipFlopRoutingModule } from './flip-flop-routing.module';
import { FlipFlopComponent } from './flip-flop.component';
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  declarations: [
    FlipFlopComponent
  ],
  imports: [
    CommonModule,
    FlipFlopRoutingModule,
    MatTabsModule,
  ]
})
export class FlipFlopModule { }
