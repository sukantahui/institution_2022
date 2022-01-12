import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import {AuthService} from "./services/auth.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {
    AOS.init();
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  title = 'adminDesign';
  sideBarOpen=true;

  sideBarToggler($event: any){
    if(!$event.choice){
      this.sideBarOpen=false;
    }else{
      this.sideBarOpen=!this.sideBarOpen;
    }
  }
}
