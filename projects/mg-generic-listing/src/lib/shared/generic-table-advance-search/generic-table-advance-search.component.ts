import { Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import * as searchModel from "../../model/generic-advance-search.model";
import _, { isObject } from "lodash";
import {
  AdvanceSearchItem,
  GERNERIC_SEARCH_DATE_CONDITIONS,
  GERNERIC_SEARCH_NUMBER_CONDITIONS,
  GERNERIC_SEARCH_OPERATORS,
  GERNERIC_SEARCH_STRING_CONDITIONS,
} from "../../model/generic-advance-search.model";
import { HttpParams } from "@angular/common/http";
import { IGenericInlineFilterLookupService, IGenericTransService } from "../../model/i-generic-inline-filter-lookup.interface";
import { GenericListingTableService } from "../../services/generic-listing-table.service";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import { advanceSearchResult, gridConfigObj } from "../../model/default-table.model";
import { TranslationService } from "../../services/translation.service";
import { HelperService } from "../../services/helper.service";
import { MatDateRangePicker, MatDatepicker } from "@angular/material/datepicker";
import { Moment } from "moment";
import { DateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-generic-table-advance-search",
  templateUrl: "./generic-table-advance-search.component.html",
  styleUrls: ["./generic-table-advance-search.component.scss"],
  providers: [GenericListingTableService]
})
export class GenericTableAdvanceSearchComponent implements OnInit {
  @ViewChild('SingleDatePicker ') SingleDatePicker: MatDatepicker<any>;
  @ViewChild('multiDatePicker ') multiDatePicker: MatDateRangePicker<any>;
  @ViewChild('StartDateInput') startDateRef: ElementRef;
  @ViewChild('EndDateInput') endDateRef: ElementRef;
  


  @Input() tableColumn: any = null;
  @Input() searchItemCount: any = 3;
  @Input() selectedLang: string = "en-US";
  @Input() gridConfig: gridConfigObj;
  @Input() hideAdvanceSearch: boolean = false;

  // TRANSLATION SERVICE
  _transLocoService: IGenericTransService;
  @Input() set translationSourceService(
    value: IGenericTransService | any[]
  ) {
    if (this.isTransSeriveValid(value)) {
      this._transLocoService = value as IGenericTransService;
    }
  }





  @Output() onAdvanceSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() onGlobalSearch: EventEmitter<any> = new EventEmitter<any>();

  searchTerm$ = new Subject<string>();

  showAdvSearch: boolean = false;
  globalSearchModel: string = ""
  extractFilterValue: any = null;
  translateThis: any = null;
  service: any;
  searchLookupService: IGenericInlineFilterLookupService;
  @Input() set searchLookupServiceSource(
    value: IGenericInlineFilterLookupService | any[]
  ) {
    if (this.isSearchLookupServiceReady(value)) {
      this.searchLookupService = value as IGenericInlineFilterLookupService;
      this.extractFilterValue = this.searchLookupService.extractFilterValue;

      this.translateThis = this.searchLookupService.translateItem;
    }
  }



  searchEnabledColumnList: any[] = [];
  defaultSearchItemList: any[] = [];
  searchItemList: any[] = [];
  selectedFilterItems: any[] = [];
  filterPayload: any = {};

  constructor(private ref: ChangeDetectorRef, public tableService: GenericListingTableService, private transService: TranslationService, private helperService: HelperService, private dateAdapter: DateAdapter<any>
    , private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.initAdvSearch();
    this.searchTerm$.pipe(debounceTime(1000),
      distinctUntilChanged())
      .subscribe(x => this.globalSearchFn(x));

    this.transService.getLang$.subscribe((lang) => {
      if (lang && lang != '') {
        this.selectedLang = lang;
        if(lang == 'ar-AE' || lang == 'ar'){
          this.dateAdapter.setLocale('ar');
         }
         else{
           this.dateAdapter.setLocale('en');
         }
      }
    });


    // this.tableService.clearFilter$.subscribe((gridConfig)=>{
    //     this.resetAdvanceSearch();
    //     this.globalSearchModel = ''
    //     this.ref.detectChanges();
    //  });

  }

  ngOnDestroy(): void {
    this.searchTerm$.unsubscribe();
  }

  private isSearchLookupServiceReady(
    object: any
  ): object is IGenericInlineFilterLookupService {
    return object && "fetch" && "extractFilterValue" in object;
  }


  private isTransSeriveValid(
    object: any
  ): object is IGenericTransService {
    return object && "translate" in object;
  }

  initAdvSearch(): void {
    this.searchEnabledColumnList = _.filter(this.tableColumn, {
      advanceSearch: true,
    });
    _.forEach(this.searchEnabledColumnList, (item: any) => {
      item.selected = false;
    });

    _.forEach(this.searchEnabledColumnList, (item: any, i: number) => {
      let obj: any = new AdvanceSearchItem();

      obj.field = item.columnDef;
      obj.dbField = item.dbField;
      obj.fieldType = item.advanceSearchType ? item.advanceSearchType : item.columnType ? item.columnType : 'text';

      obj.fieldName = item.header;
      obj.fieldList = this.searchEnabledColumnList;

      obj.condition = null;
      obj.conditionList = this.getConditionList(item.columnType);

      obj.value = null;
      obj.valueList = [];

      obj.operator = null;
      obj.operatorList = _.cloneDeep(GERNERIC_SEARCH_OPERATORS);
      obj.selected = false;

      obj.dateConvertFormat = item.dateConvertFormat ? item.dateConvertFormat : null;
      obj.type = item.type;
      obj.metaValue = item.metaValue;

       obj.isMasterData = item.isMasterData;
       obj.isFunctionData = item.isFunctionData;
       obj.functionDataFilter = item.functionDataFilter;
       obj.functionDataName = item.functionDataName;
       obj.lookupType = item.lookupType;
       obj.lookupProperty = item.lookupProperty;
       obj.dateAPITransformFormat = item.dateAPITransformFormat;

      this.defaultSearchItemList.push(obj);
    });
  }

  addNewSearchItem(): void {
    let length = this.searchItemList.length;
    if (this.checkActiveRowValid()) {
      //  if(length > 0 && this.searchItemList[length-1].value == null){   
      //   let msg = "You must enter all the field values, before adding new search condition."
      //   this.setError(this.searchItemList[length-1], msg)
      //   return;
      // }


      let obj: any = new AdvanceSearchItem();
      obj.fieldList = _.filter(this.searchEnabledColumnList);
      obj.field = null;
      obj.index = length;
      // obj.fieldList = _.filter(this.searchEnabledColumnList, { selected: false });
      obj.operatorList = _.cloneDeep(GERNERIC_SEARCH_OPERATORS);
      obj.selected = true;
      if (length > 0) {
        obj.operator = 'and';
        obj.operatorName = 'AND';
      }

      this.searchItemList.push(obj);
      this.setInitialItemOperator();
    }

  }




  onSearchFieldChange(event: any, item: any, idx: number) {
    this.clearError(item);
    let filterItem = _.filter(this.defaultSearchItemList, { field: event.value, })[0];
    filterItem.selected = true;
    for (let k in filterItem) {
      if (k != "fieldList" && k != "operatorList" && k != "operator" && k != "operatorName") {
        item[k] = filterItem[k];
      }
    }


    // _.remove(this.selectedFilterItems, (ele) => {return ele.dbField == item.dbField;});


    _.forEach(this.searchEnabledColumnList, (col: any) => {
      let obj = _.filter(this.searchItemList, { field: col.columnDef });
      if (obj.length > 0) {
        col.selected = true;
      } else {
        col.selected = false;
      }
    });

    let column = _.filter(this.searchEnabledColumnList, {
      columnDef: item.field,
    });
    this.getLookupData(column[0], item);

    this.ref.detectChanges();
  }


  checkSearchFieldExist(field: any): boolean {
    let isExist = false;
    let arr = _.filter(this.searchItemList, { field: field });
    arr.length > 0 ? isExist = true : isExist = false;
    return isExist;
  }


  onSearchConditionChange(event: any, item: any, idx: number): void {
    this.clearError(item);
    item.value = null;

    item.conditionName = _.filter(item.conditionList, {
      id: event.value,
    })[0].name;

    if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
      this.selectedFilterItems[idx].condition = item.condition;
      this.selectedFilterItems[idx].value = null;
      if(this.SingleDatePicker){ this.SingleDatePicker.select(undefined)};
    }


    if (_.filter(this.searchItemList, { index: idx }).length > 0) {
      this.searchItemList[idx].value = null;
    }


  }

  onSearchOperatorChange(event: any, item: any, idx: number): void {
    this.clearError(item);

    item.operatorName = _.filter(item.operatorList, {
      value: event.value,
    })[0].name;

    if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
      this.selectedFilterItems[idx].operator = item.operator;
    }

    this.setInitialItemOperator();
  }

  onItemSelect(event: any, item: any, idx: number) {
    this.clearError(item);

    if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
      this.selectedFilterItems[idx].selected = event.checked;
    }
  }

  onTextValueChange(event: any, searchItem: any, idx: number): void {
    this.clearError(searchItem);
    let val = searchItem.value;
    let actualValue = (searchItem?.type == 'number' && !isNaN(val)) ?  Number(val): val;
;
    // _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });




    if (searchItem.condition == "equal") {
      let obj = {
        value: actualValue,
        dbField: searchItem.dbField,
        columnname: searchItem.fieldName,
        columnDef: searchItem.field,
        colField: searchItem.field,
        operator: searchItem.operator,
        condition: searchItem.condition,
        selected: searchItem.selected,
        index: idx
      }
      if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
        this.selectedFilterItems[idx] = obj;
      }
      else {
        this.selectedFilterItems.push(obj);
      }
    }
    else {
      let obj: any = {
        value: {},
        dbField: searchItem.dbField,
        columnname: searchItem.fieldName,
        columnDef: searchItem.field,
        colField: searchItem.field,
        operator: searchItem.operator,
        condition: searchItem.condition,
        selected: searchItem.selected,
        metaValue: searchItem.metaValue,
        index: idx
      };
      obj.value["$" + searchItem["condition"]] = actualValue;
      if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
        this.selectedFilterItems[idx] = obj;
      }
      else {
        this.selectedFilterItems.push(obj);
      }
    }














    // if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
    //   this.selectedFilterItems[idx] = obj;
    // }
    // else {
    //   this.selectedFilterItems.push(obj);
    // }

  }

  onValueSelect(event: any, searchItem: any, idx: number): void {
    this.clearError(searchItem);
   let masterDataValue = null;
    if(searchItem.isMasterData){
    let _type = searchItem.isMasterData ? searchItem.lookupProperty ? searchItem.lookupProperty : 'name' :  'value';
    masterDataValue =  this.extractFilterValue(event.value, this.selectedLang, _type );
    masterDataValue = (searchItem.type == 'number' && !isNaN(masterDataValue)) ? Number(masterDataValue) : masterDataValue;
    searchItem.masterDataValue = masterDataValue;
    }

    let val = this.extractFilterValue(event.value, this.selectedLang, 'value' );
    searchItem.value = (searchItem.type == 'number' && !isNaN(val)) ? Number(val) : val;

    let obj = {
      value: (searchItem.isMasterData && masterDataValue != null) ? masterDataValue : searchItem.value,
      dbField: searchItem.dbField,
      columnname: searchItem.fieldName,
      columnDef: searchItem.field,
      colField: searchItem.field,
      operator: searchItem.operator,
      condition: searchItem.condition,
      selected: searchItem.selected,
      index: idx,
      metaValue: searchItem.metaValue,
      masterDataValue:masterDataValue,
      valueText:searchItem.value 
    };
    // _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });

    if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
      this.selectedFilterItems[idx] = obj;
    }
    else {
      this.selectedFilterItems.push(obj);
    }


    this.ref.detectChanges();
  }


  onMasterValueSelect(event: any, searchItem: any, idx: number): void {
    this.clearError(searchItem);
   let masterDataValue = null;
    if(searchItem.isMasterData){
    let _type = searchItem.isMasterData ? searchItem.lookupProperty ? searchItem.lookupProperty : 'name' :  'value';
    masterDataValue =  this.extractFilterValue(event, this.selectedLang, _type );
    masterDataValue = (searchItem.type == 'number' && !isNaN(masterDataValue)) ? Number(masterDataValue) : masterDataValue;
    }

    let val = this.extractFilterValue(event, this.selectedLang, 'value' );
    searchItem.value = (searchItem.type == 'number' && !isNaN(val)) ? Number(val) : val;

    let obj = {
      value: (searchItem.isMasterData && masterDataValue != null) ? masterDataValue : searchItem.value,
      dbField: searchItem.dbField,
      columnname: searchItem.fieldName,
      columnDef: searchItem.field,
      colField: searchItem.field,
      operator: searchItem.operator,
      condition: searchItem.condition,
      selected: searchItem.selected,
      index: idx,
      metaValue: searchItem.metaValue,
      masterDataValue:masterDataValue,
      valueText:searchItem.value 
    };
    // _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });

    if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
      this.selectedFilterItems[idx] = obj;
    }
    else {
      this.selectedFilterItems.push(obj);
    }


    this.ref.detectChanges();
  }



  checkDateValid(start: any, end: any, type: any) {
    let valid = true;
    if (type == 'endDate' && start < end) {
      valid = false;
    }
    else  if (type == 'startDate' && start > end) {
      valid = false;
    }
    return valid;
  }

  onDateValueChange(event: any, searchItem: any, _type: any, idx: number) {
    if (idx !== undefined) {

      this.clearError(searchItem);
      let val = event.value;
      searchItem.value = val;
      let condObj = _.filter(searchItem.conditionList, {
        id: searchItem.condition,
      })[0];
      let startOfDay, endOfDay;
      startOfDay = new Date(val);
      startOfDay.setTime(startOfDay.getTime() + (0 * 60 * 60 * 1000));
      endOfDay = new Date(val);
      //endOfDay.setTime(endOfDay.getTime() + ((28 * 60 * 60 * 1000) - 60));
      endOfDay.setTime(endOfDay.getTime() + (24 * 60 * 60 * 1000));

      let transFormat = "YYYY-MM-dd HH:mm"



      if (searchItem.dateConvertFormat == 'number') {
        startOfDay = startOfDay.getTime() * 10000 + 621355968000000000; //convert to ticks
        endOfDay = endOfDay.getTime() * 10000 + 621355968000000000;
      }
      else if (searchItem.fieldName === 'updatedDate.0') {
        startOfDay = startOfDay.getTime() * 10000 + 621355968000000000; //convert to ticks
        endOfDay = endOfDay.getTime() * 10000 + 621355968000000000;
      }

      //startOfDay = new Date(startOfDay).setHours(0,0,0,0);
      //endOfDay = new Date(endOfDay).setHours(0,0,0,0);

    

      if (searchItem.condition == "equal") {
        let obj: any = {
          value: {},
          dbField: searchItem.dbField,
          columnname: searchItem.fieldName,
          columnDef: searchItem.field,
          colField: searchItem.field,
          condition: searchItem.condition,
          operator: searchItem.operator,
          selected: searchItem.selected,
          metaValue: searchItem.metaValue,
          index: idx,
        };
        obj.value["$gte"] = startOfDay; //val.toISOString(); 
        obj.value["$lt"] = endOfDay;
        //  _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });
        // this.selectedFilterItems.push(obj);
        if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
          this.selectedFilterItems[idx] = obj;
        }
        else {
          this.selectedFilterItems.push(obj);
        }
      }
      else if (searchItem.condition !== "between") {
        let obj: any = {
          value: {},
          dbField: searchItem.dbField,
          columnname: searchItem.fieldName,
          columnDef: searchItem.field,
          colField: searchItem.field,
          operator: searchItem.operator,
          condition: searchItem.condition,
          selected: searchItem.selected,
          metaValue: searchItem.metaValue,
          index: idx
        };
        obj.value["$" + searchItem["condition"]] = startOfDay;
        if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
          this.selectedFilterItems[idx] = obj;
        }
        else {
          this.selectedFilterItems.push(obj);
        }
      }
      else {

    



        if (_type == "startDate") {

        if(searchItem.dateAPITransformFormat){
          transFormat = searchItem.dateAPITransformFormat;
        }
       
        if(transFormat != 'skip' && searchItem.dateConvertFormat != 'number' && searchItem.fieldName != 'updatedDate.0'){
          startOfDay = this.datepipe.transform(startOfDay, transFormat);         
        }

          if (this.checkDateValid(startOfDay, this.selectedFilterItems[idx]?.value?.$lt , _type)) {
            let obj: any = {
              value: {},
              dbField: searchItem.dbField,
              columnname: searchItem.fieldName,
              columnDef: searchItem.field,
              colField: searchItem.field,
              condition: searchItem.condition,
              operator: searchItem.operator,
              selected: searchItem.selected,
              metaValue: searchItem.metaValue,
              index: idx
            };
            obj.value["$gte"] = startOfDay; // new Date(val).getTime();//val.toISOString();
            //  _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });
            // this.selectedFilterItems.push(obj);



            if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
              if(this.selectedFilterItems[idx] &&  this.selectedFilterItems[idx]?.value &&  this.selectedFilterItems[idx]?.value.$lt){
                obj.value["$lt"] =  this.selectedFilterItems[idx]?.value.$lt
              }
              this.selectedFilterItems[idx] = obj;
            }
            else {
              this.selectedFilterItems.push(obj);
            }
          }
          else {
            this.setError(searchItem, this.transService.translate("Please enter valid date range"))
          }
        }
        else {

          if (this.checkDateValid(startOfDay, this.selectedFilterItems[idx]?.value?.$gte, _type)) {

            startOfDay.setTime(startOfDay.getTime() + (24 * 60 * 60 * 1000));



            if(searchItem.dateAPITransformFormat){
              transFormat = searchItem.dateAPITransformFormat;
            }
           
            if(transFormat != 'skip' && searchItem.dateConvertFormat != 'number' && searchItem.fieldName != 'updatedDate.0'){
              startOfDay = this.datepipe.transform(startOfDay, transFormat);         
            }

            let obj = _.filter(this.selectedFilterItems, {
              columnDef: searchItem.field,
            });
            obj[0].value["$lt"] = startOfDay; //new Date(val).getTime(); //val.toISOString();
            //   _.remove(this.selectedFilterItems, { dbField: searchItem.dbField });
            //this.selectedFilterItems.push(obj[0]);
            if (_.filter(this.selectedFilterItems, { index: idx }).length > 0) {
              this.selectedFilterItems[idx] = obj[0];
            }
            else {
              this.selectedFilterItems.push(obj[0]);
            }
          }
          else {
            this.setError(searchItem, this.transService.translate("Please enter valid date range"))
          }

        }
      }
      this.ref.detectChanges();
    }
  }



  setInitialItemOperator(): void {
    if (this.searchItemList.length > 1) {
      this.searchItemList[0].operator = this.searchItemList[1].operator;
      this.searchItemList[0].operatorName = this.searchItemList[1].operatorName;
      this.selectedFilterItems[0].operator = this.searchItemList[1].operator;
    }
    else {
      this.searchItemList[0].operator = null;
      this.searchItemList[0].operatorName = null;
      if (this.selectedFilterItems.length > 0)
        this.selectedFilterItems[0].operator = null;
    }
  }

  public applySearch(): void {
    if (this.checkActiveRowValid()) {
      this.filterPayload = {
        // active: true,
      };

      if (this.selectedFilterItems.length > 0) {
        let opr = null;
        let _selectedFilterItems: any = _.filter(this.selectedFilterItems, { selected: true });
        let filterGrup = _.groupBy(_selectedFilterItems, "dbField");
        for (let key in filterGrup) {
          let orObj = { $or: [] };
          _.forEach(filterGrup[key], (item: any) => {


            let metaObj = null;
            //if(item.metaValue){    metaObj = {};  (item.value == 'Draft') ?  metaObj['$exists'] = false :  metaObj[item.metaValue] = item.value;    }
            if(item.metaValue){    metaObj = {};  (item.value == 'Draft') ?  metaObj[item.metaValue] = item.value :  metaObj[item.metaValue] = item.value;    }


            if (item.operator == 'or') {
              if (!this.filterPayload["$or"])
                this.filterPayload["$or"] = [];

              this.filterPayload["$or"].push({
                [item.dbField]: metaObj != null ? metaObj : item.value
              });
            }
            else if (item.operator == 'and') {
              if (!this.filterPayload["$and"])
                this.filterPayload["$and"] = [];


              this.filterPayload["$and"].push({
                [item.dbField]:  metaObj != null ? metaObj : item.value
              });
            }
            else {
              this.filterPayload[item.dbField] =  metaObj != null ? metaObj : item.value;
            }

          });
        }

        if (!_.isEmpty(this.filterPayload)) {
          this.filterPayload.active = true;
        }


        if (this.gridConfig.mergePayload && this.gridConfig.mergePayload == true) {
          this.gridConfig.filterData = JSON.parse(JSON.stringify(this.filterPayload));
          this.filterPayload = this.tableService.mergeFilteredValues(this.filterPayload, this.gridConfig.inlineFilterData);
          this.gridConfig.filterValue = this.filterPayload;
        }
        else {
          this.gridConfig.filterData = JSON.parse(JSON.stringify(this.filterPayload));
          this.gridConfig.filterValue = this.filterPayload;
        }

        let obj: advanceSearchResult = { selectedItems: _selectedFilterItems, filterPayload: this.filterPayload }
        this.onAdvanceSearch.emit(obj);
      }
      else {
        if (this.gridConfig.mergePayload && this.gridConfig.mergePayload == true) {
          this.gridConfig.filterData = JSON.parse(JSON.stringify(this.filterPayload));
          this.filterPayload = this.tableService.mergeFilteredValues(this.filterPayload, this.gridConfig.inlineFilterData);
          this.gridConfig.filterValue = this.filterPayload;
        }
        else {
          this.gridConfig.filterData = this.filterPayload;
          this.gridConfig.filterValue = this.filterPayload;
        }

        let obj: advanceSearchResult = { selectedItems: this.selectedFilterItems, filterPayload: this.filterPayload }
        this.onAdvanceSearch.emit(obj)
      }

    }


  }


  getConditionList(_type: any): any {
    if (_type && _type.toLowerCase() == "string")
      return _.cloneDeep(GERNERIC_SEARCH_STRING_CONDITIONS);
    else if (_type && _type.toLowerCase() == "date")
      return _.cloneDeep(GERNERIC_SEARCH_DATE_CONDITIONS);
    else if (_type && _type.toLowerCase() == "number")
      return _.cloneDeep(GERNERIC_SEARCH_NUMBER_CONDITIONS);
  }

  getLookupData(column: any, searchItem: any): void {
    let params = new HttpParams();
    params = params.set("isMasterData", column.isMasterData);
    params = params.set("colDef", JSON.stringify(column));
    params = params.set("column", column.columnDef);

    this.searchLookupService.fetch(params).then((result: any) => {
      searchItem.valueList = _.cloneDeep(result.list);
      searchItem.filteredValueList = _.cloneDeep(result.list);
    });
  }

  resetAdvanceSearch(apiCall: boolean = false): void {
    this.searchItemList = [];
    this.selectedFilterItems = [];
    this.filterPayload = {
      // active: true,
    };
    if (this.showAdvSearch) {
      this.addNewSearchItem();
    }




    if (this.gridConfig.mergePayload && this.gridConfig.mergePayload == true) {
      this.gridConfig.filterData = JSON.parse(JSON.stringify(this.filterPayload));
      this.filterPayload = this.tableService.mergeFilteredValues(this.filterPayload, this.gridConfig.inlineFilterData);
      this.gridConfig.filterValue = this.filterPayload;
    }
    else {
      this.gridConfig.filterData = JSON.parse(JSON.stringify(this.filterPayload));
      this.gridConfig.filterValue = this.filterPayload;
    }


    if (apiCall) {
      let obj: advanceSearchResult = { selectedItems: this.selectedFilterItems, filterPayload: this.filterPayload }
      this.onAdvanceSearch.emit(obj)
    }

    this.ref.detectChanges();
  }

  clearError(item: any): void {
    item.error = false;
    item.errorMsg = null;
  }


  setError(item: any, msg: string): void {
    item.error = true;
    item.errorMsg = msg;
  }


  checkActiveRowValid(): boolean {
    let searchItems = _.filter(this.searchItemList, { selected: true });
    let length = searchItems.length;
    let valid = true;
    let _item = _.filter(searchItems, (item)=>{ return item.value  == null  || item.error == true } );
    if (_item.length > 0) {
      if(_item[0].error){
        this.setError(_item[0], _item[0].errorMsg)
      }
      else{
        let msg = "You must enter all the field values"
        this.setError(_item[0], msg);
      }

     
      valid = false
    }
    return valid;
  }



  // ______________ GLOBAL SEARCH ______________
  toggleAdvanceSearch(): void {
    this.showAdvSearch = !this.showAdvSearch;
    if (this.showAdvSearch && this.globalSearchModel && this.globalSearchModel != '') {
      this.clearGlobalSearch();
    }
    this.resetAdvanceSearch(true);

  }


  globalSearchFn(val: any): void {
    this.gridConfig.globalSearchValue = val;

    this.filterPayload = {
      //  active: true 
    };
   // let searchVal: any = this.globalSearchModel.trim().replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
    let searchVal: any =  this.globalSearchModel.trim().replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");

    if (searchVal) {
      this.helperService.clearAllInlineFilter(true);

      this.filterPayload['$or'] = [];
      let colObj = {};
      this.tableColumn.forEach((item: any, idx: number) => {
        // colObj[item.dbField] = { $regex: searchVal, $options: "i" };
        if (item.columnDef != 'select' && item.columnDef != 'action') {
          // convert if type = number
          //(item.type == 'number' && !isNaN(searchVal)) ? Number(searchVal)

          if (item.type == 'number'  && !isNaN(searchVal)) {   // && !isNaN(searchVal)
            let obj = { $expr: { $regexMatch: { input: { $toString: `$${[item.dbField]}` }, regex: searchVal } } };
            // let obj = { [item.dbField]: { $regex: searchVal, $options: "i" } }
            this.filterPayload['$or'].push(obj);
          }
          else if(item.dbLabelField && item.appendDbLabelFieldLang){
            let obj = { [item.dbLabelField + '.'+ this.selectedLang]: { $regex: searchVal, $options: "i" } }
            this.filterPayload['$or'].push(obj);
          }
          else if(item.dbLabelField){
            let obj = { [item.dbLabelField]: { $regex: searchVal, $options: "i" } }
            this.filterPayload['$or'].push(obj);
          }
          else {
            let obj = { [item.dbField]: { $regex: searchVal, $options: "i" } }
            this.filterPayload['$or'].push(obj);
          }

        }
      });
      // this.filterPayload['$or'].push(colObj);

    }

    if (!_.isEmpty(this.filterPayload)) {
      this.filterPayload.active = true;
    }




    this.gridConfig.globalSearchPayload = JSON.parse(JSON.stringify(this.filterPayload));
    this.gridConfig.filterValue = this.filterPayload;

    let obj: advanceSearchResult = { selectedItems: this.selectedFilterItems, filterPayload: this.filterPayload, value:this.globalSearchModel }
    this.onGlobalSearch.emit(obj);
  }

  clearGlobalSearch() {
    this.globalSearchModel = "";
    this.gridConfig.globalSearchPayload = {};
    this.globalSearchFn(this.globalSearchModel);
  }


  translate(value: any, args?: any) {
    if (this._transLocoService && this._transLocoService.translate) {
      let deflang = localStorage.getItem('defaultLanguage');
      deflang = !deflang ? 'en-US' : deflang;
      this.selectedLang = deflang;
      return this._transLocoService.translate(value, {}, deflang);
    }
    else {
      return value;
    }

  }

  onValueFieldSearch(target: any, item: any, property: string): any {
    if (target?.value && target?.value != "") {
      item.filteredValueList = [];
      this.searchInValueList(target?.value, item, property);
    }
    else {
      item.filteredValueList = _.cloneDeep(item.valueList);
    }
  }

  searchInValueList(value: string, item: any, property: string) {
    let filter = value.toLowerCase();
    item.valueList.forEach((valItem: any) => {
      if (valItem && valItem.description && isObject(valItem.description)) {
        let _item: any = valItem['description'];
        if (_item[this.selectedLang].toLowerCase().indexOf(filter) >= 0) {
          item.filteredValueList.push(valItem);
        }
      }
      else if (valItem && valItem[property]) {
        if (valItem[property].toLowerCase().indexOf(filter) >= 0) {
          item.filteredValueList.push(valItem);
        }
      }
      else if (valItem) {
        if (valItem.toLowerCase().indexOf(filter) >= 0) {
          item.filteredValueList.push(valItem);
        }
      }
    });
  }

}
