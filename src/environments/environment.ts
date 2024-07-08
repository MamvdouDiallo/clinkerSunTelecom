// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseUrl: 'http://localhost:4200',
    production: false,
    // apiURL: 'https://api.suntelecoms.com/SFD/api/',
    apiURL: 'http://localhost:8080/api/',
    batchApiURL: 'https://sfp.suntelecoms.com/batchapi/',
    apiWorkflow: 'https://sfp.suntelecoms.com/batchapi/',
    apicomURL: 'https://api.suntelecoms.com/comapi/',
    //apiURL: 'http://192.168.1.38:8085/api/',
    max: 100000,
    offset:0,
    maxTentative: 3,
    waitingTime: 1,
    sessionExpirationTime: 600,
    maxRatioMiniature : 1.500,
    minRatioMiniature : 1,
    ENCRYPT_SALT: "OdC&Xc30=8$HE`J1Tpq,GP*[[$qWBpA"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
