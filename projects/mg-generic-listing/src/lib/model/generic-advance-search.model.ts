import { Type } from '@angular/core';
import _ from 'lodash';

export const GERNERIC_SEARCH_DATE_CONDITIONS = [
  { id: "equal", name: "Equal to" , selected: false},
  { id: "lt", name: "Less than", selected: false},
  { id: "gt", name: "Greater than", selected: false },
  { id: "gte", name: "Greater than or Equal to", selected: false },
  { id: "lte", name: "Less than or Equal to", selected: false },
  { id: "between", name: "Between", selected: false },
];

export const GERNERIC_SEARCH_STRING_CONDITIONS = [
  { id: "equal", name: "Equal to" , selected: false}  
];

export const GERNERIC_SEARCH_NUMBER_CONDITIONS = [
  { id: "equal", symbol: "equal", name: "Equal To" , selected: false},
  { id: "lt",  symbol: "$lt", name: "Less Than", selected: false},
  { id: "gt", symbol: "$gt", name: "Greater Than", selected: false },
  { id: "gte",symbol: "$gte",  name: "Greater Than or Equal To", selected: false },
  { id: "lte", symbol: "$lte", name: "Less Than or Equal To", selected: false },
];

export const GERNERIC_SEARCH_OPERATORS = [
  {  name: "AND", value: "and" , symbol:"&&", selected: false},
  {  name: "OR", value: "or" , symbol:"||", selected: false},
];

// export enum advanceSearchTypeModel {
//   list: 'list',
//   text:'text';
//   date:'date';
//   dateRange:'dateRange';
// }


export enum advanceSearchTypeModel {
  list = "list",
  text = "text",
  date = "date",
  dateRange = "dateRange"
}

export class AdvanceSearchItem  {
  operator: any = null;
  operatorName: any = null;
  operatorList: any = [];

  fieldName: any = null;
  dbField: any = null;
  fieldList: any = [];
  filteredFieldList: any = [];
  fieldType:any = null;
  field: any = null;

  condition: any = null;
  conditionName: any = null;
  conditionList: any = [];

  value: any = null;
  valueList: any = [];
  filteredValueList: any = [];

  selected: boolean = false;  
  error: boolean = false;
  errorMsg: any = null;

  dateConvertFormat:null;
  type:any = 'string';

  isMasterData:any = null;
  lookupType:any = null;
  lookupProperty:any = null;
  masterDataValue:any =null;
  dateAPITransformFormat:any = null;
}
  