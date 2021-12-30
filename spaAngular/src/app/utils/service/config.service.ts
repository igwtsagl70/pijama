import { Injectable, isDevMode  } from '@angular/core';

@Injectable()
export class ConfigService {
    apiURI: string;

    constructor() {
        //if (isDevMode()) { this.apiURI = 'http://167.172.130.198'; } else { this.apiURI = 'http://167.172.130.198'; }
        if (isDevMode()) { this.apiURI = 'http://localhost:3000'; } else { this.apiURI = 'http://localhost:3000'; }
        //if (isDevMode()) { this.apiURI = 'http://demo.ccondominium.net'; } else { this.apiURI = 'http://demo.ccondominium.net'; }
    }

    getApiURI() {
        return this.apiURI;
    }
}
