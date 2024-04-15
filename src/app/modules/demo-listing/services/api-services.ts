import {environment} from "environments/environment";
import {HttpParams} from "@angular/common/http";

export type apiService = 'presentationService' | 'serviceManagement' | 'apiFunctions' | 'masterData' | 'smartFunction';


export function apiServiceUrl(service: apiService, actionUrl: string, params: HttpParams = null): string {
    let baseUrl = environment.services[service];
    if (baseUrl !== '' && !baseUrl.endsWith("/"))
        baseUrl = baseUrl + "/";
    if (actionUrl.startsWith("/"))
        actionUrl = actionUrl.substring(0, actionUrl.length - 1);

    let url = baseUrl + actionUrl;
    if (params)
        url = `${url}?${params}`
    return url;
}