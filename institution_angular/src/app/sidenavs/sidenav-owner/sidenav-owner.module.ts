import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidenavOwnerRoutingModule } from './sidenav-owner-routing.module';
import { SidenavOwnerComponent } from './sidenav-owner.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
    declarations: [
        SidenavOwnerComponent
    ],
    exports: [
        SidenavOwnerComponent
    ],
    imports: [
        CommonModule,
        SidenavOwnerRoutingModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatFormFieldModule
    ]
})
export class SidenavOwnerModule { }
