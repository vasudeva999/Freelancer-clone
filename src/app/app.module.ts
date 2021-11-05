import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http'
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component'

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    BrowserAnimationsModule,

    MatProgressBarModule,
    Ng2SearchPipeModule,
    MatProgressSpinnerModule
  ],
  providers: [
    UserService,

    { provide: 'SocialAuthServiceConfig',
      useValue: {autoLogin: false,
          providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('740259294115-4r9t45uijn0aickilpvmimk0b342k1v4.apps.googleusercontent.com')},
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2106751712808331')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
