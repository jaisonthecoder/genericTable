import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ComponentPortal } from "@angular/cdk/portal";
import { Component, ViewChild, Input, TemplateRef, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, Injector } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { GENERIC_INLINE_FILTER_DATA, GENERIC_INLINE_FILTER_SHARED_DATA } from "../../model/generic-inline-filter-data.model";
import { GENERIC_TABLE_TOKEN_DATA } from "../../model/generic-table.token.injector";
import { IGenericInlineFilterLookupService, IGenericTransService } from "../../model/i-generic-inline-filter-lookup.interface";
import { IGenericInlineFiltersPortalInstance } from "../../model/i-generic-inline-filters-portal-instances";
import { GenericListingTableService } from "../../services/generic-listing-table.service";
import { GenericTableCustomizationComponent } from "../generic-table-customization/generic-table-customization.component";
import { InlineFilterComponent } from "../inline-filter/inline-filter.component";
import { gridConfigObj } from "../../model/default-table.model";
import { TranslationService } from "../../services/translation.service";
import { MatMenuTrigger } from "@angular/material/menu";
import { HelperService } from "../../services/helper.service";
import { Directionality } from "@angular/cdk/bidi";

@Component({
  selector: 'mg-generic-listing-table',
  templateUrl: './mg-generic-listing-table.component.html',
  styleUrls: ['./mg-generic-listing-table.component.scss'],
  providers: [GenericListingTableService],

})
export class MgGenericListingTableComponent {
  @ViewChild("paginator") paginator!: MatPaginator;
  // @ViewChild("genericInlineFilter") inlineFilter!: InlineFilterComponent;
  @ViewChild("table") table: MatTable<any>;
  @ViewChild('tableInstanceRef', { read: TemplateRef }) tableInstanceRef: TemplateRef<any>;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  @Input() gridConfig: gridConfigObj;
  @Input() rowTemplate: TemplateRef<any>;
  @Input() headerTemplate: TemplateRef<any>;
  @Input() cardItemTemplate: TemplateRef<any>;
  @Input() filterMenuTemplate: TemplateRef<any>;
  @Input() selectedLang = "en-US";
  @Input() dataList: any = [];
  @Input() multiSelect: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showAdvanceSearch = false;
  @Input() cardItemPerPage = 4;
  @Input() hideAdvanceSearch = false;

  loadedFlag = true;

  // INLINE FILTER SERVICE
  inlineFilterService: IGenericInlineFilterLookupService;
  filterSub: Subscription;
  filterSortSub: Subscription;

  SHARED_INLINE_FILTER_DATA = null;

  @Input() set inlineFilterServiceSource(
    value: IGenericInlineFilterLookupService | any[]
  ) {
    if (this.isInlineFilterService(value)) {
      this.inlineFilterService = value as IGenericInlineFilterLookupService;
    }
  }

  // TRANSLATION SERVICE
  _transLocoService: IGenericTransService;
  @Input() set translationService(
    value: IGenericTransService | any[]
  ) {
    if (this.isTransSeriveValid(value)) {
      this._transLocoService = value as IGenericTransService;
    }
  }


  @Input() showGlobalSearch = false;


  @Output() onGridDataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFilterDataChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUnSelectItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPageChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() onMenuFilterChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInitInlineFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() onHeaderDragStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() onHeaderDropped: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterCustomizeTable: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAdvanceSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() onGlobalSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetAllFilter: EventEmitter<any> = new EventEmitter<any>();




  tableColumns: any = [];
  itemperpageList: any = ["5", "10", "20"];
  dataSource: any = new MatTableDataSource<any>(this.dataList);
  pageSize: any = "50";
  displayedColumns: string[] = _.map(this.tableColumns, "columnDef");
  pageIndex = 1;
  totalCount: any;
  tableMetaObject: any;
  showFilter: boolean = false;
  columnFilter: any = {
    sourceFilterDataList: {},
    filterDataList: [],
    selectedFilterItems: [],
    selectedFilterValues: [],
    tempSelectedItems: [],
    filrerDisplayValues: [],
    lastfiltereditem: null,
    filterPayload: null,
  };

  showCustomizeTable: boolean = false;

  lastfilteredColumn: any = null;
  globalSearchPayload: any = null;
  subscriptions: Subscription[] = [];
  slectedItem: any = null;
  id: string;
  activeFilterColumn: any = null;
  stickyList: any = [];
  dragEnabled: boolean = false;
  subs: Subscription[] = [];

  public selection = new SelectionModel<any>(this.multiSelect, []);

  genericInlineFilterComponents: IGenericInlineFiltersPortalInstance[] = [];
  selectedFilter: ComponentPortal<InlineFilterComponent>;

  constructor(
    private cdr: ChangeDetectorRef,
    public router: Router,
    public tblService: GenericListingTableService,
    private dialog: MatDialog,
    private injector: Injector,
    private transServie: TranslationService,
    private helperService: HelperService,
    private dir: Directionality,
    private matPaginatorIntl:MatPaginatorIntl


  ) {
    // let _DIR :any = this.dir;
    // _DIR.value = 'rtl'

    this.SHARED_INLINE_FILTER_DATA = JSON.parse(JSON.stringify(GENERIC_INLINE_FILTER_SHARED_DATA));
  }

  ngOnInit(): void {
    // this.subs.push(this.tblService.showCustomizeTable$.subscribe((gridConfig: any)=>{
    //   if(gridConfig.gridId == this.gridConfig.gridId){
    //       this.showCustomizeTable = !this.showCustomizeTable;
    //       if(this.showCustomizeTable){
    //          this.customizeTable();
    //       }
    //     }
    // }));   
    this.setPaginationLabelTranslation();

  }

  ngAfterViewInit() {
    this.applyGridConfig();
    this.updateGrid(this.dataList);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyGridConfig();
    this.dataSource.data = this.dataList.slice(0, this.pageSize);
  }

  ngOnDestroy(): void {
    this.SHARED_INLINE_FILTER_DATA = JSON.parse(JSON.stringify(GENERIC_INLINE_FILTER_SHARED_DATA));

    this.helperService.clearAllInlineFilter(true);
    this.clearAllFilter();

    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.cdr.detach();
  }

  private isInlineFilterService(
    object: any
  ): object is IGenericInlineFilterLookupService {
    return object && "fetch" && "extractFilterValue" && "onFilterSearchFn" in object;
  }

  private isTransSeriveValid(
    object: any
  ): object is IGenericTransService {
    return object && "translate" in object;
  }



  public updateGrid(list: any, autoSelect = true) {
    this.dataList = list;
    this.totalCount = this.dataList.length;
    this.dataSource.data = this.dataList.slice(0, this.pageSize);
    this.cdr.detectChanges();
    if (autoSelect == true) {
      setTimeout(() => {
        _.forEach(this.dataSource.data, (row) => {
          if (row.select) {
            this.selection.select(row);
          } else if (row.select == false) {
            this.selection.deselect(row);
          }
        });
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  public onPageEventChange(e: any) {
    this.pageSize = JSON.stringify(e.pageSize);
    this.pageIndex = Number(e.pageIndex) + 1;
    let pagintion = { pageSize: this.pageSize, pageIndex: this.pageIndex };
    this.onPageChanges.emit(pagintion);
  }

  public updateDisplayedColumns() {
    this.displayedColumns = _.map(
      _.filter(this.tableColumns, { show: true }),
      "columnDef"
    );
  }


  public detectLanguageChanges(lang: string, translations: any = null) {
    this.transServie.setLanguage(lang);
    this.selectedLang = lang;
    if (translations) {
      this.loadedFlag = false;
      this.transServie.handleTranslation(translations, lang);
      setTimeout(() => { this.loadedFlag = true; }, 1000);

      this.setPaginationLabelTranslation();

    }
    this.cdr.detectChanges();
  }


  public clearAllFilter() {
    this.gridConfig.filterData = {};
    this.gridConfig.filterValue = {};
    this.gridConfig.inlineFilterData = {};
    this.tableColumns.forEach((item: any) => {
      item.filerEnabled = false;
    });
    this.cdr.detectChanges();
    this.resetAllFilter.emit(this.gridConfig);

    //this.tblService.clearAllFilter(this.gridConfig);
  }


  public clearAllInlineFilter() {
    this.helperService.clearAllInlineFilter(true);
  }

  public applyGridConfig(gridConfig = this.gridConfig) {
    if (gridConfig) {
      this.tableMetaObject = this.gridConfig?.manifestMetaObject;
      this.tableColumns = gridConfig.tableColumns;
      this.itemperpageList = gridConfig.itemperpageList;
      this.dataList = gridConfig.dataList;
      this.dataSource = new MatTableDataSource<any>(this.dataList);
      this.pageSize = this.gridConfig.pageSize;
      this.displayedColumns = _.map(
        _.filter(this.tableColumns, { show: true }),
        "columnDef"
      );
      this.totalCount = gridConfig.totalCount;
      this.pageIndex = gridConfig.pageIndex;
      this.dragEnabled = false; //this.gridConfig.dragEnabled

      if( this.gridConfig.customizationGrid){
        this.gridConfig.tableColumns = gridConfig.tableColumns;
      }
      this.gridConfig.customizationGrid = gridConfig.customizationGrid;
      

      setTimeout(() => {
        this.stickyList = _.filter(this.tableColumns, { sticky: true });
        this.stickyList.forEach((item: any, index: number) => {
          let nextindex = index + 1;
          if (this.stickyList.length > nextindex && item.width) {
            this.stickyList[nextindex].left = item.width + item.left;
          }
        });
      }, 2000);

      if (this.showPagination == false) {
        this.pageSize = this.dataList.length;
        this.totalCount = this.dataList.length;
      }
    }
  }

  public sortDataSource_(id: string, start: any, col: any) {
    let sortData: any = { ColumnName: id, Order: start };
    sortData.Order == "1" ? (col.sort = "asc") : (col.sort = "desc");
    let dbField = col.dbField;
    if (col.isMasterData && col.dbLabelField && col.appendDbLabelFieldLang) {
      dbField = col.dbLabelField + '.' + this.selectedLang;
    }
    else if (col.isMasterData && col.dbLabelField) {
      dbField = col.dbLabelField;
    }
    sortData.Payload = { [dbField]: sortData.Order }
    this.onSort.emit(sortData);
  }

  getImgPath(imgName: string) {
    return "../../assets/img/" + imgName;
  }

  public globalSearch(e: any) {
    let searchKey = e.target.value.toLowerCase().trim();
    let payload: any = {
      active: true,
      $or: [],
    };

    // binding metaobject to the api payload
    for (var k in this.tableMetaObject) {
      payload[k] = this.tableMetaObject[k];
    }

    this.tableColumns.forEach((item: any) => {
      payload.$or.push({
        [item.dbField]: { $regex: searchKey, $options: "i" },
      });
    });

    this.globalSearchPayload = payload;
  }

  public viewClick(element: any) {
    if (this.gridConfig?.customizationGrid != true) {
      this.onDoubleClick.emit(element);
    }
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onSelectAll.emit({
        gridid: this.gridConfig.gridId,
        selectAll: false,
        selectedList: this.selection.selected,
      });
    } else {
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
      this.onSelectAll.emit({
        gridid: this.gridConfig.gridId,
        selectAll: true,
        selectedList: this.selection.selected,
      });
    }
  }

  public selectHandler(event: any, row: any) {
    this.selection.toggle(row);
    row.select = event.checked;
    if (event.checked == true) {
      this.onSelectItem.emit({
        gridid: this.gridConfig.gridId,
        selectedItem: row,
        selectedList: this.selection.selected,
      });
    } else {
      this.onUnSelectItem.emit({
        gridid: this.gridConfig.gridId,
        selectedItem: row,
        selectedList: this.selection.selected,
      });
    }
  }

  public unSelectitem(item: any) {
    this.slectedItem = item.selectedItem ? item?.selectedItem : item;
    this.slectedItem.select = false;
    this.selection.deselect(this.slectedItem);
    this.cdr.detectChanges();
  }

  public isSticky(column: any): boolean {
    return column.sticky ? true : false;
  }

  // INLINE FILTER _______________________________
  public initFilter(column: any) {
    const filterInstance = this.genericInlineFilterComponents.filter(
      (c) => c.filterName == column.columnDef
    );
    if (filterInstance && filterInstance[0]) {
      this.selectedFilter = filterInstance[0].filterInstance;
      return;
    }
    this.activeFilterColumn = column;
    this.showFilter = true;
    const filterSourceData = {};
    const _inlineFilterItem = this.attachFilterPortal(column, filterSourceData);
    this.genericInlineFilterComponents.push({
      filterName: column.columnDef,
      filterInstance: _inlineFilterItem,
    });
    this.selectedFilter = _inlineFilterItem;

  }

  attachFilterPortal(column: any, filterSourceData: any) {
    const componentPortal = new ComponentPortal(
      InlineFilterComponent,
      null,
      this.createInjector({
        filterData: {
          column,
          filterSourceData,
          inlineFilterService: this.inlineFilterService,
          translationService: this._transLocoService,
          columnFilter: _.cloneDeep(GENERIC_INLINE_FILTER_DATA),
          commonFilterData: this.SHARED_INLINE_FILTER_DATA,

        },
        gridConfig: this.gridConfig
      })
    );
    return componentPortal;
  }





  getInlineFilterReference(selectedFilterInstance: any) {
    const _inlineFilterRef: InlineFilterComponent =
      selectedFilterInstance.instance;
    this.subs.push(
      _inlineFilterRef.onMenuFilterChanges.subscribe((data) => {
        _.forEach(this.tableColumns, (col) => {
          if (col.columnDef == data.filteredColumn.columnDef) {
            col.filerEnabled = data.filteredColumn.filerEnabled;
          }
        })
        this.onMenuFilterChanges.emit(data.filterData);
        if (this.menuTrigger && this.menuTrigger.closeMenu) {
          this.menuTrigger.closeMenu();
        }
      }));
    this.subs.push(
      _inlineFilterRef.onSort.subscribe((data) => {
        this.sortDataSource_(data.ColumnName, data.Order, data.Col);
      }));
  }

  private createInjector(data: any): Injector {
    return Injector.create({
      providers: [{ provide: GENERIC_TABLE_TOKEN_DATA, useValue: data }],
    });
  }
  updateFilterData(column: any, gridConfig: any) {
    this.activeFilterColumn = column;
    this.gridConfig.filterData = gridConfig.filterData;
  }
  //__________________________________________________

  // CUSTOMIZE TABLE _______________________________
  customTableRefSub: Subscription;
  public customizeTable() {
    if (this.customTableRefSub) {
      this.customTableRefSub.unsubscribe();
    }
    const dialogConfig = new MatDialogConfig();
    //  dialogConfig.disableClose = false;
    dialogConfig.height = '100%',
      dialogConfig.width = '100%',
      dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "100vw";
    dialogConfig.panelClass = "mg-generic-table-dialog-window";
    dialogConfig.data = {
      gridConfig: this.gridConfig,
      rowTemplate: this.rowTemplate,
      headerTemplate: this.headerTemplate,
      tableInstance: this.tableInstanceRef,
      genericTable: this,
      //onHeaderDrop: this.onHeaderDropped
    };


    let customTableRef: any = this.dialog.open(
      GenericTableCustomizationComponent,
      dialogConfig
    );

    this.customTableRefSub = customTableRef.componentInstance.afterCustomizeTable.subscribe(
      (config: any) => {
        console.log(config);
        this.afterCustomizeTable.emit(config);
        this.customTableRefSub.unsubscribe();
      }
    )

  }

  //__________________________________________________


  tblView = true;
  public switchView() {
    if (this.gridConfig.enableCardView) {
      this.tblView = !this.tblView;
      if(this.tblView){
        localStorage.setItem(this.gridConfig.gridId + '_activeView', 'tableView');
      }
      else{
        localStorage.setItem(this.gridConfig.gridId + '_activeView', 'cardView');
      }
    }
  }


  drop(event: CdkDragDrop<any[]>) {
    const previousIndex = this.dataSource.data.findIndex(
      (row: any) => row === event.item.data
    );
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );


    moveItemInArray(this.tableColumns, event.previousIndex, event.currentIndex);

    this.table.renderRows();
    this.onHeaderDropped.emit({
      event: event,
      displayedColumns: this.displayedColumns,
      tableColumns: this.tableColumns,
    });
    this.cdr.detectChanges();
  }

  dragStarted(event: any, i: number, column: any) {
    this.onHeaderDropped.emit({ event: event, index: i, column: column });
  }

  afterCustomizeTableFn(event: any) {
    this.afterCustomizeTable.emit(event);
  }

  onApplyAdvanceSearch(event: any) {
    this.onAdvanceSearch.emit(event)
  }

  onApplyGlobalSearch(event: any) {
    this.onGlobalSearch.emit(event);
  }


  translate(value: any, args?: any) {
    return this._transLocoService.translate(value)
  }

  setPaginationLabelTranslation(){
    if (this.paginator) {
      const paginatorIntl = this.paginator._intl;
      if (paginatorIntl) {
        paginatorIntl.nextPageLabel = this.transServie.translate('Next page', this.selectedLang);
        paginatorIntl.previousPageLabel = this.transServie.translate('Previous page', this.selectedLang);
        paginatorIntl.itemsPerPageLabel = this.transServie.translate('Items per page', this.selectedLang);
        paginatorIntl.lastPageLabel = this.transServie.translate('Last page', this.selectedLang);

        const getRangeLabel: (page: number, pageSize: number, length: number) => string = (
          page: number,
          pageSize: number,
          length: number
        ): string => {
          return new MatPaginatorIntl().getRangeLabel(page, pageSize, length).replace('of', this.transServie.translate('of', this.selectedLang));
        };
        paginatorIntl.getRangeLabel = getRangeLabel; 
        this.matPaginatorIntl.getRangeLabel = getRangeLabel;      
        this.matPaginatorIntl.changes.next();       
        }
    }
  }

}
