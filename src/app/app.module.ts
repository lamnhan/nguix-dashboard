import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
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
import {
  OptionDataService,
  CategoryDataService,
  TagDataService,
  PageDataService,
  PostDataService,
  AudioDataService,
  VideoDataService,
  BundleDataService,
  UserDataService,
  ProfileDataService,
} from '@lamnhan/ngx-schemata';

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
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
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
    OptionDataService,
    CategoryDataService,
    TagDataService,
    PageDataService,
    PostDataService,
    AudioDataService,
    VideoDataService,
    BundleDataService,
    UserDataService,
    ProfileDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
