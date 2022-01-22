import { Injectable } from '@angular/core';
import {Student} from "../models/student.model";
import {CommonService} from "./common.service";
import {ErrorService} from "./error.service";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";

class CommerService {
}

export interface StudentResponseData {
  status: boolean;
  message: string;
  data: {
    studentId: number;
		episodeId: string;
		studentName:string;
		billingName: string;
		fatherName: string;
		motherName: string;
		guardianName: string;
		relationToGuardian: string;
		dob: string;
		sex: string;
		address: string;
		city: string;
		district: string;
		stateId: number;
		pin: number,
  };
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentList: Student[] =[];
  studentSubject = new Subject<Student[]>();
  constructor(private commonService: CommonService, private errorService: ErrorService, private http: HttpClient) { }
  fetchAllStudents(){
    return this.http.get<any>(this.commonService.getAPI() + '/students')
      .pipe(catchError(this.errorService.serverError), tap(((response: {success: number, data: Student[]}) => {
        this.studentList=response.data;
        this.studentSubject.next([...this.studentList]);
      })));
  }

  getStudents(){
    return [...this.studentList];
  }
  getStudentUpdateListener(){
    return this.studentSubject.asObservable();
  }

  saveStudent(studentData:any){
    return this.http.post<StudentResponseData>(this.commonService.getAPI() + '/students', studentData)
    .pipe(catchError(this.errorService.serverError), tap(resData => {
      if (resData.status === true){


      }
    }))

  }
}
