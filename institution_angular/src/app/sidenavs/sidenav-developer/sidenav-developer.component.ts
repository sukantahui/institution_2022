import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-developer',
  templateUrl: './sidenav-developer.component.html',
  styleUrls: ['./sidenav-developer.component.scss']
})
export class SidenavDeveloperComponent implements OnInit {
  display: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  toggle(){
    this.display=!this.display;
  }
}
