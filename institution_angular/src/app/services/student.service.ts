import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor() { }
  fetchAllStudents(){
    return [1,2,3];
  }
}
