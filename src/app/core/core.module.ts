import { Injectable, NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserXhr, HttpModule } from '@angular/http';

@Injectable()
export class CorsBrowserXhr extends BrowserXhr {

  build(): any {
    const xhr = super.build();
    xhr.withCredentials = true;
    return <any>(xhr);
  }

}

import { PersonService } from './services/person.service';
import { RestClientService } from './services/rest-client.service';
import { SettingsService } from './services/settings.service';

@NgModule({
  imports: [
    HttpModule
  ],
  declarations: [],
  exports: [],
  providers: [
    { provide: BrowserXhr, useClass: CorsBrowserXhr },
    PersonService,
    RestClientService,
    SettingsService
  ]
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
