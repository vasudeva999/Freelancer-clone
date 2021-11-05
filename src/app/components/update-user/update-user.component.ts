import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.authenticatedUser()

    
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

  submitForm(){
    const fd = new FormData;
    fd.append("file", this.file)
    fd.append("name", this.userService.name)
    fd.append("phoneNum", this.userService.phoneNum)
    fd.append("password", this.userService.password)
    fd.append("email", this.userService.email)
    fd.append("delFile", (this.delImg)?"true":"false")
    this.userService.updateUser(fd).subscribe((res)=>{
      if (res.profile){
        if (res.profile.img){
          this.userService.img = res.profile.img
        }
      }
      
      if (res.isValid){
        this.userService.alert_title = "Success!";
        this.userService.alert_msg = res.message;

        localStorage.setItem("email", this.userService.email)
        localStorage.setItem("img", this.userService.img);

        if (this.delImg){
          localStorage.removeItem("img")
        }
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
