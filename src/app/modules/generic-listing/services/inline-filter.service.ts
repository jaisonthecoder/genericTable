import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IGenericInlineFilterLookupService } from "@pcs/generic-listing";
import { apiServiceUrl } from "./api-services";
import _ from "lodash";

import { map } from "rxjs";
const _masterDataUrl = "http://10.0.99.51/md/api/v1/lookups?Type=";
const _moduleDataUrl = "http://10.0.99.51/md/api/v1/lookups?Type="
@Injectable({
  providedIn: "root",
})
export class InlineFilterService
  implements IGenericInlineFilterLookupService
{
  dataStatus = [
    "Approved",
    "Rejected",
    "Draft",
    "Pending"
  ];
  constructor(private _http: HttpClient) {}


  public extractFilterValue(filterData:string, selectedLang:string, type = 'value',): any {
    if (_.isObject(filterData)) {
      return filterData['description'] ? filterData['description'][selectedLang] : filterData['value']
    }
    else {
      return filterData;
    }
  }


  public onFilterSearchFn(column:any , value:string, source:any, lang:string): any{
    let filteredData:any = [];  
    filteredData =  _.filter(
      source,
        (item: any) => {
         
          return (
            item && (
            item?.code?.toLowerCase()?.includes(value?.toLowerCase()) ||
            item?.nameAr?.toLowerCase()?.includes(value?.toLowerCase()) ||
            item?.nameEn?.toLowerCase()?.includes(value?.toLowerCase()))
          );
          
        }
      );
     return filteredData;
  }


  public fetch(params?: HttpParams): Promise<any> {
    const _paramsColDef : any = params?.get("colDef");
    const colDef:any = JSON.parse(_paramsColDef);
    const column:any = params?.get("column") || null;;

    // if (colDef.columnDef === "status") {
    //   let data = {
    //     list: this.dataStatus,
    //     data: this.dataStatus,
    //   };

    // }
    // else



  if(colDef.isMasterData){
      let column_ = colDef.dbField;

      switch (column) {
        case "vesselFlag":
          column_ = "Country";
          break;
        case "vesselName":
          column_ = "VesselName";
          break;
        case "port":
          column_ = "Ports";
          break;
        case "terminal":
          column_ = "Terminals";
          break;
        default:
          column_ = column;
      }
      let headers = new HttpHeaders({
        "X-MGP-Tenant": "62e247df1679eab7d1d1468d",
      });
      
  
      return this._http.get<any>(
        _masterDataUrl+`${column_}`,
        { headers: headers }
      ).pipe(
        map((result) => {       
          return {
            list: result.items,
            data: result,
          };
        })
      )
      .toPromise();  
    }

    else{
      let column_ = colDef.dbField;

      switch (column) {
        case "appointmentRef":
          column_ = 'requestReferenceId';
          break;
        case "createdBy":
          column_ = 'createdBy';
          break;
        case "truckNo":
          column_ = 'appointmentDetails.truckNo';
          break;
        case "truckType":
          column_ = 'appointmentDetails.chassisType';
          break;
        case "appointmentSlot":
          column_ = "appointmentDetails.timeSlot"
          break
        default:
          column_ = `${column}`;
      }


      let headers = new HttpHeaders({
        "X-MGP-Tenant": "62e247df1679eab7d1d1468d",
      });

      // return this._http.get<any>(
      //   apiServiceUrl(
      //     "serviceManagement",
      //     `ServiceSubmission/submissions/demo/search-values/${column_}`
      //   )
      // );




      return this._http.get<any>(
        apiServiceUrl("serviceManagement",`ServiceSubmission/submissions/demo/search-values/${column_}`),
        { headers: headers }
      ).pipe(
        map((result:any) => {       
          return {
            list: result.data,
            data: result,
          };
        })
      )
      .toPromise();

    }

  }
 


}
