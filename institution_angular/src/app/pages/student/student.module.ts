import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    StudentComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class StudentModule { }
