import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TRANSLOCO_MISSING_HANDLER,
  TranslocoMissingHandler,
  TranslocoModule
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(locale: string) {
    return this.http.get<Translation>(`./assets/i18n/${locale}.json`);
  }
}

class CustomHandler implements TranslocoMissingHandler {
  handle() {
    return null;
  }
}

@NgModule({
  exports: [ TranslocoModule ],
  imports: [HttpClientModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en-US'],
        defaultLang: 'en-US',
        fallbackLang: 'en-US',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
    { provide: TRANSLOCO_MISSING_HANDLER, useClass: CustomHandler },
  ]
})
export class AppTranslationModule {}
