import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.component.html',
  styleUrls: ['./show-project.component.css']
})
export class ShowProjectComponent implements OnInit {

  id: any;

  constructor(
    public userService: UserService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activedRoute.params.subscribe(params =>{
      this.id = params["id"]
    })
  }

  project: any;

  bidAmount = ""
  days = ""
  describe = ""
  btn_disable = false

  currentBids = parseInt(this.userService.totalBids)

  sameUser = false;

  ngOnInit(): void {
    this.userService.authenticatedUser()

    this.userService.getProject(this.id).subscribe(res=>{
      this.project = res.message
      console.log(this.project[1].name);
      
      if (res.isValid){
        this.bidAmount = this.project[0].minPrice
      }
      if (this.project[1]._id == this.userService.id){
        this.sameUser = true;
        this.btn_disable = true;
      }else{
        this.sameUser = false;
      }
    })
  }

  showProfile(id: string){
    this.userService.setProfileId(id)

    localStorage.setItem("profileId", id)

    this.router.navigate(["/profile"])
  }

  makeBid(id: any){
    this.userService.makeBid(id, {
      bidAmount: this.bidAmount,
      days: this.days,
      describe: this.describe
    }).subscribe(res=>{
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        this.bidAmount = ""
        this.days = ""
        this.describe = ""

        this.btn_disable = true
        this.currentBids -= 1;
        localStorage.setItem("totalBids", this.currentBids.toString());

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
