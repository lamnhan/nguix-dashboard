import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
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
  AuthService,
  UserService,
} from '@lamnhan/ngx-useful';
import { PageDataService, UserDataService } from '@lamnhan/ngx-schemata';

import { AppRoutingModule } from './app-routing.module';
import { AppTranslationModule } from './app-translation.module';
import { AppComponent } from './app.component';

import { HeaderComponentModule } from './components/header/header.module';
import { Header2ndComponentModule } from './components/header2nd/header2nd.module';
import { FooterComponentModule } from './components/footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppTranslationModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    AuthService,
    UserService,
    // schemata data services
    PageDataService,
    UserDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
