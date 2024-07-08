import { Injectable } from '@angular/core';
import { logo } from '../../shared/logo';


@Injectable({
    providedIn: 'root'
  })
export class AppService {
    public pdfLogo: string = logo;

    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    setLogo(base64Url: string) {
        this.pdfLogo = base64Url ? base64Url : logo;
    }
}
