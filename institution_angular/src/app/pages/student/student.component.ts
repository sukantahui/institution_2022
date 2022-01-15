import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";
import {ConfirmationService, PrimeNGConfig} from "primeng/api";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService]

})
export class StudentComponent implements OnInit{
  loginType: any;
  students: Student[] = [];

  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;

  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
  }


  confirm() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
      },
      reject: () => {
        this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
    }


  ngOnInit(): void {
    this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) =>{
      this.students = response;
    });
  }

}
