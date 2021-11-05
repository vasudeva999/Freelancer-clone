import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
  }

  headers = new HttpHeaders()

  // user Interface
  id = localStorage.getItem('id') || ""
  name = localStorage.getItem('name') || ""
  email = localStorage.getItem('email') || ""
  password = ''
  phoneNum = localStorage.getItem('phoneNum') || ""
  img = localStorage.getItem('img') || ""
  totalBids = localStorage.getItem('totalBids') || "0"

  user: any;

  // postProject Interface
  projectName = ""
  describe = ""
  skills = ""
  minPrice = ""
  maxPrice = ""
  expire = ""

  btn_name = 'Show';
  password_type = 'password';
  class_status = "btn btn-outline-secondary";

  alert_msg = "Please wait! We are validating your data";
  alert_title = "Loading!";
  cancelled = false;

  data_check = "Please wait until fetching the data...";
  noData = false;

  private isLogin = !!localStorage.getItem('token');
  private profileId = localStorage.getItem("profileId") || "";

  getDataCheck(){
    return this.data_check
  }

  setDataCheck(val: any){
    this.data_check = val
  }

  getId(){
    return localStorage.getItem("id")
  }

  getName(){
    return localStorage.getItem("name");
  }

  getEmail(){
    return localStorage.getItem("email");
  }

  getPhoneNum(){
    return localStorage.getItem("phoneNum");
  }

  getImg(){
    return localStorage.getItem("img");
  }

  getTotalBids(){
    return localStorage.getItem("totalBids");
  }

  swapCancel(){
    if (this.cancelled){
      this.cancelled = false;
    }else{
      this.cancelled = true;
    }
  }

  resetCancelBtn(){
    this.cancelled = false
  }

  getCancelled(){
    return this.cancelled;
  }

  getIsLogin(){
    return this.isLogin
  }

  setIsLogin(val: boolean){
    this.isLogin = val
  }

  getProfileId(){
    return this.getProfileId
  }

  setProfileId(id: string){
    this.profileId = id;
  }

  resetAlertMsg(){
    this.alert_msg = "Please wait! We are validating your data";
    this.alert_title = "Loading!";
  }

  getDate(date: any){
    const obj = new Date(date)
    return obj.toDateString() + ", " + obj.toLocaleTimeString()
  }

  // path = "http://localhost:5000/freelancer/"

  path = "http://"+ window.location.hostname +":5000/freelancer/" 
  PORT = ":4200"
  API_PASS = "API"
  

  urlAddUser = this.path + "addUser";
  urlVerifyEmail = this.path + "verifyEmail/"
  urlAuth = this.path + "auth";
  urlPostProject = this.path + "postProject/";
  urlAllProjects = this.path + "getAllProjects";
  urlGetProject = this.path + "getProject/";
  urlGetUser = this.path + "getUser/";
  urlUpdateUser = this.path + "updateProfile/";
  urlUpdateProject = this.path + "updateProject";
  urlDeleteProject = this.path + "deleteProject/";
  urlGetProposals = this.path + "getProposals/";
  urlMakeBid = this.path + "makeBid/";
  urlGetFreelancerCount = this.path + "getFreelancerCount";
  urlIsEmailExists = this.path + "isEmailExists/";
  urlForgetPassword = this.path + "forgetPassword";
  urlResetPassword = this.path + "resetPassword/"

  show_password(){
    if (this.password_type == 'password') {
      this.password_type = 'text';
      this.btn_name = "Hide";
      this.class_status = "btn btn-outline-danger";
    }
    else {
      this.password_type = 'password';
      this.btn_name = "Show";
      this.class_status = "btn btn-outline-secondary";
    }
  }

  authenticatedUser(){
    if (!this.getIsLogin()){

      document.getElementById("pop_up")?.click();

      setTimeout(()=>{
        document.getElementById("alert_close")?.click();
        this.resetAlertMsg()
        this.router.navigate(["/login"])
      }, 1800);
    }else{
      this.resetAlertMsg();
    }
  }

  isEmailExists(email: any): Observable<any>{
    if (!email){email = null}
    return this.http.get<any>(this.urlIsEmailExists + email, {'headers': this.headers})
  }

  verifyEmail(user: any): Observable<any>{
    return this.http.get<any>(this.urlVerifyEmail + user.name + "/" + user.email + "/" + user.password)
  }

  addUser(user: any): Observable<any>{
    return this.http.post<any>(this.urlAddUser, user, {'headers': this.headers});
  }

  updateUser(user: any): Observable<any>{
    return this.http.post<any>(this.urlUpdateUser + this.id, user, {'headers': this.headers})
  }

  authenticate(user: any): Observable<any>{
    return this.http.post<any>(this.urlAuth, user, {"headers": this.headers})
  }

  postProject(project: any): Observable<any>{
    return this.http.post<any>(this.urlPostProject + this.id, project, {'headers': this.headers})
  }

  updateProject(project: any): Observable<any>{
    console.log("fdgfhfg");
    
    return this.http.post<any>(this.urlUpdateProject, project, {'headers': this.headers})
  }

  getAllProjects(id: any): Observable<any>{
    
    if (id != ""){
      return this.http.post<any>(this.urlAllProjects, {id: id}, {'headers': this.headers});
    }
    else{
      return this.http.post<any>(this.urlAllProjects, {}, {'headers': this.headers});
    }
  }

  getProject(id: string): Observable<any>{
    return this.http.get<any>(this.urlGetProject + id, {'headers': this.headers})
  }

  deleteProject(id: any): Observable<any>{
    return this.http.delete<any>(this.urlDeleteProject + id, {'headers': this.headers})
  }

  getUser(): Observable<any>{
    return this.http.get<any>(this.urlGetUser + this.profileId, {'headers': this.headers})
  }

  makeBid(id: any, Bid: any): Observable<any>{
    return this.http.post<any>(this.urlMakeBid + id + "/" + this.id, Bid)
  }

  getProporsals(id: any): Observable<any>{
    return this.http.get<any>(this.urlGetProposals + id, {'headers': this.headers})
  }

  getFreelancerCount(): Observable<any>{
    return this.http.get<any>(this.urlGetFreelancerCount, {'headers': this.headers})
  }

  forgetPassword(obj: any): Observable<any>{
    return this.http.post<any>(this.urlForgetPassword, obj, {'headers': this.headers})
  }

  resetPassword(password: any, email: any, token: any): Observable<any>{
    return this.http.post<any>(this.urlResetPassword + email, {token: token, password: password}, {'headers': this.headers})
  }
}
