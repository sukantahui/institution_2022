import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlipFlopRoutingModule } from './flip-flop-routing.module';
import { FlipFlopComponent } from './flip-flop.component';
import {MatTabsModule} from "@angular/material/tabs";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {SliderModule} from "primeng/slider";
import {MatBadgeModule} from "@angular/material/badge";


@NgModule({
  declarations: [
    FlipFlopComponent
  ],
  imports: [
    CommonModule,
    FlipFlopRoutingModule,
    MatTabsModule,
    ToggleButtonModule,
    FormsModule,
    SliderModule,
    MatBadgeModule
  ]
})
export class FlipFlopModule { }
