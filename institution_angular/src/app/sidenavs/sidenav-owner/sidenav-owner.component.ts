import { Component, OnInit } from '@angular/core';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav-owner',
  templateUrl: './sidenav-owner.component.html',
  styleUrls: ['./sidenav-owner.component.scss']
})
export class SidenavOwnerComponent implements OnInit {
  faAddressBook = faAddressBook;
  displayMaster=false;
  constructor() { }

  ngOnInit(): void {
  }
  toggleMaster(){
    this.displayMaster=!this.displayMaster;
  }
}
