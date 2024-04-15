import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import _, { filter, isEmpty, isObject, isString } from "lodash";
import { GenericListingTableService } from "../../services/generic-listing-table.service";
import { HttpParams } from "@angular/common/http";
import { GENERIC_TABLE_TOKEN_DATA } from "../../model/generic-table.token.injector";
import { IGenericInlineFilterLookupService, IGenericTransService } from "../../model/i-generic-inline-filter-lookup.interface";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { gridConfigObj } from "../../model/default-table.model";
import { TranslationService } from "../../services/translation.service";
import { CustomValidators } from "../../helper/translate.pipe";
import { HelperService } from "../../services/helper.service";
import { Subscription } from "rxjs";
import { DateAdapter } from "@angular/material/core";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-inline-filter",
  templateUrl: "./inline-filter.component.html",
  styleUrls: ["./inline-filter.component.scss"],
  providers: [GenericListingTableService]

})
export class InlineFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onMenuFilterChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInitInlineFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onApplyFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();

  service: any;
  inlineFilterService: IGenericInlineFilterLookupService;

  @Input() column: any = null;
  @Input() filterSourceData: any[] = [];
  @Input() _columnFilter: any = null;
  @Input() selectedLang: string = "en-US";
  @Input() gridConfig: gridConfigObj;
  @Input() set source(value: any | any[]) {
    // if (this.isFilterService(value)) {
    // this.service = value as IAtlpFilterService;
    // }
    this.service = value;
  }


  subs:Subscription[]=[];
  loaded = false;
  sortEnabled = false;

  columnFilter: any = {
    sourceFilterDataList: {},
    filterDataList: [],
    dateFilterForm: null
  };

  commonFilterData: any = {
    selectedFilterItems: [],
    selectedFilterValues: [],
    tempSelectedItems: [],
    filterPayload: null,
    lastFilteredItem: null,
    dateFilterForm: null,
  };

  filterDataList: any[] = [];
  _transLocoService: IGenericTransService;

  lastfilteredColumn: any = null;
  extractFilterValue: any;
  onFilterSearchFn: any;
  translateThis: any = null;
  constructor(
    private cdr: ChangeDetectorRef,
    public router: Router,
    public tblService: GenericListingTableService,
    private fb: FormBuilder,
    private transService: TranslationService,
    private helperService: HelperService,
    @Inject(GENERIC_TABLE_TOKEN_DATA) public data: any,
    private dateAdapter: DateAdapter<any>,
    private datepipe: DatePipe
  ) {
    this.column =  data?.filterData?.column;
    this.filterSourceData = data?.filterData?.filterSourceData;
    this.inlineFilterService = data?.filterData?.inlineFilterService;
    this._transLocoService = data?.filterData?.translationService;
    this.columnFilter = data?.filterData?.columnFilter;
    this.gridConfig = data?.gridConfig;
    this.commonFilterData = data?.filterData?.commonFilterData;
    this.extractFilterValue = this.inlineFilterService?.extractFilterValue;
    this.onFilterSearchFn = this.inlineFilterService?.onFilterSearchFn;
    this.translateThis = this.inlineFilterService.translateItem;

  }

  ngOnInit(): void {

    if (this.column.columnType == 'date') {
      if (this.columnFilter.dateFilterForm == null) {
        this.columnFilter.dateFilterForm = this.fb.group({
          startDate: new FormControl("", Validators.required),
          endDate: new FormControl("", Validators.required),
        },
          {
            validator: [
              CustomValidators.dateRangeValidator('startDate', 'endDate'),
            ]
          }
        );

      }
    }
    else {
      if (this.columnFilter.filterDataList?.length == 0) {
        this.getLookupData();
      }
    }


    this.subs.push(
    this.transService.getLang$.subscribe((lang: any) => {
      if (lang && lang != '') {
        this.selectedLang = lang;
        if(lang == 'ar-AE' || lang == 'ar'){
         this.dateAdapter.setLocale('ar');
        }
        else{
          this.dateAdapter.setLocale('en');
        }
      }
    }));

    this.subs.push( this.helperService.clearInlineFilter$.subscribe((data)=>{
        if(data == true){
         this.clearColumnFilter(this.column, true);
        }
    }));

    this.subs.push(this.helperService.clearInlineFilterSort$.subscribe((data)=>{
      if(data.column && data.column != this.column && data.clear == true &&  this.column.sort != null){
       this.column.sort = null;
      }
  }));



    // this.tblService.clearFilter$.subscribe((gridConfig) => {
    //   this.clearColumnFilter(this.column);
    //   this.cdr.detectChanges();
    // });






  }

  ngAfterViewInit():void{
    this.loaded = true;
  }


  get formValidator(): any {
    return this.columnFilter.dateFilterForm.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['filterSourceData'] &&
      changes['filterSourceData'].previousValue !=
      changes['filterSourceData'].currentValue
    ) {
      this.updateData(this.column, this.filterSourceData);
    }
  }

 ngOnDestroy(): void {
  this.subs.forEach((sub)=>{sub.unsubscribe();});   
  this.cdr.detach();
 }


  public setFilter(column: any) {
    this.column = column;
    this.filterSourceData = [];
    this.columnFilter.filterDataList = [];
  }

  public initFilter(column = this.column?.columnDef) {
  }

  public applyColumnFilter(column: any, isClearFilter = false) {
    if (this.commonFilterData.tempSelectedItems.length > 0) {    
       

      this.commonFilterData.tempSelectedItems.forEach((obj: any) => {
        if(obj.columnDef == column.columnDef){
          obj.filterApplied = true;
        }
        // _.remove(this.commonFilterData.selectedFilterItems, (item: any) => {
        //   return obj.selected != true && item.dbField == obj.dbField && item.value == obj.value;
        // });
       // this.commonFilterData.selectedFilterItems.push(obj);
 
      });

      this.commonFilterData.selectedFilterItems = _.filter( this.commonFilterData.tempSelectedItems , {filterApplied:true});

    }

    this.commonFilterData.selectedFilterValues = [];
    this.commonFilterData.selectedFilterItems.forEach((item: any) => {
     let metaObj = null;
    // if(item.metaValue){    metaObj = {};  (item.value == 'Draft') ?  metaObj['$exists'] = false :  metaObj[item.metaValue] = item.value;    }
    if(item.metaValue){    metaObj = {};  (item.value == 'Draft') ?  metaObj[item.metaValue] = item.value :  metaObj[item.metaValue] = item.value;    }

     this.commonFilterData.selectedFilterValues.push({
        [item.dbField]: metaObj != null ? metaObj : item.value,
      });
    });

    this.commonFilterData.filterPayload = {
      //active: true,
    };

    column.filerEnabled = false;

    if (this.commonFilterData.selectedFilterItems.length > 0) {
      this.commonFilterData.filterPayload["$and"] = [];
      let filterGrup = _.groupBy(this.commonFilterData.selectedFilterItems, 'dbField');
      for (let key in filterGrup) {
        let orObj: any = { $or: [] }
        _.forEach(filterGrup[key], (item: any) => {
          if (item.columnDef == column.columnDef) {
            column.filerEnabled = true;
          }


          let metaObj = null;
         // if(item.metaValue){    metaObj = {};  (item.value == 'Draft') ?  metaObj['$exists'] = false :  metaObj[item.metaValue] = item.value;    }
          if(item.metaValue){    metaObj = {};  metaObj[item.metaValue] = item.value;    }

          orObj.$or.push(
            {
              [item.dbField]: metaObj != null ? metaObj : item.value,
            }
          )
        });
        this.commonFilterData.filterPayload["$and"].push(orObj);

      }
    }

   
    if(!_.isEmpty(this.commonFilterData.filterPayload)){
      this.commonFilterData.filterPayload.active = true;
    }


    if(this.gridConfig.mergePayload && this.gridConfig.mergePayload == true){
      this.gridConfig.inlineFilterData = JSON.parse(JSON.stringify(this.commonFilterData.filterPayload));
      this.commonFilterData.filterPayload =  this.tblService.mergeFilteredValues(this.commonFilterData.filterPayload, this.gridConfig.filterData );
      this.gridConfig.filterValue = this.commonFilterData.filterPayload;
    }
      else{
        this.gridConfig.inlineFilterData = JSON.parse(JSON.stringify(this.commonFilterData.filterPayload));
        this.gridConfig.filterValue = this.commonFilterData.filterPayload;
      }

    this.onMenuFilterChanges.emit({ filterData: this.commonFilterData, filteredColumn: column, isClearFilter: isClearFilter, inlineFilterData: this.gridConfig.inlineFilterData});
  }



  public onCheckboxChange(event: any, column: any, filteredItem: any) {
    let _type = column.isMasterData ? column.lookupProperty ? column.lookupProperty : 'name' :  'value';
    let obj = {
      value: isObject(filteredItem) ? this.extractFilterValue(filteredItem, this.selectedLang, _type) : filteredItem,
      dbField: column.dbField,
      columnname: column.header,
      columnDef: column.columnDef,
      colField: column.colField,
      metaValue: column.metaValue
    };

    if (event.checked) {
      isString(filteredItem) ? null : filteredItem.selected = true;
      this.commonFilterData.tempSelectedItems.push(obj);
      this.commonFilterData.selectedFilterItems.push(obj);
    } else {
      isString(filteredItem) ? null : filteredItem.selected = false;
      _.remove(this.commonFilterData.tempSelectedItems, (item: any) => {
        return item.dbField == obj.dbField && item.value == obj.value;
      });

      _.remove(this.commonFilterData.selectedFilterItems, (item: any) => {
        return item.dbField == obj.dbField && item.value == obj.value;
      });
    }
  }


  checkisExistOrnot(column: any, item: string): boolean {
    let isExist = false;
    if (_.filter(this.commonFilterData.selectedFilterItems, { columnDef: column.columnDef, value: item }).length > 0) {
      isExist = true;
    }
    return true;
  }


  public clearColumnFilter(column: any , skipRefresh = false) {
    // this.commonFilterData.tempSelectedItems = [];
      if(column.sort !== null){
        column.sort = null;
        this.gridConfig.sortData = {};   
      }

      this.sortEnabled =false;
     
    _.remove(this.commonFilterData.tempSelectedItems, (item: any) => {
      return item.dbField == column.dbField;
    });

    _.remove(this.commonFilterData.selectedFilterItems, (item: any) => {
      return item.dbField == column.dbField;
    });

    let sourceList = JSON.stringify(this.columnFilter.sourceFilterDataList);
    this.columnFilter.filterDataList = JSON.parse(sourceList);

    this.columnFilter.filterDataList.forEach((item: any) => {
      item.selected = false;
    });
     


    column.filerEnabled = false;
    column.filterSearchValue = '';
    if(!skipRefresh){
    this.applyColumnFilter(column, true);
    }

    this.cdr.detectChanges();

  }






  public applyDateFilter(column: any) {



    let startDate: any = new Date(this.columnFilter.dateFilterForm.get('startDate').value);
    let endDate: any = new Date(this.columnFilter.dateFilterForm.get('endDate').value);
    // {"$gte":"2023-07-14T00:00:00.000Z","$lt":"2023-07-29T23:59:59.940Z"}


    if (startDate.getTime() == endDate.getTime()) {
      startDate.setTime(startDate.getTime() + (0 * 60 * 60 * 1000));
     // endDate.setTime(endDate.getTime() + ((28 * 60 * 60 * 1000) - 60));
     endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));

    }
    else {
      startDate.setTime(startDate.getTime() + (0 * 60 * 60 * 1000));
     //endDate.setTime(endDate.getTime() + (0 * 60 * 60 * 1000));
     endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));

    }

 


    if (column.dateConvertFormat == 'iso') {
      startDate = startDate.toISOString();
      endDate = endDate.toISOString();
    }
    else if (column.dateConvertFormat == 'local') {
      startDate = new Date(startDate);
      endDate = new Date(endDate.getTime());
    }
    else if (column.dateConvertFormat == 'number' || column.columnDef == 'updatedDate.0') {
      startDate = new Date(startDate).getTime() * 10000 + 621355968000000000;
      endDate = new Date(endDate).getTime() * 10000 + 621355968000000000;
    }
    else {
      startDate = startDate.toISOString();
      endDate = endDate.toISOString();
    }

    let transFormat = "YYYY-MM-dd HH:mm"
    if(column.dateAPITransformFormat){
      transFormat = column.dateAPITransformFormat;
    }
   
    if(transFormat != 'skip' &&  column.dateConvertFormat != 'number' &&  column.columnDef != 'updatedDate.0'){
    startDate = this.datepipe.transform(startDate, transFormat);
    endDate = this.datepipe.transform(endDate, transFormat);
    }

    let obj = {
      value: { "$gte": startDate, "$lt": endDate },
      dbField: column.dbField,
      columnname: column.header,
      columnDef: column.columnDef,
      colField: column.colField,
      metaValue: column.metaValue
    };
    _.remove(this.commonFilterData.selectedFilterItems, { columnDef: column.columnDef });
    _.remove(this.commonFilterData.tempSelectedItems, { columnDef: column.columnDef });
    this.commonFilterData.tempSelectedItems.push(obj);
    this.commonFilterData.selectedFilterItems.push(obj);

    if (this.columnFilter.dateFilterForm.valid) {
      this.applyColumnFilter(column);
    }
  }



  public clearDateFilter(column: any) {
    _.remove(this.commonFilterData.selectedFilterItems, { columnDef: column.columnDef });
    _.remove(this.commonFilterData.tempSelectedItems, { columnDef: column.columnDef });
    this.columnFilter.dateFilterForm.reset();
    this.cdr.detectChanges();
    column.filerEnabled = false;
    this.applyColumnFilter(column);
  }




  public onFilterSearch(column: any) {
    let value = column.filterSearchValue;
    this.columnFilter.filterDataList = this.onFilterSearchFn(column, value, this.columnFilter.sourceFilterDataList, this.selectedLang);
    // this.columnFilter.filterDataList = _.filter(
    //   this.columnFilter.sourceFilterDataList,
    //   (item: any) => {
    //     return (
    //       item.code.toLowerCase().includes(value.toLowerCase()) ||
    //       item.nameAr.toLowerCase().includes(value.toLowerCase()) ||
    //       item.nameEn.toLowerCase().includes(value.toLowerCase())
    //     );
    //   }
    // );
    // this.columnFilter.filterDataList = this.columnFilter.filterDataList;
  }



  sortDataSource_(id: string, start: any, col: any) {
    this.sortEnabled = true;
    this.helperService._clearInlineFilterSort({column : this.column, clear:true});   
    const sortData = { ColumnName: id, Order: start, Col: col };
    sortData.Order == "1" ? (col.sort = "asc") : sortData.Order == "-1" ? (col.sort = "desc") : col.sort = null;
    this.onSort.emit(sortData);   
  
  }





  updateData(column: any, data: any) {
    if (column.isMasterData) {
      this.columnFilter.sourceFilterDataList[column.colField] = data.items;
      this.columnFilter.filterDataList =
        this.columnFilter.sourceFilterDataList[column.colField];
      this.columnFilter.filterDataList = this.columnFilter.filterDataList;
      this.cdr.detectChanges();
      console.log("callMasterDataAPI => ", this.columnFilter.filterDataList);
    }
    else {
      data.forEach((item: any) => {
        let obj = {
          value: item,
          dbField: column.dbField,
          columnname: column.header,
          columnDef: column.columnDef,
          colField: column.colField,
          colType: column.type,          
        };
        if (this.columnFilter.sourceFilterDataList[column.colField]) {
          this.columnFilter.sourceFilterDataList[column.colField].push(obj);
          this.columnFilter.sourceFilterDataList[column.colField] = _.uniqBy(this.columnFilter.sourceFilterDataList[column.colField], "value");
        }
        else {
          this.columnFilter.sourceFilterDataList[column.colField] = [];
          this.columnFilter.sourceFilterDataList[column.colField].push(obj);
        }
      });
      this.columnFilter.filterDataList =
        this.columnFilter.sourceFilterDataList[column.colField];
      this.columnFilter.filterDataList = this.columnFilter.filterDataList;
      // this.cdr.detectChanges();
      console.log("callDataAPI => ", this.columnFilter.filterDataList);
    }
  }


  getImgPath(imgName: string) {
    return "../../assets/img/" + imgName;
  }

  laodData() {
    this.updateData(this.column, this.filterSourceData);
  }

  getLookupData() {
    let params = new HttpParams();
    params = params.set("isMasterData", this.column.isMasterData);
    params = params.set("colDef", JSON.stringify(this.column));
    params = params.set("column", this.column.columnDef);

    this.inlineFilterService.fetch(params).then((result: any) => {

      if (!this.column.isMasterData && result.list.length > 0) {
        let list: any[] = [];
        _.forEach(result.list, (item: any) => {
          let obj = { selected: false, value: item, code: item, name: item, nameEn: item, nameAr: item, isMasterData: false, isFunctionDate: this.column.isFunctionData, columnType:this.column.type, columnDef: this.column.columnDef };
          list.push(obj);
        });
        this.columnFilter.filterDataList = list;
        this.columnFilter.sourceFilterDataList = JSON.parse(JSON.stringify(list));
      }
      else {       
        // _.forEach(result.list, (item: any) => {
        //   item.columnType = this.column.type;
        //   item.columnDef = this.column.columnDef;         
        // });
        this.columnFilter.filterDataList = result.list;
        this.columnFilter.sourceFilterDataList = JSON.parse(JSON.stringify(result.list));
      }


    });
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







}



