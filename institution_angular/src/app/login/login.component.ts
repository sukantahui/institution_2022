import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder) { }
  hide: boolean = false;
  ngOnInit(): void {
    this.loginForm=new FormGroup({
      loginId : new FormControl('',[Validators.required,Validators.email]),
      loginPassword : new FormControl('',[Validators.required,Validators.minLength(6)])
    })
  }
  login(){
    if (!this.loginForm.valid) {
      // return;
    }
    console.log(this.loginForm.value);


  }

}
