import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.params.subscribe(params=>{
      this.userService.name = params["name"]
      this.userService.email = params["email"]
      this.userService.password = params["password"]
    })
  }

  ngOnInit(): void {
  }

  submitForm(){
    this.userService.verifyEmail({
      name: this.userService.name,
      email: this.userService.email,
      password: this.userService.password
    }).subscribe(res=>{
      if (res.isValid){

        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        setTimeout(()=>{
          document.getElementById("alert_close")?.click();
          this.userService.resetAlertMsg();
          
          this.router.navigate(['/login']);
        }, 3000);

      }else{
        this.userService.alert_title = "Error!"
        this.userService.alert_msg = res.message
      }
      setTimeout(()=>{
        document.getElementById("alert_close")?.click();
        this.userService.resetAlertMsg();
      }, 3000);
    })
  }

}
