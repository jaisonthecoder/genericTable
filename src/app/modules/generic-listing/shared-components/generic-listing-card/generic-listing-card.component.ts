import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { gridConfigObj } from '@pcs/generic-listing';
import { StatusText } from '../../helper/status-mapper';
import { RequestStatus } from '../../helper/RequestStatus';

@Component({
  selector: 'app-generic-listing-card',
  templateUrl: './generic-listing-card.component.html',
  styleUrls: ['./generic-listing-card.component.scss']
})
export class GenericListingCardComponent implements OnInit {

  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditClick: EventEmitter<any> = new EventEmitter<any>();


  
  @Input() gridConfig: gridConfigObj;
  @Input() sourceData: any;
  reqStatus = RequestStatus;



  constructor(private statusText:StatusText ) { }

  ngOnInit(): void {
  }

  viewDetails(request){
    this.onDoubleClick.emit(request);
  }


  isATAETA(voyage: any) {
    if (voyage.ata !== null && voyage.ata !== "") return true;
    if (voyage.ata == null || voyage.ata === "") return false;
  }

  

  getStatusText(statusCode: any) {
    return this.statusText.getStatusDescription(statusCode);
  }

  getTextColor(statusCode) {
    return this.statusText.getStatusTextColor(statusCode);
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


  editClick(element) {
   this.onEditClick.emit(element);
  }
  
  public onPageEventChange(e: any) {
    let pageSize = JSON.stringify(e.pageSize);
    let pageIndex = Number(e.pageIndex) + 1;
    let pagintion = { pageSize: pageSize, pageIndex: pageIndex };
    this.onPageChange.emit(pagintion);
  }

}
