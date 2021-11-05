import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router'
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    public userService: UserService,
    private authService: SocialAuthService
    ) { }
  
  user: SocialUser | undefined;
  pop_up = true;

  ngOnInit(): void {
    
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
          if (this.pop_up){
            this.pop_up = false
            document.getElementById("pop_up")?.click();

            this.submitForm()
          }
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

    this.userService.authenticate({
      email: this.userService.email,
      password: this.userService.password
    }).subscribe((res)=>{
      if (res.isValid){
        if (res.token){
          localStorage.setItem("token", res.token)
        }

        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        localStorage.setItem("id", res.user._id)
        localStorage.setItem("name", res.user.name)
        localStorage.setItem("email", res.user.email)
        localStorage.setItem("img", res.user.img);
        localStorage.setItem("totalBids", res.user.totalBids);

        this.userService.password = ""

        setTimeout(()=>{
          document.getElementById("alert_close")?.click();

          this.userService.setIsLogin(true)
          this.userService.resetAlertMsg();
          this.router.navigate(['/dashboard']);
        }, 1000);

      }else{
        this.userService.alert_title = "Error!";
        this.userService.alert_msg = res.message;

        setTimeout(() => {
          document.getElementById("alert_close")?.click();
          this.userService.resetAlertMsg();
        }, 4000);
      }
    })

  }

}
