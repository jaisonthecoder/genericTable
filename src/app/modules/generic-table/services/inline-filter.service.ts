import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IGenericInlineFilterLookupService } from "@pcs/generic-listing";
import { apiServiceUrl } from "./api-services";
import _ from "lodash";

import { map } from "rxjs";
import { TranslocoService } from "@ngneat/transloco";
import { environment } from "src/environments/environment";
const _masterDataUrl = environment.services.lookupUrl + "lookups?Type=";



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
    "Pending",
    "OnHold"
  ];
  public lang = "en-US";
  constructor(private _http: HttpClient, private _transLocoService: TranslocoService) {
        this._transLocoService.langChanges$.subscribe((lang)=>{
          this.lang = lang;
        })
  }


  public extractFilterValue(filterData:string, selectedLang:string, type = 'value',): any {
    if (_.isObject(filterData)) {
      return filterData['description'] ? filterData['description'][selectedLang] : (filterData['columnType'] && filterData['columnType'] == 'number' &&  !isNaN(filterData['value'])) ? Number(filterData['value']) : filterData['value']
    }
    else {
      return filterData;
    }
  }

public translateItem(item, lang?:string){
  let _lang = localStorage.getItem('defaultLanguage');
 // return this._transLocoService.translate(item, null, _lang);
}




 public onFilterSearchFn(
    column: any,
    value: string,
    source: any,
    lang: string
  ): any {
    let filteredData: any = [];
    filteredData = _.filter(source, (item: any) => {

      if(!lang){
        lang = localStorage.getItem('defaultLanguage');
       }

      return (
        item &&
        (item?.code?.toLowerCase()?.includes(value?.toLowerCase()) ||
          item?.nameAr?.toLowerCase()?.includes(value?.toLowerCase()) ||
          item?.nameEn?.toLowerCase()?.includes(value?.toLowerCase())) ||
          (item?.description && item?.description[lang]?.toLowerCase()?.includes(value?.toLowerCase()))
      );
    });
    return filteredData;
  }


 public fetch(params?: HttpParams, filterType?:any): Promise<any> {
    const _paramsColDef: any = params?.get("colDef");
    const colDef: any = JSON.parse(_paramsColDef);
    const column: any = params?.get("column") || null;

    // if (colDef.columnDef === "status") {
    //   let data = {
    //     list: this.dataStatus,
    //     data: this.dataStatus,
    //   };
    //   return Promise.resolve(data);

    // }
    // else
    
    if(colDef.isMasterData){
      let column_ = colDef.lookupType;
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
      let headers = new HttpHeaders({
        "X-MGP-Tenant": "62e247df1679eab7d1d1468d",
      });

      return this._http.get<any>(
        apiServiceUrl("serviceManagement",`ServiceSubmission/submissions/vessel-call/search-values/${column_}`+'?inlcudeRoot=true'),
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