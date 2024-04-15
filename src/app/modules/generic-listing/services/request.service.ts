import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Submission as RequestSubmission } from '../models/generic-listing-submission.model';
import { apiServiceUrl } from "./api-services";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private _httpClient: HttpClient) { }
  
  getLandingListData(payload: any, payloadPagination: any, sortFilter?: any): Observable<any> {

    let payloadObj = JSON.stringify(payload);
    let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(payloadPagination) });
    let params = new HttpParams();//.set('orderFilter', JSON.stringify(sortFilter));

    if (sortFilter === undefined || sortFilter.length === 0) {
      sortFilter = { "updatedDate.0": -1 }
    }
    params = params.append('orderFilter', JSON.stringify(sortFilter));

    return this._httpClient.get<any>(apiServiceUrl(
      'serviceManagement',
      'ServiceSubmission/submissions/demo?searchFilter={"active":true}'
    ),
      { headers: headers, params: params }
    );

  }

  getRequestLists(payload: any, payloadPagination: any, sortFilter?: any): Observable<any> {

    let payloadObj = JSON.stringify(payload);
    let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(payloadPagination) });
    let params = new HttpParams();//.set('orderFilter', JSON.stringify(sortFilter));

    if (sortFilter === undefined || sortFilter.length === 0) {
      sortFilter = { "updatedDate.0": -1 };
    }
    params = params.append('orderFilter', JSON.stringify(sortFilter));

    return this._httpClient.get<any>(apiServiceUrl(
      'serviceManagement',
      'ServiceSubmission/submissions/demo?searchFilter=' + payloadObj
    ),
      { headers: headers, params: params }
    );

  }

}