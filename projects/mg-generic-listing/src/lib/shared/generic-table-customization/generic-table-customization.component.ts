import { ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { GenericListingTableService } from '../../services/generic-listing-table.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import _ from 'lodash';
import type { MgGenericListingTableComponent } from '../mg-generic-listing-table/mg-generic-listing-table.component';

@Component({
  selector: 'app-generic-table-customization',
  templateUrl: './generic-table-customization.component.html',
  styleUrls: ['./generic-table-customization.component.scss'],
  providers: [GenericListingTableService],
  //standalone: true,
  //imports: [MgGenericListingModule],
})
export class GenericTableCustomizationComponent implements OnInit {
  @ViewChild('genericCustomTable') genericCustomTable: MgGenericListingTableComponent;
  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  @Input() gridConfig: any = null;
  @Input() selectedLang: string = 'en-US';
  @Input() dataList: any[] = [];
  @Output() afterCustomizeTable: EventEmitter<any> = new EventEmitter<any>();

  selectedColumns: any = [];
  displayColumns: any = [];
  tableColumns: any[] = [];
  itemPerPage: any = null;
  rowTemplate: any = null;
  headerTemplate: any = null;
  columnDefinition: any[] = [];
  itemperpageList: any[] = [5, 10, 20];
  pageSize: number = 5;
  tableInstance: any;
  childViewRef: any;
  genericTable: any;
  initialGridConfig: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, public tableService: GenericListingTableService, @Inject(MAT_DIALOG_DATA) public dialogData: any, public matDialogRef: MatDialogRef<GenericTableCustomizationComponent>,
    private cdr: ChangeDetectorRef
  ) {
    this.initialGridConfig = JSON.stringify(this.dialogData.gridConfig);
    this.gridConfig = JSON.parse(this.initialGridConfig);
    this.gridConfig.customizationGrid = true;
    this.rowTemplate = this.dialogData.rowTemplate;
    this.headerTemplate = this.dialogData.headerTemplate;
    this.columnDefinition = _.filter(this.gridConfig.columnDefinition, (col) => {
      if ((col.isDefault || col.isCustomizable) && col.header != '' && col.show && col.columnDef != 'action' && col.columnDef != 'select' && col.columnType != 'action' && col.columnType != 'select')
        return col;
    });
    this.gridConfig.tableColumns = _.filter(this.gridConfig.tableColumns, (col) => {
      if (col.columnType != 'action' && col.columnType != 'select' && col.columnDef != 'action' && col.columnDef != 'select')
        return col;
    });
    this.selectedColumns = this.gridConfig.tableColumns;
    this.itemperpageList = this.gridConfig.itemperpageList;
    this.gridConfig.showPagination = true;
    this.tableInstance = this.dialogData.tableInstance;
    this.genericTable = this.dialogData.genericTable;
    this.genericTable.showPagination = true;
    this.pageSize = this.gridConfig.pageSize;



  }

  ngOnInit(): void {

  }


  initFn() {
    this.tableService.customizedTableConfig$.subscribe(() => {
      let savedGridConFig = this.tableService.getSavedTableConfig(this.gridConfig);
      if (savedGridConFig) {
        this.pageSize = savedGridConFig.pageSize;
        this.gridConfig.pageSize = savedGridConFig.pageSize;
        //this.genericCustomTable.applyGridConfig(this.gridConfig);
        this.genericTable.applyGridConfig(this.gridConfig);
      }
    });

    this.selectedColumns.forEach((col:any, idx:number) => {
      let item = _.filter(this.columnDefinition, { columnDef: col.columnDef });
      if (item.length > 0) {
        item[0].isSelected = col.isSelected;
        item[0].isCustomized = col.isCustomized;
      }
    });


    // this.genericTable.applyGridConfig(this.gridConfig);
  }

  ngAfterViewInit() {
    this.childViewRef = this.tableInstance.createEmbeddedView(null);
    this.reloadChildView();
    this.pageSize = this.gridConfig.pageSize;
    this.cdr.detectChanges();

  }

  insertChildView() {
    this.vc.insert(this.childViewRef);
  }

  removeChildView() {
    this.vc.detach();
  }

  reloadChildView() {
    this.removeChildView();
    setTimeout(() => {
      this.insertChildView();
      this.initFn();
    }, 1000);
  }



  addOrRemoveColumn(col: any): void {

    if (
      !col.isDefault &&
      _.filter(this.selectedColumns, { columnDef: col.columnDef }).length == 0
    ) {
      col.isSelected = true;
      col.isCustomized = true;
      this.selectedColumns.push(col);
      this.displayColumns = _.map(this.selectedColumns, "columnDef");
    } else {
      col.isSelected = false;
      col.isCustomized = false;
      _.remove(this.selectedColumns, { columnDef: col.columnDef });
      this.displayColumns = _.map(this.selectedColumns, "columnDef");
    }

    this.gridConfig.tableColumns = this.selectedColumns;
    this.genericTable.applyGridConfig(this.gridConfig);

  }

  onGridPageChanges(event: any) {

  }


  onHeaderDropped(event: any) {
    this.selectedColumns = event.tableColumns;
    this.displayColumns = _.map(event.tableColumns, 'columnDef');
  }

  Close(): void {
    this.dialogData.gridConfig.customizationGrid = false;
    this.gridConfig = JSON.parse(this.initialGridConfig);
    this.gridConfig.customizationGrid = false;
    this.genericTable.gridConfig =this.gridConfig;
    this.genericTable.applyGridConfig();
    this.cdr.detectChanges();
    this.matDialogRef.close();
  }

  customizeItemPerpage(pageSize:any) {
    this.pageSize = pageSize;
    this.gridConfig.pageSize = this.pageSize;
    let config = this.genericTable.gridConfig;
    config.tableColumns = this.gridConfig.tableColumns;
    config.pageSize = this.gridConfig.pageSize;
    this.genericTable.onGridDataChange.emit(config);
}

  submitCustomization(): void {
    this.selectedColumns = JSON.stringify(this.genericTable.tableColumns);
    this.displayColumns = JSON.stringify(this.genericTable.displayedColumns);
    this.gridConfig.customizationGrid = false;
    this.dialogData.gridConfig.customizationGrid = false;

    let customData = {
      gridId: this.gridConfig.gridId,
      tableColumns: JSON.parse(this.selectedColumns),
      displayColumns: JSON.parse(this.displayColumns),
      pageSize: this.pageSize,
      gridConfig: this.initialGridConfig
    }

    // resetting to default col definition
    _.forEach(customData.tableColumns, (col)=>{
      col.filerEnabled = false;
    })

    this.tableService.setCustomizedTableConfig(customData);
    this.afterCustomizeTable.emit(customData);
    this.matDialogRef.close();
  }
}
