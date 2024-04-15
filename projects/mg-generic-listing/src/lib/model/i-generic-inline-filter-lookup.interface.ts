import { HttpParams } from '@angular/common/http';

export interface IGenericInlineFilterLookupService {
  fetch(params?: HttpParams): Promise<any>;
  extractFilterValue(filterData: any, selectedLang: string, type?: any): any;
  onFilterSearchFn(column:any, value:string, source:any, lang?:string): any[];
  translateItem(item:any,lang?:string): any;
}



export interface IGenericTransService {
  translate(value:any, param?:any, lang?:any): any;
  
}
