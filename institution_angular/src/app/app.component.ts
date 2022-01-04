import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
    AOS.init();
  }

  ngOnInit(): void {
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
