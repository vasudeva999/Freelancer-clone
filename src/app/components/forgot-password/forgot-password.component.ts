import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }
  
  ngOnInit(): void {

  }

  submitForm(){
    this.userService.forgetPassword({
      email: this.userService.email,
      clientUrl: "http://" + window.location.hostname + this.userService.PORT
    }).subscribe(res=>{
      
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = "An email has been send to you. Please verify";

        setTimeout(()=>{
          this.router.navigate(["/login"])
        }, 3000)

      }else{
        this.userService.alert_title = "Error!";
        this.userService.alert_msg = res.message;
      }

      setTimeout(() => {
        document.getElementById("alert_close")?.click();
        this.userService.resetAlertMsg();
      }, 4000);
    })
  }

}
