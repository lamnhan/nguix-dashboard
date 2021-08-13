import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  RouterLinkDirectiveModule,
  LocalstorageService,
  CacheService,
  FetchService,
  AppService,
  MetaService,
  NavService,
  SettingService,
  PwaService,
  PersonaService,
  DatabaseService,
  StorageService,
  AuthService,
  UserService,
  NetworkService,
} from '@lamnhan/ngx-useful';
import { PageDataService, PostDataService, UserDataService, ProfileDataService } from '@lamnhan/ngx-schemata';

import { AppRoutingModule } from './app-routing.module';
import { AppTranslationModule } from './app-translation.module';
import { AppDashboardModule } from './app-dashboard.module';
import { AppComponent } from './app.component';

import { HeaderComponentModule } from './components/header/header.module';
import { Header2ndComponentModule } from './components/header2nd/header2nd.module';
import { FooterComponentModule } from './components/footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppDashboardModule,
    AppRoutingModule,
    AppTranslationModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    RouterLinkDirectiveModule,
    HeaderComponentModule,
    Header2ndComponentModule,
    FooterComponentModule,
  ],
  providers: [
    // useful normal services
    LocalstorageService,
    CacheService,
    FetchService,
    AppService,
    MetaService,
    NavService,
    SettingService,
    PwaService,
    PersonaService,
    DatabaseService,
    StorageService,
    AuthService,
    UserService,
    NetworkService,
    // schemata data services
    PageDataService,
    PostDataService,
    ProfileDataService,
    UserDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
