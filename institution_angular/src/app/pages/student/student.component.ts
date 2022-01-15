import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from "primeng/api";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class StudentComponent implements OnInit{
  loginType: any;
  students: Student[] = [];

  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;
  displayDialog: boolean = false;


  items: MenuItem[]=[];

  activeIndex: number = 0;

  constructor(private messageService: MessageService, private activatedRoute: ActivatedRoute, private studentService: StudentService, private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
  }

  showDialog() {
    this.displayDialog = true;
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
    this.primengConfig.ripple = true;


    this.items = [{
      label: 'Personal',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label});
      }
    },
      {
        label: 'Seat',
        command: (event: any) => {
          this.activeIndex = 1;
          this.messageService.add({severity:'info', summary:'Seat Selection', detail: event.item.label});
        }
      },
      {
        label: 'Payment',
        command: (event: any) => {
          this.activeIndex = 2;
          this.messageService.add({severity:'info', summary:'Pay with CC', detail: event.item.label});
        }
      },
      {
        label: 'Confirmation',
        command: (event: any) => {
          this.activeIndex = 3;
          this.messageService.add({severity:'info', summary:'Last Step', detail: event.item.label});
        }
      }
    ];
  }

}
