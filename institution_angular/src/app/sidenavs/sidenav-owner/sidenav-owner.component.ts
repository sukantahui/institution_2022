import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav-owner',
  templateUrl: './sidenav-owner.component.html',
  styleUrls: ['./sidenav-owner.component.scss']
})
export class SidenavOwnerComponent implements OnInit {
  display=false;
  constructor() { }

  ngOnInit(): void {
  }
  toggle(){
    this.display=!this.display;
  }
}
