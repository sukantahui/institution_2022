import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  loginType: any;
  students: Student[] = [];
  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
    console.log('Login Type: ', this.loginType);
  }

  ngOnInit(): void {
    this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) =>{
      this.students = response;
    });
  }

}
