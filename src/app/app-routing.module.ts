import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostProjectComponent } from './components/post-project/post-project.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProposalsComponent } from './components/proposals/proposals.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ShowProjectComponent } from './components/show-project/show-project.component';
import { SignupComponent } from './components/signup/signup.component';
import { UpdateProjectComponent } from './components/update-project/update-project.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgotPassword', component: ForgotPasswordComponent},
  {path: '', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'post-project', component: PostProjectComponent},
  {path: 'all-projects', component: AllProjectsComponent},
  {path: "my-projects", component: MyProjectsComponent},
  {path: "profile", component: ProfileComponent},
  {path: "updateUser", component: UpdateUserComponent},
  {path: "showProject/:id", component: ShowProjectComponent},
  {path: "update-project/:id", component: UpdateProjectComponent},
  {path: "proposals/:id", component: ProposalsComponent},
  {path: "resetPassword/:email/:token", component: ResetPasswordComponent},
  {path: "verifyEmail/:name/:email/:password", component: VerifyEmailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  LoginComponent,
  SignupComponent,
  ForgotPasswordComponent,
  HomeComponent,
  DashboardComponent,
  NavbarComponent,
  PostProjectComponent,
  AllProjectsComponent,
  MyProjectsComponent,
  ShowProjectComponent,
  ProfileComponent,
  UpdateUserComponent,
  UpdateProjectComponent,
  ProposalsComponent,
  ResetPasswordComponent,
  VerifyEmailComponent
]
