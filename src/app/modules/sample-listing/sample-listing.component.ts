import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { InlineFilterComponent } from 'projects/mg-generic-listing/src/lib/shared/inline-filter/inline-filter.component';
import { gridConfigObj, advanceSearchResult } from 'projects/mg-generic-listing/src/public-api';
import { Subscription } from 'rxjs';
import { ResponseMaperService } from './helper/response-maper.service';
import { TableColumns, manifestMetaObject } from './models/landing-listing-table.model';
import { LandingListInlineFilterService } from './services/landing-list-inline-filter.service';
import { RequestService } from './services/request.service';
import { MgGenericListingTableComponent } from 'projects/mg-generic-listing/src/lib/shared/mg-generic-listing-table/mg-generic-listing-table.component';
import { GenericListingTableService } from 'projects/mg-generic-listing/src/lib/services/generic-listing-table.service';
import { environment } from 'src/environments/environment';
import { TranslocoService } from '@ngneat/transloco';
import * as arabic from '../../../assets/i18n/ar-AE.json';

@Component({
  selector: 'app-sample-listing',
  templateUrl: './sample-listing.component.html',
  styleUrls: ['./sample-listing.component.scss'],
  providers: [GenericListingTableService]
})
export class SampleListingComponent {
  @ViewChild('genericTable') genericTable: MgGenericListingTableComponent;
  @ViewChild('inlineFilter') inlineFilter: InlineFilterComponent;


  sourceData: any[] = [];
  dataSource_: any;
  columnDefinition = TableColumns;
  gridConfig: gridConfigObj = {
    gridId: 'ca_landingGrid',
    tableColumns: _.filter(this.columnDefinition, { show: true, isDefault: true }),
    columnDefinition: this.columnDefinition,
    dataList: [],
    dataSource: [],
    multiSelect: true,
    pageSize: '50',
    pageIndex: '1',
    totalCount: 0,
    itemperpageList: ['5', '10', '20', "50"],
    tableMetaObject: manifestMetaObject,
    manifestMetaObject: manifestMetaObject,
    selectedItem: null,
    selectedList: [],
    validations: null,
    height: '100%',
    sortData: null,
    filterValue: {},
    filterData: {},
    showPagination: false,
    enableCardView: true,
    mergePayload:true,
    dragEnabled:true
  };
  subscriptions: Subscription[] = [];
  slectedItem = null;
  pagination = {
    pageSize: 5,
    pageIndex: 1
  }
  filterSourceData = [];
  lang ="en-US";
  showTable = true;

  constructor(private cdr: ChangeDetectorRef,
    private tblService: GenericListingTableService,
    private router: Router,
    private requestService: RequestService,
    private responseMaper: ResponseMaperService,
    public inlineFilterService: LandingListInlineFilterService,
    public _transLocoService: TranslocoService



    
  ) { }


  ngOnInit(): void {
    //  let savedGridConFig =  this.tblService.getCustomizedTableColumns(this.gridConfig);
    //  if(savedGridConFig){
    //   this.gridConfig = savedGridConFig;
    //  }
    this._transLocoService.langChanges$.subscribe((lang)=>{
      this.lang =lang;      
      this.genericTable.detectLanguageChanges(this.lang, arabic)
      this.cdr.detectChanges();
    });

  }


  changeLang(){
     this.lang =  this.lang == 'ar-AE'? 'en-US': 'ar-AE';
     let _langOpt = this.lang == 'ar-AE'? arabic:null;

     if(this.lang == 'ar-AE'){
     document.documentElement.setAttribute("lang", this.lang);
     document.documentElement.setAttribute("dir", 'rtl');
     document.body.setAttribute("dir", 'rtl');
     document.body.style.direction = 'rtl';
     document.body.setAttribute('dir','rtl');
     }
     else {
         document.documentElement.setAttribute("lang", this.lang);
         document.documentElement.setAttribute("dir", 'ltr');
         document.body.style.direction = 'ltr';
         document.body.setAttribute('dir','ltr');
     }
     
  


     this.genericTable.detectLanguageChanges(this.lang, _langOpt)
  }

  ngAfterViewInit() {
    this.tblService.customizedTableConfig$.subscribe(() => {
      let savedGridConFig = this.tblService.getCustomizedTableColumns(this.gridConfig);
      if (savedGridConFig) {
        this.gridConfig = savedGridConFig;
        this.genericTable.applyGridConfig(this.gridConfig);
        this.getRequestList();
      }
      else {
        this.getRequestList();
      }
    });

  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => { sub.unsubscribe(); });
  }

  getImgPath(imgName: string) {
    return environment.appUrl + "assets/img/" + imgName;
  }

  goToLanding() {
    this.router.navigate(["/appoinment"]);
  }



  getGridData(_gridConfig: any) {
    this.gridConfig = _gridConfig;
    this.getRequestList();
  }

  customizTable() {
    this.genericTable.customizeTable();
    //this.tblService.toggleCustomizeTable(this.gridConfig);
  }

  switchView() {
    this.genericTable.switchView();
    //this.tblService.toggleCustomizeTable(this.gridConfig);
  }

  onSelectItem(item: any) {
    if (item && !_.isEmpty(item) && item?.gridid == this.gridConfig?.gridId) {
      this.slectedItem = item;
    }
  }


  onUnSelectItem(item: any) {
    if (item && !_.isEmpty(item) && item.gridid == this.gridConfig.gridId) {
      this.slectedItem = item;
    }
  }

  clearFilter(config:any){
    this.gridConfig = config;
    this.showTable = false;
    this.cdr.detectChanges();
    setTimeout(()=>{
      this.showTable = true
      this.getRequestList();

      this.cdr.detectChanges();
    }, 500);
    //this.genericTable.clearAllFilter();
  }
  getRequestList(sortData?: any, filterValue?: {}) {
    let payload: any = { active: true };
    if (filterValue) {
      payload = filterValue;
    }

    let payloadPagination = {
      //  filter: filterValue,
      order: {},
      pagination: { pageSize: this.gridConfig.pageSize, pageIndex: this.gridConfig.pageIndex },
    };

    let sortOrder: any;
    if (sortData === undefined || sortData === null || sortData.length === 0) {
      sortOrder = { "updatedDate.0": -1 };
    }
    else if (sortData.Payload) {
      sortOrder = sortData.Payload;
    }
    // else if (sortData) sortOrder = this.formatSortedItem(sortData);

    this.requestService
      .getRequestLists(payload, payloadPagination, sortOrder)
      .pipe()
      .subscribe({
        next: (response) => {
          this.sourceData = response?.data?.data?.map((d: any) => {
            return <any>this.responseMaper.RequestListMapper(d);
          });

          this.dataSource_ = new MatTableDataSource(this.sourceData);

          this.gridConfig.totalCount = response?.data?.totalItemCount;
          this.gridConfig.pageIndex = response?.data?.pageIndex;
          this.gridConfig.pageSize = response?.data?.pageSize;

          this.gridConfig.dataList = this.dataSource_.data;
          this.genericTable.applyGridConfig(this.gridConfig);
        },
      });
  }



  onGridPageChanges(event: any) {
    this.gridConfig.pageSize = event.pageSize;
    this.gridConfig.pageIndex = event.pageIndex;
    this.getRequestList();

  }

  onSortOrderChange(event: any) {
    this.gridConfig.sortData = event;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }


  onMenuFilterChanges(event: any): any {
    this.gridConfig.filterValue = event?.filterPayload;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }










  afterCustomizeTableFn(event: any) {
    let savedGridConFig = this.tblService.getCustomizedTableColumns(this.gridConfig);
    if (savedGridConFig) {
      this.gridConfig = savedGridConFig;
      this.genericTable.applyGridConfig(this.gridConfig);
      this.getRequestList();
    }
  }


  onApplyAdvanceSearch(event: advanceSearchResult) {
    this.getRequestList(this.gridConfig.sortData, event.filterPayload);
  }

  onApplyGlobalSearch(event: advanceSearchResult) {
    this.getRequestList(this.gridConfig.sortData, event.filterPayload);
  }

}


