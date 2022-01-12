import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter<any>();
  defaultPicture: string;
  imageSrc: string | ArrayBuffer | null ="";
  file: File | undefined;
  constructor(private authService: AuthService, private commonService: CommonService) {
    this.defaultPicture = this.commonService.getPublic() + '/profile_pic/no_dp.png';
    const user = localStorage.getItem('user');
    if (user){
      const localUserID = JSON.parse(<string>user).uniqueId;
      this.imageSrc = this.commonService.getPublic() + '/profile_pic/profile_pic_' + localUserID + '.jpeg';
    }
  }

  ngOnInit(): void {
  }
  toggleSlidebar(choice=true){
    this.toggleSidebarForMe.emit({choice: choice});
  }

  logOutCurrentUser() {
    this.authService.logout();
  }

  onChange(event: any){
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e => this.imageSrc = reader.result);
    // @ts-ignore
    reader.readAsDataURL(this.file);
    this.authService.upload(this.file).subscribe((response) => {
        console.log(response);
        if (response.success === 100){
        }
      }
    );
    event.srcElement.value = null;
  }
}
