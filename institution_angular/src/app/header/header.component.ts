import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter<any>();
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  toggleSlidebar(choice=true){
    this.toggleSidebarForMe.emit({choice: choice});
  }

  logOutCurrentUser() {
    this.authService.logout();
  }
}
