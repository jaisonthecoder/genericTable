import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Submission as RequestSubmission } from '../models/submission';
import { apiServiceUrl } from 'src/app/services/api-services';

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
      'ServiceSubmission/submissions/container-appointment?searchFilter={"active":true}'
    ),
      { headers: headers, params: params }
    );

  }


  getRequestLists(payload: any, payloadPagination: any, sortFilter?: any): Observable<any> {

    let payloadObj = JSON.stringify(payload);
    let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(payloadPagination) });
    let params = new HttpParams();
    if (sortFilter === undefined || sortFilter.length === 0) {
      sortFilter = { "updatedDate.0": -1 }
    }
    params = params.append('orderFilter', JSON.stringify(sortFilter));

    return this._httpClient.get<any>(apiServiceUrl('serviceManagement', `ServiceSubmission/submissions/container-appointment?searchFilter=${payloadObj}`),
    { headers: headers, params: params }
  );

  }

  requestsOnSearch(payload: any, pagination:any, sortFilter?: any): Observable<any> {
    let payload_ = encodeURIComponent(JSON.stringify(payload))
    let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(pagination) });

    let params = new HttpParams();
    params = params.append('orderFilter', JSON.stringify(sortFilter));
    return this._httpClient.get<any>(
      apiServiceUrl('serviceManagement', `ServiceSubmission/submissions/container-appointment?searchFilter=${payload_}`),
      { headers: headers, params: params }
    );

  }



  getRecentVoyages(payload: any, payloadPagination: any, sortFilter?: any): Observable<any> {
    //let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(payload) });

    let payloadObj = JSON.stringify(payload);
    let headers = new HttpHeaders({ 'x-descriptor': JSON.stringify(payloadPagination) });
    let params = new HttpParams();//.set('orderFilter', JSON.stringify(sortFilter));

    if (sortFilter === undefined || sortFilter.length === 0) {
      sortFilter = { "updatedDate.0": -1 }
    }
    params = params.append('orderFilter', JSON.stringify(sortFilter));
    return this._httpClient.get<any>(apiServiceUrl(
      'serviceManagement',
      'ServiceSubmission/submissions/vessel-call?searchFilter={active: true}'
    ),
      { headers: headers, params: params }
    );

  }

  getTransactionListRequests(payload: any): Observable<any> {
    let params = new HttpParams();
    if (payload)
      params = params.append("searchFilter", JSON.stringify(payload));
    return this._httpClient.get<any>(`http://10.0.99.51/functions/transaction-logs`, { params: params });
  }

  // CONTAINER APPOINTMENT - SAVE, SUBMIT, UPDATE & DELETE --> START //
  createNewRequestWithRefId(data: any, isDraft: boolean): Observable<any> {
    let code = "APPT";
    let params = new HttpParams();
    params = params.append('serviceCode', code);

    // return this._httpClient.get<any>(
    //   apiServiceUrl('smartFunction', 'generate-reference-id'),
    //   { params: params })
    //   .pipe(
    //     switchMap(response => {
    //       if(response){
    //         data.requestReferenceId = response?.success && response?.data ? response?.data : "";
    //         // if(!isDraft){
    //         //   data.requestReferenceId = response?.success && response?.data ? response?.data : "";
    //         // } 
    //         // else{
    //         //   data.requestReferenceId = null;
    //         // }         
    //         const submission = new RequestSubmission();
    //         if(submission){
    //           submission.data = data;
    //           submission.isDraft = isDraft;
    //         }
    //         return this._httpClient.post<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment'), submission);
  
    //       }
    //      }),
    //   );

     return this._httpClient.post<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment'), "submission");
  }

  updateRequest(data: any, isDraft: boolean, id: string): Observable<any> {
    const submission = new RequestSubmission();
    submission.data = data;
    submission.isDraft = isDraft;
  //  if(!isDraft && !data.requestReferenceId){
  //   let code = "APPT";
  //   let params = new HttpParams();
  //   params = params.append('serviceCode', code);
  //   return this._httpClient.get<any>(
  //     apiServiceUrl('smartFunction', 'generate-reference-id'),
  //     { params: params })
  //     .pipe(
  //       switchMap(response => {
  //         data.requestReferenceId = response?.success && response?.data ? response?.data : "";         
  //         return this._httpClient.put<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment/' + id), submission);
  //       }),
  //     );
  //  }

  //  else{
  //   return this._httpClient.put<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment/' + id), submission);
  //  }
   return this._httpClient.put<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment/' + id), submission);
 
  }

  createModificationRequest(data: any, isDraft: boolean): Observable<any> {
    const submission = new RequestSubmission();
    submission.data = data;
    submission.isDraft = isDraft;
    return this._httpClient.post<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment'), submission);
  }

  getRequestDetailsById(id: string): Observable<any> {
    return this._httpClient.get<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment'), { params: { id } });
  }

  deleteRequestById(id:any) {
    return this._httpClient.delete<any>(apiServiceUrl('serviceManagement', 'ServiceSubmission/submissions/container-appointment/' + id));
  }
  // CONTAINER APPOINTMENT - SAVE, SUBMIT, UPDATE & DELETE --> END //

  getVesselCallByRotationNo(payload: any): Observable<any> {
    let searchFilter = JSON.stringify(payload);
    let sortOrder = { "updatedDate.0": -1 };
    let params = new HttpParams();
    params = params.append('orderFilter', JSON.stringify(sortOrder));
    return this._httpClient.get<any>(
      apiServiceUrl('serviceManagement', `ServiceSubmission/submissions/vessel-call?searchFilter=${searchFilter}`),
      { params: params }
    );
  }

  completeApprovalTaskByTaskId(taskId: string, data?: any): Observable<any> {
    return this._httpClient.post<any>(apiServiceUrl('serviceManagement', 'Task/complete-task/' + taskId), data);
  }
  downloadAckLetter(submissionID: string): Observable<any> {

    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this._httpClient.get<any>('http://10.0.99.51/62e25946130017c3653183c4/functions/qa/get-ptw-ack-letter?text=' + submissionID, httpOptions);

  }


  getContainerInfo(payload: any): Observable<any> {
    return this._httpClient.get<any>(apiServiceUrl('smartFunction', 'getcontainerlistci?arrStr=' + payload));
  }

  verifyDONo(payload: any): Observable<any> {
    let param = "deliveryOrderNumber=" + payload.doNumber + '&containerNumber=' + payload.containerNo;
    return this._httpClient.get<any>(apiServiceUrl('smartFunction', 'validatedeliveryorder?' + param));

  }

  getLookUpData(lookUpType:any): Observable<any> {
    return this._httpClient.get<any>('http://10.0.99.51/md/api/v1/lookups?Type=' + lookUpType)
  }

  validateContainerStatus(value: any) {
    return this._httpClient.get<any>(apiServiceUrl('smartFunction', 'getsearchbookingcontainerstatus?text=' + value));
  }
  getTimeSlot(date:any){
    return this._httpClient.get<any>(apiServiceUrl('smartFunction','gettimeslots?appointmentDate='+ encodeURIComponent(date)));
  }


  getAppointmentTariff(payload: any): Observable<any> {
    return this._httpClient.get<any>(apiServiceUrl('smartFunction', 'get-container-appointment-tariffs?arrStr=' + payload));
  }
}