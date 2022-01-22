import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Table} from "primeng/table";
import {environment} from "../../../environments/environment";
import {WebcamImage, WebcamInitError} from "ngx-webcam";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class StudentComponent implements OnInit{

  error: any;



  loginType: any;
  students: Student[] = [];

  msgs: { severity: string; summary: string; detail: string }[] = [];
  value3: any;
  data: any;
  displayDialog: boolean = false;


  items: MenuItem[]=[];

  activeIndex: number = 0;


  studentNameFormGroup: FormGroup;
  studentGuardianFormGroup: FormGroup;
  studentBasicFormGroup: FormGroup;
  studentAddressFormGroup: FormGroup;
  studentContactFormGroup: FormGroup;
  isLinear: boolean = false;
  relations: any[];
  sex: any[];
  genders: any[];
  billingName:string='';
  guradainName:string='';
  isProduction = environment.production;
  showDeveloperDiv = true;
  isCaptured: boolean =true;
  WIDTH=200;
  HEIGHT=200;
  public webcamImage: WebcamImage | undefined ;
  dialogContent: string = "";
  optionSelected:any='';
  guardianName:any='';
  studentData: {
    studentName?: string;
    billingName?: string;
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    relationToGuardian?: string;
    dob?: string;
    sex?: string;
    address?: string;
    city?: string;
    district?: string;
    stateId?: string;
    pin?: string;
    guardianContactNumber?: string;
    whatsappNumber?: string;
    email?: string;
    qualification?: string;

  }={};
  visibleSidebar2: boolean = false;
  constructor(public authService: AuthService, private messageService: MessageService, private activatedRoute: ActivatedRoute, private studentService: StudentService, private confirmationService: ConfirmationService,private primengConfig: PrimeNGConfig, private commonService: CommonService) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];

    this.genders = [
      {name: 'M', value: 'M', icon: 'bi bi-gender-male',tooltip: 'Male'},
      {name: 'F', value: 'F', icon: 'bi bi-gender-female',tooltip: 'Female'},
      {name: 'T', value: 'T', icon: 'bi bi-gender-trans',tooltip: 'Others'}
    ];

    this.relations = [
      {name: 'Father'},
      {name: 'Mother'},
      {name: 'Dadu'},
      {name: 'Dida'}
    ];

    this.sex = [
      {name: 'Male'},
      {name: 'Female'},
      {name: 'Others'},

    ];
    this.studentNameFormGroup = new FormGroup({
      studentId : new FormControl(null),
      studentName : new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      billingName : new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(4)])
    });
    this.studentGuardianFormGroup = new FormGroup({
      fatherName : new FormControl(null),
      motherName : new FormControl(null),
      guardianName : new FormControl(null),
      relationToGuardian : new FormControl(null,[Validators.required])
    });

    this.studentBasicFormGroup = new FormGroup({
      dob : new FormControl(null,Validators.required),
      dobSQL: new FormControl(null),
      sex : new FormControl(null,Validators.required),
      qualification : new FormControl(null,Validators.required)
    });
    this.studentAddressFormGroup = new FormGroup({
      address : new FormControl(null,[Validators.required, Validators.maxLength(100), Validators.minLength(4)]),
      city : new FormControl(null,[Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      district : new FormControl(null,[Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      stateId : new FormControl(null),
      pin : new FormControl(null)

    });

    this.studentContactFormGroup = new FormGroup({
      guardianContactNumber : new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      whatsappNumber : new FormControl(null,[Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      email : new FormControl(null,[Validators.required, Validators.email]),
      description : new FormControl(null)
    });

  }

  showDialog() {
    this.dialogContent = "Student Picture Saved";
    this.displayDialog = true;
  }
  sameAsBillName(){
    this.studentNameFormGroup.patchValue({billingName: this.studentNameFormGroup.value.studentName});

  }
  guardianAsFather(father:any){
    this.guardianName=father;
    console.log(this.guradainName);
    this.optionSelected='Father';
  }
  guardianAsMother(mother:any){
    this.guardianName=mother;
    console.log(this.guradainName);
    this.optionSelected='Mother';
  }
  saveStudent() {

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.studentData.studentName=this.studentNameFormGroup.value.studentName;
        this.studentData.billingName=this.studentNameFormGroup.value.billingName;
        this.studentData.fatherName=this.studentGuardianFormGroup.value.fatherName;
        this.studentData.motherName=this.studentGuardianFormGroup.value.motherName;
        this.studentData.guardianName=this.studentGuardianFormGroup.value.guardianName;
        this.studentData.relationToGuardian=this.studentGuardianFormGroup.value.relationToGuardian;

        this.studentData.dob=this.studentBasicFormGroup.value.dobSQL;
        this.studentData.sex=this.studentBasicFormGroup.value.sex;
        this.studentData.qualification=this.studentBasicFormGroup.value.qualification;

        this.studentData.address=this.studentAddressFormGroup.value.address;
        this.studentData.city=this.studentAddressFormGroup.value.city;

        this.studentData.district=this.studentAddressFormGroup.value.district;
        //this.studentData.stateId=this.studentAddressFormGroup.value.stateId;
        this.studentData.stateId='10';
        this.studentData.pin=this.studentAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber=this.studentContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber=this.studentContactFormGroup.value.whatsappNumber;
        this.studentData.email=this.studentContactFormGroup.value.email;


        console.log(this.studentData);
        this.studentService.saveStudent(this.studentData).subscribe(response => {
          if (response.status === true){
            console.log(response);
            this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
          }

        })

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
   this.optionSelected='Father';

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



  getEventValue($event:any) :string {
    return $event.target.value;
  }



  setDobSQL(value: string) {
    this.studentBasicFormGroup.patchValue({dobSQL: this.commonService.getSQLDate(value)});
  }

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  saveUserImage() {
    if(this.webcamImage){
      const arr = this.webcamImage.imageAsDataUrl.split(",");
      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file: File = new File([u8arr], "test", { type: "jpeg" })
      console.log(file);
      this.authService.uploadStudentImage(file).subscribe((response) => {
          console.log(response);
          if (response.status === true){
            this.showSuccess();
          }
        }
      );
    }
  }



  showSuccess() {

    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
  }
}
