import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {

  id: any;
  constructor(
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedRoute.params.subscribe(params=>{
      this.id = params["id"]
    })
  }

  allProposals: any = [];
  ngOnInit(): void {
    this.userService.authenticatedUser()

    
    this.userService.getProporsals(this.id).subscribe(res=>{
        this.allProposals = res.message;
        console.log(this.allProposals);
        
    })

    setTimeout(() => {
      this.userService.data_check = "No Data Found :(";
    }, 5000);
  }

  showProfile(id: string){
    this.userService.setProfileId(id)

    localStorage.setItem("profileId", id)

    this.router.navigate(["/profile"])
  }

}
 