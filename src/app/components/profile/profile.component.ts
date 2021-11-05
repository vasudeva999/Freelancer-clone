import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }
  
  user: any = {};

  ngOnInit(): void {
    this.userService.authenticatedUser()

    this.userService.getUser().subscribe((res)=>{
      if (res.isValid){
        this.user = res.message;
      }else{
        this.userService.alert_title = "Error!";
        this.userService.alert_msg = res.message;
      }
    })
    setTimeout(() => {
      document.getElementById("alert_close")?.click();
      this.userService.resetAlertMsg();
    }, 4000);
    console.log(this.user);
    
  }


}
