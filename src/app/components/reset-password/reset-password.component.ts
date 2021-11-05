import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token = ""

  constructor(
    public userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.params.subscribe(params=>{
      this.userService.email = params["email"]
      this.token = params["token"]
    })
  }

  ngOnInit(): void {
  }

  submitForm(){
    this.userService.resetPassword(
      this.userService.password,
      this.userService.email,
      this.token
      ).subscribe(res=>{
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        setTimeout(()=>{
          this.userService.password = ""
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
