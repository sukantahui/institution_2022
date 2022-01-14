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

  constructor(private activatedRoute: ActivatedRoute, private studentService: StudentService, private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
    this.dataSource = new MatTableDataSource(this.students);
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }


  confirm() {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
          //Actual logic to perform a confirmation
          console.log('Accepted');
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
