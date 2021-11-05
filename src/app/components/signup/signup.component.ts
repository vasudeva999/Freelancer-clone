import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router'
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router,
    public userService: UserService,
    private authService: SocialAuthService
    ) { }

  user: SocialUser | undefined
  ngOnInit(): void {
    this.userService.name =''
    this.userService.email =''
    this.userService.password =''

    this.authService.authState.subscribe((user)=>{
      this.user = user
      if ( user!= null){
        this.userService.name = user.name
        this.userService.email = user.email
        this.userService.password = this.userService.API_PASS

        
        this.userService.verifyEmail({
          name: this.userService.name,
          email: this.userService.email,
          password: this.userService.password
        }).subscribe(res=>{
          this.router.navigate(["/login"])
        })

      }
    })
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  submitForm(){
    this.userService.addUser({
      name: this.userService.name,
      email: this.userService.email,
      password: this.userService.password,
      clientUrl: "http://" + window.location.hostname + this.userService.PORT
    }).subscribe((res)=>{
      if (res.isValid){

        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message; //"Account has been created, Please wait!";

        setTimeout(()=>{
          document.getElementById("alert_close")?.click();
          this.userService.resetAlertMsg();
          
          this.router.navigate(['/login']);
        }, 3000);

      }else{
        if (res.status == "Email_Exists"){
          this.userService.alert_title = "Error!";
          this.userService.alert_msg = res.message; //"User with email id: "+this.userService.email+" is already exists!";
        }else{
          this.userService.alert_title = "Error!";
          this.userService.alert_msg = res.message; //"User with userName: "+this.userService.name+" is already exists!";
        }
      }
      setTimeout(()=>{
        document.getElementById("alert_close")?.click();
        this.userService.resetAlertMsg();
      }, 3000);
    })
  }

}
