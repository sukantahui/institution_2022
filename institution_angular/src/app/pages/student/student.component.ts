import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmationService, PrimeNGConfig} from "primeng/api";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService]

})
export class StudentComponent implements OnInit, AfterViewInit {
  loginType: any;
  students: Student[] = [];
  displayedColumns=['index','episodeId','studentName','district'];
  dataSource=new MatTableDataSource(this.students) ;
 // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;

  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
    this.dataSource = new MatTableDataSource(this.students);
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    }

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
    this.dataSource = new MatTableDataSource(this.students);
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) =>{
      this.students = response;
      this.dataSource = new MatTableDataSource(this.students);
      this.dataSource.paginator = this.paginator;
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    let value1 = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value1.trim().toLowerCase();
  }
}
