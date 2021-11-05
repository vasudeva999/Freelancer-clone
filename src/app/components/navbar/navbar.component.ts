import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnChanges {

  constructor(
    public userService: UserService,
    private router: Router,
    private authService: SocialAuthService
  ) { }
  

  @Input() img = this.userService.img;

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
    console.log(changes);
    
  }

  signOut(){
    localStorage.clear()

    this.userService.setIsLogin(false);
    this.authService.signOut(true);
    
    this.router.navigate(["/"])
    
  }

  showProfile(id: string){
    // this.userService.setProfileId(id)
    localStorage.setItem("profileId", id)

    this.router.navigate(["/profile"])
  }
}
