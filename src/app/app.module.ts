import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/api/auth.service';
import { AuthFirebaseService } from './services/firebase/auth-firebase.service';
import { MediaService } from './services/api/media.service';
import { environment } from 'src/environments/environment';
import { FirebaseService } from './services/firebase/firebase.service';
import { MediaFirebaseService } from './services/firebase/media-firebase.service';
import { createTranslateLoader } from './services/auxiliar/custom-translate.service';

export function MediaServiceFactory(
  fb:FirebaseService){
  return new MediaFirebaseService(fb);
}

export function AuthServiceFactory(
  fb:FirebaseService
) {
    return new AuthFirebaseService(fb);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SharedModule
    ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: AuthService,
      deps: [FirebaseService],
      useFactory: AuthServiceFactory,  
    },
    {
      provide: MediaService,
      deps: [FirebaseService],
      useFactory: MediaServiceFactory
    },
    {
      provide: 'firebase-config',
      useValue: environment.firebaseConfig
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}