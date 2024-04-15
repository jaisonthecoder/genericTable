import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericListingTableService, InlineFilterComponent, MgGenericListingTableComponent, advanceSearchResult, gridConfigObj, manifestMetaObject } from '@pcs/generic-listing';
import { environment } from 'environments/environment';
import _ from 'lodash';
import { Subscription } from 'rxjs';

import { InlineFilterService } from './services/inline-filter.service';
import { RequestService } from './services/request.service';
import { ResponseMaperService } from './helper/response-maper.service';
import { TableColumns } from './models/generic-listing.model';
import { StatusText } from './helper/status-mapper';
import { RequestStatus } from './helper/RequestStatus';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-generic-listing',
  templateUrl: './generic-listing.component.html',
  styleUrls: ['./generic-listing.component.scss']
})
export class GenericListingComponent implements OnInit {
  @ViewChild('genericTable') genericTable: MgGenericListingTableComponent;
  @ViewChild('inlineFilter') inlineFilter: InlineFilterComponent;


  reqStatus = RequestStatus;
  sourceData: any[] = [];
  dataSource_ : any;
  columnDefinition = TableColumns;
  gridConfig: gridConfigObj = {
    gridId: 'generic-listing_landingGrid',
    tableColumns: _.filter(this.columnDefinition, { show: true, isDefault: true }),
    columnDefinition: this.columnDefinition,
    dataList: [],
    dataSource: [],
    multiSelect: true,
    pageSize: '10',
    pageIndex: '1',
    totalCount: 0,
    itemperpageList: ['5', '10', '20'],
    tableMetaObject: manifestMetaObject,
    manifestMetaObject: manifestMetaObject,
    selectedItem: null,
    selectedList: [],
    validations: null,
    height:'100%',
    sortData: null,
    filterValue: {}, 
    showPagination: false  
  };
  subscriptions: Subscription[] = [];
  slectedItem = null;
  pagination = {
    pageSize:5,
    pageIndex:1
  }
  filterSourceData = [];

tblView = true;
  constructor(private cdr: ChangeDetectorRef,
    private tblService: GenericListingTableService,
    private router: Router,
    private requestService: RequestService,
    private responseMaper: ResponseMaperService,
    public inlineFilterService: InlineFilterService,
    private _StatusText: StatusText,
    private _fuseConfirmationService: FuseConfirmationService,

      ) { }


  ngOnInit(): void {
  //  let savedGridConFig =  this.tblService.getCustomizedTableColumns(this.gridConfig);
  //  if(savedGridConFig){
  //   this.gridConfig = savedGridConFig;
  //  }


  }
  
  ngAfterViewInit(){
    this.tblService.customizedTableConfig$.subscribe(()=>{
      let savedGridConFig =  this.tblService.getCustomizedTableColumns(this.gridConfig);
      if(savedGridConFig){
       this.gridConfig = savedGridConFig;
       this.genericTable.applyGridConfig(this.gridConfig);
       this.getRequestList();
      }
      else{
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



  getGridData(_gridConfig:any){
    this.gridConfig = _gridConfig;
    this.getRequestList();
  }

  customizTable(event = null){
    this.genericTable.customizeTable();
  }

  onSelectItem(item:any) {
    if (item && !_.isEmpty(item) && item?.gridid == this.gridConfig?.gridId) {
      this.slectedItem = item;   
    }
  }


  onUnSelectItem(item:any) {
    if (item && !_.isEmpty(item) && item.gridid == this.gridConfig.gridId) {
      this.slectedItem = item;   
    }
  }

  
  getRequestList(sortData?: any, filterValue?: {}) {
    let payload: any= {active: true};
if(filterValue){
  payload = filterValue;
}

    let payloadPagination = {
    //  filter: filterValue,
      order: {},
      pagination:{pageSize: this.gridConfig.pageSize, pageIndex: this.gridConfig.pageIndex},
    };

    let sortOrder: any;
    if (sortData === undefined || sortData === null || sortData.length === 0){
      sortOrder = { "updatedDate.0": -1 };
    }
    else if(sortData.Payload){
      sortOrder = sortData.Payload;
    }
    // else if (sortData) sortOrder = this.formatSortedItem(sortData);

    this.requestService
      .getRequestLists(payload, payloadPagination, sortOrder)
      .pipe()
      .subscribe({
        next: (response) => {
          this.sourceData = response?.data?.data?.map((d:any) => {
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



  onGridPageChanges(event:any){
    this.gridConfig.pageSize= event.pageSize;
    this.gridConfig.pageIndex= event.pageIndex;
    this.getRequestList();

  }

  onSortOrderChange(event:any){
    this.gridConfig.sortData = event;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }

  
onMenuFilterChanges(event:any): any {
    this.gridConfig.filterValue = event?.filterPayload;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
}






getStatusText(status) {
  return this._StatusText.getStatusText(status);
}



 

 afterCustomizeTableFn(event:any){
  let savedGridConFig =  this.tblService.getCustomizedTableColumns(this.gridConfig);
  if(savedGridConFig){
   this.gridConfig = savedGridConFig;
   this.genericTable.applyGridConfig(this.gridConfig);
   this.getRequestList();
  }
 }


 onApplyAdvanceSearch(event:advanceSearchResult){
  this.getRequestList(this.gridConfig.sortData, event.filterPayload);
 }

 onApplyGlobalSearch(event:advanceSearchResult){
  this.getRequestList(this.gridConfig.sortData, event.filterPayload);
 }


  viewClick(element) {
      if(element.terminalStatus === this.reqStatus.Draft ||
        element.customsStatus === this.reqStatus.Draft){
        this.router.navigate(["/booking/detail/", element.id]);
      }else{
        this.router.navigate(["/booking/detail/view/", element.id]);
      }  
  }

    editClick(element) {
        if (element.status === "Approved") {
          // Open the confirmation dialog
          const confirmation = this._fuseConfirmationService.open({
            title: "Modify Confirmation",
            message:
              "Voyage is already approved. Any changes will send a modified request for approval. Are you sure you want to continue?",
            actions: {
              confirm: {
                label: "Confirm",
              },
              cancel: {
                show: false,
              },
              back: {
                show: true,
                label: "Back",
              },
            },
            icon: {
              show: false,
            },
            dismissible: false,
          });
          // Subscribe to the confirmation dialog closed action
          confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
              this.router.navigate(["/booking/detail/", element.id]);
            }
          });
        } else {
          this.router.navigate(["/booking/detail/", element.id]);
        }
    }

    isDisableActions(element: any, actionType: any) {
          if (actionType === "modify") {
            if (
              element.terminalStatus === this.reqStatus.Pending ||
              element.customsStatus === this.reqStatus.Pending
            )
              return true;
            else false;
          }
          if (actionType === "delete") {
            if (element.terminalStatus === this.reqStatus.Draft) return true;
            else return false;
          }
    }


    
switchView(event){
  this.tblView = !this.tblView;
}

onExportData(event){
   alert("Export Data");
}
}


