import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Student} from "../../models/student.model";
import {StudentService} from "../../services/student.service";
import {ConfirmationService, MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Table} from "primeng/table";
import {environment} from "../../../environments/environment";
import {WebcamImage, WebcamInitError} from "ngx-webcam";
import {AuthService} from "../../services/auth.service";
import {CommonService} from "../../services/common.service";
import {ageGTE} from "../../custom-validator/age.validator";
import {Observable} from "rxjs";
import {filter, map, startWith} from 'rxjs/operators';
import {StorageMap} from "@ngx-pwa/local-storage";


interface Alert {
  type: string;
  message: string;
}
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [ConfirmationService, MessageService]

})


export class StudentComponent implements OnInit, OnChanges{

  myControl = new FormControl();
  qualifications: string[] =['Graduate','Class V', 'Class VI'] ;
  filteredQualifications: Observable<string[]> | undefined;



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
  alerts: Alert[] = [];
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
  stateSelected:any='';
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
  stateList: any[] = [];
  visibleSidebar2: boolean = false;
  errorMessage: any;
  showErrorMessage: boolean = false;

  constructor(private route: ActivatedRoute
              ,public authService: AuthService
              , private messageService: MessageService
              , private activatedRoute: ActivatedRoute
              , private studentService: StudentService
              , private confirmationService: ConfirmationService
              , private primengConfig: PrimeNGConfig
              , private storage: StorageMap
              , private commonService: CommonService) {

    this.storage.get('studentNameFormGroup').subscribe((studentNameFormGroup: any) => {
      if (studentNameFormGroup){
        this.studentNameFormGroup.setValue(studentNameFormGroup);
        console.log('fetched from memory', studentNameFormGroup);
      }
    }, (error) => {});

    this.studentService.fetchEducations().then(educations => {
      this.qualifications = educations;
    });

    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];


    this.route.data.subscribe((response: any) => {
      this.stateList = response.studentResolverData.states.data;
    });

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
      dob : new FormControl(null,[Validators.required, ageGTE(4)]),
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

  isValidForm(){

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

  ngOnInit(): void {



    // @ts-ignore
    this.filteredQualifications = this.studentBasicFormGroup.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.students = this.studentService.getStudents();
    this.studentService.getStudentUpdateListener().subscribe((response: Student[]) =>{
      this.students = response;
    });

    // this.studentService.fetchAllStates().subscribe((response:any)=>{
    //   this.stateList=response.data;
    //   console.log(this.stateList);
    // })
    this.primengConfig.ripple = true;
    this.optionSelected='Father';
    this.stateSelected=20;

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

    this.ngOnChanges();
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
        this.studentData.stateId=this.studentAddressFormGroup.value.stateId;
        //this.studentData.stateId='10';
        this.studentData.pin=this.studentAddressFormGroup.value.pin;

        this.studentData.guardianContactNumber=this.studentContactFormGroup.value.guardianContactNumber;

        this.studentData.whatsappNumber=this.studentContactFormGroup.value.whatsappNumber;
        this.studentData.email=this.studentContactFormGroup.value.email;



        this.studentService.saveStudent(this.studentData).subscribe(response => {

          if (response.status === true){
            this.showSuccess("Record added successfully");
          }

        },error=>{
          this.showErrorMessage = true;
          this.errorMessage = error.message;
          const alerts: Alert[] = [{
            type: 'success',
            message: this.errorMessage,
          }]
          setTimeout(()=>{
            this.showErrorMessage = false;
          }, 20000);
          this.showError(error.statusText);
        })

      },
      reject: () => {
        this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
      }
    });
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
      this.authService.uploadStudentImage(file).subscribe((response) => {
          console.log(response);
          if (response.status === true){
            this.showSuccess("Image saved");
          }
        }
      );
    }
  }



  showSuccess(successMessage: string) {
    this.messageService.add({severity:'success', summary: 'Success', detail: successMessage});
  }
  showError(message: string) {
    this.messageService.add({severity:'error', summary: 'Success', detail: message});
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.qualifications.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnChanges(): void {
    this.studentNameFormGroup.valueChanges.subscribe(val => {
      this.storage.set('studentNameFormGroup', this.studentNameFormGroup.value).subscribe(() => {

      });
    });
  }

}


