import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  allProjects: any[] = [];
  term = ''

  ngOnInit(): void {
    this.userService.authenticatedUser()


    this.userService.getAllProjects(null).subscribe((res)=>{
      this.allProjects = res.message;
      
      if (this.allProjects.length <= 0){
        this.userService.setDataCheck("No Data Found :( or Refresh the page");
        this.userService.noData = true
      }else{
        this.userService.setDataCheck("Data Found!\n Loading please wait!");
      }
    })
    
  }



  showProfile(id: string){
    this.userService.setProfileId(id)

    localStorage.setItem("profileId", id)

    this.router.navigate(["/profile"])
  }


}
