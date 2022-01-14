import { Injectable } from '@angular/core';
import {Student} from "../models/student.model";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentList: Student[] =[];
  constructor() { }
  fetchAllStudents(){
    return [1,2,3];
  }
}
