import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-project',
  templateUrl: './post-project.component.html',
  styleUrls: ['./post-project.component.css']
})
export class PostProjectComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.authenticatedUser()

    this.userService.projectName = ""
    this.userService.describe = ""
    this.userService.skills = ""
    this.userService.minPrice = ""
    this.userService.maxPrice = ""
    this.userService.expire = ""
    
  }
  file: any;
  delImg = false
  hide = false;


  onChange(event: any){
    this.file = event.target.files[0];
    if (this.file){
      this.hide = true;
    }else{
      this.hide = false;
    }
  }

  hideUpload(){
    if (this.delImg == true){
      this.delImg = false;
    }else{
      this.delImg = true;
    }
  }

  
  submitProject(){
    const fd = new FormData;
    fd.append("file", this.file)
    fd.append("title", this.userService.projectName)
    fd.append("describe", this.userService.describe)
    fd.append("skills", this.userService.skills)
    fd.append("minPrice", this.userService.minPrice)
    fd.append("maxPrice", this.userService.maxPrice)
    fd.append("expire", this.userService.expire)
    this.userService.postProject(fd).subscribe((res)=>{
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        this.userService.projectName = ""
        this.userService.describe = ""
        this.userService.skills = ""
        this.userService.minPrice = ""
        this.userService.maxPrice = ""
        this.userService.expire = ""

        setTimeout(()=>{
          document.getElementById("alert_close")?.click();

          this.userService.resetAlertMsg();
        }, 3000);
      }else{
        this.userService.alert_title = "Error!";
        this.userService.alert_msg = res.message;
      }
    })
    setTimeout(() => {
      document.getElementById("alert_close")?.click();
      this.userService.resetAlertMsg();
    }, 4000);
  }
  
  
}
