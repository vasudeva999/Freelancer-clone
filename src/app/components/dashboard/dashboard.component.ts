import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  totalUsers = 0
  totalProjects = 0
  totalBids = 0
  ngOnInit(): void {
    this.userService.authenticatedUser()
    
    this.userService.getFreelancerCount().subscribe(res=>{
      this.totalUsers = res.message.usersCount
      this.totalProjects = res.message.projectsCount
      this.totalBids = res.message.bidCount
    })
  }

}
