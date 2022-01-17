import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CameraRoutingModule } from './camera-routing.module';
import { CameraComponent } from './camera.component';
import {WebcamModule} from "ngx-webcam";


@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    CameraRoutingModule,
    WebcamModule
  ],
  exports: [CameraComponent]
})
export class CameraModule { }
