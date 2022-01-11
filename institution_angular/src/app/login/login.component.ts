import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Md5} from "ts-md5";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) { }
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
    // console.log(this.loginForm.value);
    // converting password to MD5
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(this.loginForm.value.loginPassword).end();
    // const formPassword = form.value.password;
    this.authService.login({loginId: this.loginForm.value.loginId, loginPassword: passwordMd5}).subscribe(response => {
      console.log(response);
    });


  }

}
