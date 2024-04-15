import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { gridConfigObj } from '@pcs/generic-listing';
import _ from 'lodash';

@Component({
  selector: 'app-demo-listing-helper-buttons',
  templateUrl: './demo-listing-helper-buttons.component.html',
  styleUrls: ['./demo-listing-helper-buttons.component.scss']
})
export class DemoListingHelperButtonsComponent implements OnInit {

  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSwitchView: EventEmitter<any> = new EventEmitter<any>();
  @Output() onExportData: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCustomizeTable: EventEmitter<any> = new EventEmitter<any>();

  @Input() gridConfig: gridConfigObj;
  tableColumns = null;
  displayedColumns: any[] 
  tblView = true;
  constructor() { }

  ngOnInit(): void {
    this.tableColumns = this.gridConfig.tableColumns;
    this.displayedColumns = this.gridConfig.tableColumns;
  }
 
  sortDataSource(col: any, start: any) {
    if(col == 'updatedDate'){
      let sortData: any = { ColumnName: 'updatedDate', Order: -1 };
      sortData.Payload =  { "updatedDate.0": -1 };
      this.onSort.emit(sortData);     
    }
    else{
      let sortData: any = { ColumnName: col.columnDef, Order: start };
      sortData.Order == "1" ? (col.sort = "asc") : (col.sort = "desc");
      let dbField = col.dbField;
      sortData.Payload = { [dbField]: sortData.Order }
      this.onSort.emit(sortData);
    } 
  }

  openCustomizedWindow(): void{
    this.onCustomizeTable.emit();
  }


  switchView(){
    this.tblView = !this.tblView;
    this.onSwitchView.emit(this.tblView);
  }

  exportData(){
    this.onExportData.emit('export');
  }

}
