// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    manifestUri:'/62e25946130017c3653183c4/functions/#environment_name#/pcs_cac/assets/manifest.json',
    services:{
        serviceManagement: 'http://10.0.99.51/svm/api/v1/',
        apiFunctions: 'http://10.0.99.51/functions',
        presentationService:'http://10.0.99.51/prs/',
        smartFunction : 'http://10.0.99.51/62e25946130017c3653183c4/functions/qa/',
        masterData:''
    },
    auth: {
        redirectUrl:"http://10.0.99.51/62e25946130017c3653183c4/functions/#environment_name#/pcs_cac/",
        keycloakUrl:"http://10.0.99.51/auth/",
        ssoPageUrl:"/assets/silent-check-sso.html",
        realm:"ADPorts",
        clientId: "developer-portal",
    },
    appUrl: 'http://10.0.99.51/62e25946130017c3653183c4/functions/#environment_name#/pcs_cac/',
    assetsUrl: 'http://10.0.99.51/62e25946130017c3653183c4/functions/#environment_name#/pcs_cac/assets'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
