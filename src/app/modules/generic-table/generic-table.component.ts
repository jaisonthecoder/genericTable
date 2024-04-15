import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GenericListingTableService, InlineFilterComponent, MgGenericListingTableComponent, advanceSearchResult, gridConfigObj, manifestMetaObject } from '@pcs/generic-listing';
import _ from 'lodash';
import { Subscription } from 'rxjs';

import { InlineFilterService } from './services/inline-filter.service';
import { RequestService } from './services/request.service';
import { ResponseMaperService } from './helper/response-maper.service';
import { TableColumns } from './models/generic-table.model';
import { StatusText } from './helper/status-mapper';
import { TranslocoService } from '@ngneat/transloco';
// import { manifestStatus } from '../data/enums/manifestStatus';

import { environment } from 'src/environments/environment';
import { FuseConfirmationService } from 'src/app/core/confirmation/confirmation.service';
import { voyageStatus } from 'src/app/core/models/voyageStatus';
const manifestStatus:any = {}
@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @ViewChild('genericTable') genericTable: MgGenericListingTableComponent;
  @ViewChild('inlineFilter') inlineFilter: InlineFilterComponent;

  manifestStatusCode = manifestStatus;
  voyageStatusCode = voyageStatus;

  showTable = true;
  reqStatus = voyageStatus;
  sourceData: any[] = [];
  dataSource_ : any;
  columnDefinition = TableColumns;
  gridConfig: gridConfigObj = {
    gridId: 'vessel_call_landingGrid',
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
    showPagination: true,
    enableCardView: true,
    mergePayload: true,
    dragEnabled:false
  };
  subscriptions: Subscription[] = [];
  slectedItem = null;
  pagination = {
    pageSize:5,
    pageIndex:1
  }
  filterSourceData = [];
  lang ="en-US";
tblView = true;
  constructor(private cdr: ChangeDetectorRef,
    private tblService: GenericListingTableService,
    private router: Router,
    private requestService: RequestService,
    private responseMaper: ResponseMaperService,
    public inlineFilterService: InlineFilterService,
    private _StatusText: StatusText,
    private _fuseConfirmationService: FuseConfirmationService,
    private _transLocoService: TranslocoService,
   // private _snackBarService: SnackBarService,
   // private _dateTimeCalculator: DateTimeCalculator,

    
      ) { }


  ngOnInit(): void {
    this._transLocoService.langChanges$.subscribe((lang)=>{
      this.lang =lang;
      if(this.genericTable){
        let translations  = this._transLocoService.getTranslation(this.lang);
       // this.genericTable.detectLanguageChanges(this.lang, translations);
      }
      this.cdr.detectChanges();
    });
    }

  ngAfterViewInit() {
    this.tblService.customizedTableConfig$.subscribe(() => {
      let savedGridConFig = this.tblService.getCustomizedTableColumns(this.gridConfig);
      if (savedGridConFig) {
        this.gridConfig = savedGridConFig;
        this.genericTable.applyGridConfig(this.gridConfig);
        this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
      }
      else {
        this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
      }
    });

    if(this.genericTable){
      let translations  = this._transLocoService.getTranslation(this.lang);
      this.genericTable.detectLanguageChanges(this.lang, translations);
      }
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
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }

  customizTable(event:any) {
    this.genericTable.customizeTable();
    // this.tblService.toggleCustomizeTable(this.gridConfig);
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


  getRequestList(sortData?: any, filterValue?: {}) {
    let payload: any = { active: true };
    if (filterValue && !_.isEmpty(filterValue) ) {
      payload = filterValue;
    }
    else if(this.gridConfig.filterValue && !_.isEmpty(this.gridConfig.filterValue) ){
      payload = this.gridConfig.filterValue;
    }

   
    let payloadPagination = {
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


    this.requestService
      .getRequestLists(payload, payloadPagination, sortOrder)
      .pipe()
      .subscribe({
        next: (response) => {
          this.sourceData = response?.data?.data?.map((d: any) => {
            return <any>this.responseMaper.RequestListMapper(d);
          });

          this.sourceData.forEach((element) => {
            element.expanded = false;
    
            //   element.percentage = this._dateTimeCalculator.getVesselProgressBar(
            //   new Date(element.dateFromLastPort),
            //   new Date(new Date(element.dateETA))
            // );
            element.vesselPosition = this.setVesselPosition(element.percentage);
            element.percentagePosition = this.setPercentagePosition(element.percentage);
    
            //  element.percentage = this.getDaysBetweenDates(new Date(element.dateFromLastPort),new Date(new Date(element.dateETA)));
            element.vesselImage = environment.appUrl + "assets/img/vessel.svg";
            element.vesselArrivalImg = environment.appUrl + "assets/img/vesselarrival.svg";
            this.getVesselPortImages(element);
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
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);

  }

  onSortOrderChange(event: any) {
    this.gridConfig.sortData = event;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }


  onMenuFilterChanges(event: any): any {
    this.gridConfig.pageIndex = 1;
    this.gridConfig.filterValue = event?.filterPayload;
    this.getRequestList(this.gridConfig.sortData, this.gridConfig.filterValue);
  }


  isATAETA(voyage: any) {
    return voyage.ata && voyage.ata !== "N/A" ? true : false;

  }

  setVesselPosition(value: any) {
    if (value >= 80) return 55;
    else if (value >= 70 && value < 80) return 50;
    else if (value >= 50 && value <= 69) return 40;
    else if (value === 0) return 0;
    else if (value <= 22) return 24;
    else return value;
  }
  setPercentagePosition(value: any) {
    if (value >= 80) return 55;
    else if (value >= 70 && value < 80) return 50;
    else if (value >= 50 && value <= 69) return 40;
    else if (value === 0) return 0;
    else if (value <= 22) return 24;
    else return value;
  }

  getNumberOfDelayedDays(ata, eta) {
    if (ata !== '' && ata !== null) {
      // compare eta ata dates in     
      if (eta.getTime() === ata.getTime()) {
      } else if (ata.getTime() > eta.getTime()) {
      } else if (ata.getTime() < eta.getTime()) {
      }
    }
  }




  
 
  getStatusText(status) {
    return this._transLocoService.translate(this._StatusText.getStatusText(status), null, this.lang);
  }

  getProgressBarColor(status) {
   // return this._dateTimeCalculator.getProgressBarColor(status);
  }
  // getTextColor(statusCode) {
  //   return this._StatusText.getStatusTextColor(statusCode);
  // }


  afterCustomizeTableFn(event: any) {
    let savedGridConFig = this.tblService.getCustomizedTableColumns(this.gridConfig);
    if (savedGridConFig) {
      this.gridConfig = savedGridConFig;
      this.genericTable.applyGridConfig(this.gridConfig);
      //this.getRequestList();
    }
  }


  onApplyAdvanceSearch(event: advanceSearchResult) {
    this.gridConfig.pageIndex = 1;
    this.getRequestList(this.gridConfig.sortData, event.filterPayload);
  }

  onApplyGlobalSearch(event: advanceSearchResult) {
    this.gridConfig.pageIndex = 1;
    this.getRequestList(this.gridConfig.sortData, event.filterPayload);
  }


  // viewClick(element) {
  //   if (element.terminalStatus === this.reqStatus.Draft ||
  //     element.customsStatus === this.reqStatus.Draft) {
  //     this.router.navigate(["/booking/detail/", element.id]);
  //   } else {
  //     this.router.navigate(["/booking/detail/view/", element.id]);
  //   }

  // }





 

  isDisableActions(element: any, actionType: any) {
    if (actionType === "modify") {
      if (element.status === this.reqStatus.Pending){return true}
      else {return false};
    }
    if (actionType === "delete") {
      if (element.status === this.reqStatus.Draft){ return false}
      else {return true}
    }
    else null
  }



 
  switchView(event:any) {
    //this.tblView = !this.tblView;
    this.genericTable.switchView();
    localStorage.setItem(this.gridConfig.gridId + '_activeView', this.genericTable.tblView ? 'tableView':"cardView")

  }

  onExportData(event:any) {
    alert("Export Data");
  }


  // viewClick(element) {
  //   this.router.navigate(
  //     ['/vessel-call/detail/', element.id],
  //     { queryParams: { 'view': true } }
  //   );
  // }


  viewClick(element) {
    if(element.status == this.reqStatus.Draft){
      this.router.navigate(["/vessel-call/detail/", element.id]);
    }else{
      this.router.navigate(
        ['/vessel-call/detail/view', element.id],
         );
    }
   
  }

  // editClick(element) {

  //   if (element.status === 'Approved') {
  //     let msg = this._transLocoService.translate("Modification not allowed as the Vessel Call is already Approved", null, this.lang);
  //     this._snackBarService.openSnackBar(msg, "warning", 3000, "top", "right");
  //   }

 
  //   if (element.status !=== 'Approved') {      
  //     const confirmation = this._fuseConfirmationService.open({
  //       title: this._transLocoService.translate("Modify Confirmation", null, this.lang),
  //       message: this._transLocoService.translate("Vessel call is already approved",  null, this.lang) + ". " + this._transLocoService.translate("Any changes will send a modified request for approval",  null, this.lang) + ". " + this._transLocoService.translate("Are you sure you want to continue?",  null, this.lang),
  //       actions: {
  //         confirm: {
  //           label: this._transLocoService.translate("Confirm",null, this.lang),
  //         },
  //         cancel: {
  //           show: false,
  //         },
  //         back: {
  //           show: true,
  //           label:this._transLocoService.translate( "Back",null, this.lang),
  //         },
  //       },
  //       icon: {
  //         show: false,
  //       },
  //       dismissible: false,
  //     });
  //     // Subscribe to the confirmation dialog closed action
  //     confirmation.afterClosed().subscribe((result) => {
  //       // If the confirm button pressed...
  //       if (result === "confirmed") {
  //         this.router.navigate(["/vessel-call/detail/", element.id]);
  //       }
  //     });

  //   }
  //   else {
  //     this.router.navigate(["/vessel-call/detail/", element.id]);
  //   }

  // }


  editClick(element:any) {
    // if (element.status === 'Approved') {
    //   let msg = this._transLocoService.translate("Modification not allowed as the Vessel Call is already Approved", null, this.lang);
    //   //this._snackBarService.openSnackBar(msg, "warning", 3000, "top", "right");
    // }
    // else {
    //   this.router.navigate(["/vessel-call/detail/", element.id]);
    // }
  }

  deleteClick(element:any) {
    // Open the confirmation dialog
    // const confirmation = this._fuseConfirmationService.open({
    //   title: this._transLocoService.translate("Delete Confirmation", null, this.lang),
    //   message:this._transLocoService.translate( "Are you sure you want to delete this request?", null, this.lang),
    //   actions: {
    //     confirm: {
    //       label: this._transLocoService.translate("Confirm", null, this.lang),
    //     },
    //     cancel: {
    //       show: false,
    //     },
    //     back: {
    //       show: true,
    //       label: this._transLocoService.translate("Back", null, this.lang),
    //     },
    //   },
    //   icon: {
    //     show: false,
    //   },
    //   dismissible: false,
    // });
    // // Subscribe to the confirmation dialog closed action
    // confirmation.afterClosed().subscribe((result) => {
    //   // If the confirm button pressed...
    //   if (result === "confirmed") {
    //     const requestID = element.id;
    //     // Delete the Voyage item on the server
    //     this.requestService.deleteById(requestID).subscribe({
    //       next: (response: any) => {
    //         if (response && response?.success) {
    //           this._snackBarService.openSnackBar(
    //             this._transLocoService.translate("Record has been deleted", null, this.lang),
    //             "Delete",
    //             3000,
    //             "top",
    //             "right"
    //           );

    //           this.getRequestList(this.gridConfig.sortData,   this.gridConfig.filterData  ? this.gridConfig.filterData : this.gridConfig.filterValue);
    //         }
    //       },
    //       error: (error: any) => {
    //       },
    //     });
    //   }
    // });
  }


  clearFilter(config:any){
    this.gridConfig = config;
    this.showTable = false;
    this.cdr.detectChanges();
    setTimeout(()=>{
      this.showTable = true;
      this.getRequestList();
      this.cdr.detectChanges();
      if(localStorage.getItem(this.gridConfig.gridId + '_activeView') == 'cardView'){
        this.switchView(null);
      }
    }, 500);
    //this.genericTable.clearAllFilter();
  }

  getTextColor(status:any) {
   // return this._dateTimeCalculator.getTextColor(status);
  }
  
  toggleExpand(expanded:any, i:any) {
    // if(expanded === false){
    this.sourceData.forEach((e, idx) => {
      if (idx === i) {
        e.expanded = true;
      }
      else {
        e.expanded = false;
      }
    });
    this.cdr.detectChanges();
    // }
    // else{
    //   expanded = false;
    // }
    // expanded = !expanded; 
  }



  getVesselPortImages(element: any,  _type?:string) {
    let status = this.setStatusByTerminalAndCustoms(element.terminalStatus, element.customsStatus)
    element.requestStatus = status;
    if (status === voyageStatus.Approved) {
      element.vesselImagePath = environment.appUrl + "assets/img/card-green-vessel.svg";
      element.PortImgPath = environment.appUrl + "assets/img/card-green-port.svg";
    }
    else if (status === voyageStatus.Rejected) {
      element.vesselImagePath = environment.appUrl + "assets/img/card-red-vessel.svg";
      element.PortImgPath = environment.appUrl + "assets/img/card-red-port.svg";
    }
    else if (status === voyageStatus.Pending) {
      element.vesselImagePath = environment.appUrl + "assets/img/card-blue-vessel.svg";
      element.PortImgPath = environment.appUrl + "assets/img/card-blue-port.svg";
    }
    else {
      element.vesselImagePath = environment.appUrl + "assets/img/card-grey-vessel.svg";
      element.PortImgPath = environment.appUrl + "assets/img/card-grey-port.svg";
    }
  }

  setStatusByTerminalAndCustoms(terminalStatus: any, customsStatus: any) {
    if (terminalStatus === voyageStatus.Approved && customsStatus === voyageStatus.Approved)
      return voyageStatus.Approved;
    if (terminalStatus === voyageStatus.Approved && customsStatus === voyageStatus.Rejected)
      return voyageStatus.Rejected;
    if (terminalStatus === voyageStatus.Approved && customsStatus === voyageStatus.Pending)
      return voyageStatus.Pending;
    if (terminalStatus === voyageStatus.Rejected && customsStatus === voyageStatus.Approved)
      return voyageStatus.Rejected;
    if (terminalStatus === voyageStatus.Rejected && customsStatus === voyageStatus.Rejected)
      return voyageStatus.Rejected;
    if (terminalStatus === voyageStatus.Rejected && customsStatus === voyageStatus.Pending)
      return voyageStatus.Rejected;
    if (terminalStatus === voyageStatus.Pending && customsStatus === voyageStatus.Approved)
      return voyageStatus.Pending;
    if (terminalStatus === voyageStatus.Pending && customsStatus === voyageStatus.Rejected)
      return voyageStatus.Rejected;
    if (terminalStatus === voyageStatus.Pending && customsStatus === voyageStatus.Pending)
      return voyageStatus.Pending;
    if (terminalStatus === voyageStatus.Draft && customsStatus === voyageStatus.Draft)
      return voyageStatus.Draft;
  }


  shiftRequestClick(dataitem): void {

  }

  PTWRequestClick(dataitem): void {
    localStorage.setItem("VoyageNo", dataitem.voyageNo);
    this.router.navigate(["/ptw/summary/", dataitem.rotationNumber], { queryParams: { status: dataitem.status } });
  }

  serviceRequestClick(dataitem): void {
    // this._router.navigateByUrl()
    localStorage.setItem("VoyageNo", dataitem.voyageNo);
    this.router.navigate(["/service/summary/", dataitem.rotationNumber], { queryParams: { status: dataitem.status } });
  }

  onHeaderDropped(event: any) {
    this.gridConfig.tableColumns = event.tableColumns;  
  }

}


