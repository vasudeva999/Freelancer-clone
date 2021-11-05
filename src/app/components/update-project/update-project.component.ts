import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {

  id: any

  constructor(
    public userService: UserService,
    private activatedRouter: ActivatedRoute
  ) { 
    this.activatedRouter.params.subscribe(params=>{
      this.id = params["id"];
    })
  }

  ngOnInit(): void {
    this.userService.authenticatedUser()

    
    this.userService.getProject(this.id).subscribe(res=>{
      if (res){
        
        this.userService.projectName = res.message[0].title;
        this.userService.describe = res.message[0].describe;
        this.userService.skills = res.message[0].skills;
        this.userService.minPrice = res.message[0].minPrice;
        this.userService.maxPrice = res.message[0].maxPrice;
        this.userService.expire = res.message[0].daysToExpire;
        this.userService.projectName = res.message[0].title;
      }
      
    })
  }

  file: any;
  delImg = false;
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
    fd.append("id", this.id)
    fd.append("file", this.file)
    fd.append("title", this.userService.projectName)
    fd.append("describe", this.userService.describe)
    fd.append("skills", this.userService.skills)
    fd.append("minPrice", this.userService.minPrice)
    fd.append("maxPrice", this.userService.maxPrice)
    fd.append("expire", this.userService.expire)
    fd.append("delFile", (this.delImg)?"true":"false")
    this.userService.updateProject(fd).subscribe((res)=>{
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;
        this.file = ''

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
