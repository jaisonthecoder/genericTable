// SAMPLE MODEL

import { FormControl } from "@angular/forms";
import { advanceSearchTypeModel } from "./generic-advance-search.model";
export const manifestMetaObject = {'metadata.serviceRequests':{"$exists":true}}
export const TableColumns = [
   
  ];







  export interface GridColumnDefinition {
    columnDef: string;
    colField:string;    
    header: string;
    cell: any;
    show:boolean;
    filter: boolean;
    filterEnabled : boolean;
    sort: any;
    type?: string;

    metaObject?: any;
    metaValue?:any;
    isDefault? : boolean;
    isCustomizable?: boolean;
    isCustomized?: boolean;
    filterSearchValue?: any;
    dbField: string;
    dbLabelField?:string;   
    appendDbLabelFieldLang?:boolean;
    isMasterData?: boolean;
    width?:string;
    disabled?:boolean;
    sticky?: boolean;
    headerBg?: any;
    headerColor?: string;
    headerWeight?:string;
    cellBg?: string;
    cellColor?:string;
    cellWeight?:string;
    headerClassList?: string;
    classList?: string;
    textAlign?: string; 
    hideColHeader?: boolean;
    columnType?: string;
    controlType?: string;
    metaData?: string;
    advanceSearch?: boolean
    advanceSearchType?: advanceSearchTypeModel,
    textWrap?:boolean,
    lookupType?:string,
    lookupProperty?:string,
    dateConvertFormat?:string,
    hideFromSortList?:boolean,
    hideInlineFilterSort?:boolean,
    isFunctionData?:boolean,
    functionDataName?:string,
    functionDataFilter?:any,
    dateAPITransformFormat?:string

  }


 

  
  
  export interface gridConfigObj { 
    gridId: string; 
    tableColumns:Array<any>;
    columnDefinition?:Array<any>;
    dataList: Array<any>;
    dataSource: Array<any>;
    multiSelect: boolean;
    pageSize:any;
    pageIndex: any;
    totalCount: number;
    itemperpageList: Array<any>;
    tableMetaObject:object;
    manifestMetaObject: object;
    selectedItem: any;
    selectedList: Array<any>;
    validations?:any;
    width?:any;
    height?:any;
    sortData?:any;
    filterValue?:any; // active Filter
    filterData?:any;  // adv Search Filter
    inlineFilterData?:any; // Inline Filter
    globalSearchPayload?:any;
    globalSearchValue?:any;
    mergePayload?:boolean;

    dragEnabled?: boolean;
    showPagination?: boolean;
    customizationGrid? : boolean;
    displayedColumns?:Array<string>;
    enableCardView?:boolean;
    showGlobalSearch?:boolean;
    hideInlineSort?:boolean;
  }


  export interface advanceSearchResult { 
    filterPayload: any; 
    selectedItems:Array<any>;
    value?:any;
  }
  
  export type SearchControlType = {
    list: any[];
    date: Date;
    text: String;
    number: number;
  };