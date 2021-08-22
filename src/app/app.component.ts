import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { TranslocoService } from '@ngneat/transloco';
import {
  NetworkService,
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
import { DashboardService } from '@lamnhan/nguix-dashboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private firebaseFirestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private firebaseStorage: AngularFireStorage,
    private translateService: TranslocoService,
    private networkService: NetworkService,
    private localstorageService: LocalstorageService,
    private cacheService: CacheService,
    private fetchService: FetchService,
    private appService: AppService,
    private metaService: MetaService,
    public navService: NavService,
    private settingService: SettingService,
    public pwaService: PwaService,
    public personaService: PersonaService,
    private databaseService: DatabaseService,
    private storageService: StorageService,
    public authService: AuthService,
    private userService: UserService,
    // data services
    private optionDataService: OptionDataService,
    private categoryDataService: CategoryDataService,
    private tagDataService: TagDataService,
    private pageDataService: PageDataService,
    private postDataService: PostDataService,
    private audioDataService: AudioDataService,
    private videoDataService: VideoDataService,
    private bundleDataService: BundleDataService,
    private userDataService: UserDataService,
    private profileDataService: ProfileDataService,
    // dashboard
    private dashboardService: DashboardService,
  ) {
    this.initialize();
  }

  private initialize() {
    // normal services
    this.networkService.init();
    this.localstorageService.init();
    this.cacheService.init();
    this.fetchService
      .setOptions({ cacheTime: 1440 })
      .setIntegrations({ cacheService: this.cacheService })
      .init();
    this.databaseService
      .setOptions({
        driver: 'firestore',
        cacheTime: 1440,
      })
      .setIntegrations({
        cacheService: this.cacheService,
        userService: this.userService,
        settingService: this.settingService,
      })
      .init(this.firebaseFirestore);
    this.storageService
      .setIntegrations({ cacheService: this.cacheService })
      .setOptions({
        dateGrouping: true,
        listingCacheTime: 1440,
        listingIgnoreEmptyFolder: true,
      })
      .init(this.firebaseStorage);
    this.appService.setOptions({ splashScreen: true }).init();
    this.authService.setOptions({driver: 'firestore'}).init(this.firebaseAuth);
    this.userService.init(this.userDataService, this.profileDataService);
    this.settingService
      .setOptions({
        browserColor: true,
        onReady: () => this.appService.hideSplashScreen(),
        personaValidator: (persona, userService) =>
          persona !== 'dashboard' || !!userService?.allowedLevel(2)
      })
      .setIntegrations({
        localstorageService: this.localstorageService,        
        translateService: this.translateService,
        userService: this.userService,
      })
      .setListing({
        themes: [
          { text: 'THEME.LIGHT', value: 'light' },
          { text: 'THEME.DARK', value: 'dark' },
        ],
        personas: [
          { text: 'PERSONA.DEFAULT', value: 'default' },
          { text: 'PERSONA.DASBOARD', value: 'dashboard' },
        ],
        locales: [
          { text: 'English', value: 'en-US' },
          { text: 'Tiếng việt', value: 'vi-VN' },
        ],
      })
      .init();
    this.navService
      .setIntegrations({ settingService: this.settingService })
      .init();
    this.pwaService.setOptions({ reminder: false }).init();
    this.personaService
      .setIntegrations({
        settingService: this.settingService,
        navService: this.navService
      })
      .setMenuRegistry({
        home: { name: 'home', text: 'APP.HOME', routerLink: [''] },
      })
      .init({
        default: {},
      });
    this.metaService
      .setIntegrations({ settingService: this.settingService })
      .init(
        {
          url: 'https://nguix-dashboard.lamnhan.com/',
          title: 'NGUIX dashboard',
          description: 'Angular UI/UX dashboard kit.',
          image: 'https://nguix-dashboard.lamnhan.com/assets/images/featured.jpg',
          locale: 'en-US'
        },
        {
          'vi-VN': {
            url: 'https://nguix-dashboard.lamnhan.com/vi-VN',
            title: 'NGUIX Điều khiển',
            description: 'Bộ giao diện Angular điều khiển.',
            image: 'https://nguix-dashboard.lamnhan.com/assets/images/featured.jpg',
            locale: 'vi-VN'
          }
        }
      );
    // data services
    this.optionDataService
      .setOptions({ advancedMode: true })
      .init();
    this.categoryDataService
      .setOptions({
        advancedMode: true,
        predefinedSearchingContextuals: [
          { name: 'genre', picker: item => item?.status === 'publish' && item?.type === 'genre' },
        ],
      })
      .init();
    this.tagDataService
      .setOptions({ advancedMode: true })
      .init();
    this.pageDataService
      .setOptions({ advancedMode: true })
      .init();
    this.postDataService
      .setOptions({ advancedMode: true })
      .init();
    this.audioDataService
      .setOptions({ advancedMode: true })
      .init();
    this.videoDataService
      .setOptions({ advancedMode: true })
      .init();
    this.bundleDataService
      .setOptions({ advancedMode: true })
      .init();
    this.profileDataService
      .setOptions({ advancedMode: true })
      .init();
    // dashboard
    // this.dashboardService
    //   .registerAvailableParts({ ... });
  }
}
