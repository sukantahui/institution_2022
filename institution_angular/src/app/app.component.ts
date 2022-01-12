import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import {AuthService} from "./services/auth.service";
// @ts-ignore
import {Subscription} from "rxjs/dist/types";
import {MediaChange, MediaObserver} from "@angular/flex-layout";
import {CommonService} from "./services/common.service";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mediaSub: Subscription;
  private isDeviceXs: boolean | undefined;
  constructor(public authService: AuthService, public mediaObserver: MediaObserver,private commonService: CommonService ) {
    AOS.init();
  }

  ngOnInit(): void {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.isDeviceXs = (result.mqAlias === 'xs' ? true : false);
        this.commonService.setDeviceXs(this.isDeviceXs);
      }
    );
    this.authService.autoLogin();
  }
  ngOnDestroy(): void {
    this.mediaSub.unsubscribe();
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
