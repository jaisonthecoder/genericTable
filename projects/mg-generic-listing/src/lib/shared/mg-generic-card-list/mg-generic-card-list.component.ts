import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { gridConfigObj } from '../../model/default-table.model';

@Component({
  selector: 'mg-generic-card-list',
  templateUrl: './mg-generic-card-list.component.html',
  styleUrls: ['./mg-generic-card-list.component.css']
})
export class MgGenericCardListComponent implements OnInit, AfterViewInit {

 
  @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEditClick: EventEmitter<any> = new EventEmitter<any>();


  @Input() cardItemPerPage: any;
  @Input() gridConfig: gridConfigObj;
  @Input() sourceData: any;
  @Input() cardItemTemplate: TemplateRef<any>;


  gridClasses = "grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-cols-4 gap-6 cardview-scroll-wrapper";



  constructor( ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    if(this.cardItemPerPage){
    this.gridClasses = this.getCardGridClass();
    }
  }
  

  viewDetails(request:any){
    this.onDoubleClick.emit(request);
  }


  getCardGridClass(){
    let classstring = "grid sm:grid-cols-1 gap-6 cardview-scroll-wrapper";
    let subString =  " md:grid-cols-" +this.cardItemPerPage +   " lg:grid-cols-" + this.cardItemPerPage  + " grid-cols-"+ this.cardItemPerPage;

    return classstring + subString;
  }

  
  public onPageEventChange(e: any) {
    let pageSize = JSON.stringify(e.pageSize);
    let pageIndex = Number(e.pageIndex) + 1;
    let pagintion = { pageSize: pageSize, pageIndex: pageIndex };
    this.onPageChange.emit(pagintion);
  }

}
