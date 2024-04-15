import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import _, { toNumber } from "lodash";
import { apiServiceUrl } from "src/app/services/api-services";
import { IGenericInlineFilterLookupService } from "projects/mg-generic-listing/src/public-api";
import { map } from "rxjs";
import { TranslocoService } from "@ngneat/transloco";
const _masterDataUrl = "http://10.0.99.51/md/api/v1/lookups?Type=";
const _moduleDataUrl = "http://10.0.99.51/md/api/v1/lookups?Type="
@Injectable({
  providedIn: "root",
})
export class LandingListInlineFilterService
  implements IGenericInlineFilterLookupService
{
  dataStatus = [
    "Approved",
    "Rejected",
    "Draft",
    "Pending"
  ];
  lang = 'en-US';
  constructor(private _http: HttpClient, private _transLocoService: TranslocoService) {
    this._transLocoService.langChanges$.subscribe((lang)=>{
      this.lang = lang;
    })
}


  public extractFilterValue(filterData:string, selectedLang:string, type = 'value',): any {
    if (_.isObject(filterData)) {
      return type != 'value'? filterData[type] : filterData['description'] ? filterData['description'][selectedLang] : (filterData['columnType'] && filterData['columnType'] == 'number' &&  !isNaN(filterData['value'])) ? Number(filterData['value']) : filterData['value']
    }
    else {
      return filterData;
    }
  }

  public translateItem(item:any, lang?:string){
    return item;
  }
  

  public onFilterSearchFn(column:any , value:string, source:any, lang:string): any{
    try{
    let filteredData:any = [];  
    filteredData =  _.filter(
      source,
        (item: any) => {
         
          return (
            item && (
            item?.code?.toLowerCase()?.includes(value?.toLowerCase()) ||
            item?.nameAr?.toLowerCase()?.includes(value?.toLowerCase()) ||
            item?.nameEn?.toLowerCase()?.includes(value?.toLowerCase()) ||
            (item?.description && item?.description[lang]?.toLowerCase()?.includes(value?.toLowerCase()))
            
            )
          );
          
        }
      );
     return filteredData;
      }
      catch(err){
             console.log('onFilterSearchFn => ',err);
      }
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
      let column_;

      switch (column) {
        case "vesselFlag":
          column_ = "Country";
          break;
        case "vesselName":
          column_ = "ClassificationEntity";
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
      let column_;

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
      //     `ServiceSubmission/submissions/container-appointment/search-values/${column_}`
      //   )
      // );




      return this._http.get<any>(
        apiServiceUrl("serviceManagement",`ServiceSubmission/submissions/container-appointment/search-values/${column_}`),
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
