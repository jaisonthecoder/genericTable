;
import {HttpParams} from "@angular/common/http";
import { environment } from "src/environments/environment";

export type apiService = 'presentationService' | 'serviceManagement' | 'apiFunctions' | 'smartFunction' | 'masterData';

export function apiServiceUrl(service: apiService, actionUrl: string, params?: HttpParams): string {
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