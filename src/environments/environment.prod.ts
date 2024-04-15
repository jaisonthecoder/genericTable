export const environment = {
    production: true,
    manifestUri:'/assets/manifest.json',
    services: {
        presentationService: 'http://presentationservice/',
        serviceManagement: '',
        masterData: ''
    },
    auth: {
        redirectUrl: "http://10.0.99.51/dap/",
        keycloakUrl: "http://10.0.99.51/auth/",
        ssoPageUrl:"/assets/silent-check-sso.html",
        realm: "ADPorts",
        clientId: "developer-portal",
    },
    assetsUrl: 'http://10.0.99.51/pcs_cac/assets'
};
