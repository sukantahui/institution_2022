import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  loginType: any;

  constructor(private activatedRoute: ActivatedRoute) {
    const data: Data = this.activatedRoute.snapshot.data;
    this.loginType = data['loginType'];
    console.log('Login Type: ', this.loginType);
  }

  ngOnInit(): void {
  }

}
