// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    manifestUri:'/assets/manifest.json',
    services:{
        presentationService:'http://10.0.99.51/prs/',
        serviceManagement: 'http://10.0.99.51/svm/api/v1/',
        masterData:'',
        apiFunctions: 'http://10.0.99.51/62e25946130017c3653183c4/functions/qa/',
        lookupUrl:'http://10.0.99.51/md/api/v1/',
        documentManagemtUrl:'http://10.0.131.21/ATLP/Main/DocumentManagementApi/api/'
    },
    auth: {
        redirectUrl:"http://localhost:4205/",
        keycloakUrl:"http://10.0.99.51/auth/",
        ssoPageUrl:"/assets/silent-check-sso.html",
        realm:"ADPorts",
        clientId: "pcs-customer-portal",
        tenantId:"62e247df1679eab7d1d1468d",
        projectId:"62e25946130017c3653183c4",
        baseUrl:"http://10.0.99.51/"
    },
    appUrl: "http://localhost:4205/",
    assetsUrl: 'http://10.0.99.51/pcs_vcc/assets',
    remoteEntry: 'http://localhost:4222/remoteEntry.js'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
