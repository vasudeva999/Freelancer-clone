import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  myProjects: any[] = []
  term = ""
  
  ngOnInit(): void {
    this.userService.authenticatedUser()


    this.userService.getAllProjects(this.userService.id).subscribe((res)=>{
      this.myProjects = res.message;
      if (this.myProjects.length<=0){
        this.userService.setDataCheck("No Data Found :( or Refresh the page");
        this.userService.noData = true
      }
    })
    
  }

  delete(id: any){
    this.userService.alert_title = "Delete Project!";
    this.userService.alert_msg = "Wait for 10 sec to delete this project. Click Close button to break the process";
    document.getElementById("pop_up")?.click();

    this.userService.resetCancelBtn()

      setTimeout(()=>{
        setTimeout(()=>{
          document.getElementById("pop_up")?.click(); 
          console.log(this.userService.getCancelled());
          
          if (!this.userService.getCancelled()){
            this.userService.deleteProject(id).subscribe(res=>{
              if (res.isValid){
                this.userService.alert_title = "Deleted!";
                this.userService.alert_msg = "Selected project has been deleted!";

                window.location.reload()
              }else {
                this.userService.alert_title = "Error!";
                this.userService.alert_msg = res.message;
              }
            })
            
          }else{
            this.userService.alert_title = "Cancelled!"
            this.userService.alert_msg = "Operation breaks"
          }
          document.getElementById("alert_close")?.click();

        }, 2000)
      
      }, 8000);
  }


}
