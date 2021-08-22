import { Injectable } from '@angular/core';

import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private configService: ConfigService) {
    const { serverUrl } = this.configService.getConfig();
    if (serverUrl) {
      this.checkServerStatus(serverUrl);
    }
  }

  private checkServerStatus(serverUrl: string) {
    // TODO: ...
  }
}
