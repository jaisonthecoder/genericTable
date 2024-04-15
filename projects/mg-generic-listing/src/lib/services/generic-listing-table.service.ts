import { Injectable } from '@angular/core';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GenericListingTableService {

  private showCustomizeTable = new BehaviorSubject<any>({});
  showCustomizeTable$: Observable<any> = this.showCustomizeTable.asObservable();

  private customizedTableConfig = new BehaviorSubject<any>({});
  customizedTableConfig$: Observable<any> = this.customizedTableConfig.asObservable();

  private selectedItem = new BehaviorSubject<any>({});
  selectedItem$: Observable<any> = this.selectedItem.asObservable();

  public selectedList = [];


  private unSelectItem = new BehaviorSubject<any>({});
  unSelectItem$: Observable<any> = this.unSelectItem.asObservable();


  private paginationData = new BehaviorSubject<any>([]);
  paginationData$: Observable<any> = this.paginationData.asObservable()


  private isAllSelected = new BehaviorSubject<any>([]);
  isAllSelected$: Observable<any> = this.isAllSelected.asObservable()


  private unCheckItem = new BehaviorSubject<any>({});
  unCheckItem$: Observable<any> = this.unCheckItem.asObservable();

  private getData = new BehaviorSubject<any>({});
  getData$: Observable<any> = this.getData.asObservable();

  private advanceSearchPayload = new BehaviorSubject<any>({});
  advanceSearchPayload$: Observable<any> = this.advanceSearchPayload.asObservable();

  private globalSearchPayload = new BehaviorSubject<any>({});
  globalSearchPayload$: Observable<any> = this.globalSearchPayload.asObservable();

  private customizeTable = new BehaviorSubject<any>({});
  customizeTable$: Observable<any> = this.customizeTable.asObservable();


  constructor() { }


  setSelecteditem(item: any) {
    this.selectedList = item.selectedList;
    this.selectedItem.next(item);
  }

  setUnSelectitem(item: any) {
    this.selectedList = item.selectedList;
    this.unSelectItem.next(item);
  }

  setSelectAll(item: any) {
    this.selectedList = item.selectedList;
    this.isAllSelected.next(item);
  }

  setGlobalSearchPayload(data: any) {
    this.globalSearchPayload.next(data);
  }

  setAdvanceSearchPayload(data: any) {
    this.advanceSearchPayload.next(data);
  }

  setCustomizeTable(data: any) {
    this.customizeTable.next(data);
  }

  unCheckItems(item: any) {
    this.unCheckItem = item.unCheckItem;
    this.unCheckItem.next(item);
  }

  refreshGrid(data: any) {
    this.getData.next(data);
  }

  setPaginationData(data: any) {
    this.paginationData.next(data);
  }

  toggleCustomizeTable(gridConfig: any) {
    this.showCustomizeTable.next(gridConfig)
  }

 

  setCustomizedTableConfig(config: any) {
    localStorage.removeItem(config.gridId);
    localStorage.setItem(config.gridId, JSON.stringify(config));
    this.customizedTableConfig.next(config)
  }

  getCustomizedTableColumns(config: any) {
    let item = localStorage.getItem(config.gridId);
    if (item) {
      let parsedItem = JSON.parse(item);
      let selectArr = _.filter(config?.columnDefinition, { columnDef: 'select' });
      let actionArr = _.filter(config.columnDefinition, (item)=>{ return item.columnDef == 'action' || item.columnType == 'action'});
      let savedColumns = parsedItem.tableColumns;
      if (actionArr.length > 0) {
        actionArr.forEach((_actionItem, index)=>{
          savedColumns.push(_actionItem);
        });       
      }

      if (selectArr.length > 0) {
        savedColumns.splice(0, 0, selectArr[0]);
      }

      savedColumns.forEach((col: any) => {
        let orgCol = _.filter(config.tableColumns, { columnDef: col.columnDef });
        if (orgCol?.length > 0) {
          for (let key in col) {
            col[key] = orgCol[0][key];
          }
        }
      })

      config.tableColumns = savedColumns;
      config.pageSize = parsedItem.pageSize ? parsedItem.pageSize : config.pageSize;

      return config;
    }
    else {
      return config;
    }

  }


  getSavedTableConfig(config: any) {
    let item = localStorage.getItem(config.gridId);
    if (item) {
      let parsedItem = JSON.parse(item);
      let savedColumns = parsedItem.tableColumns;
      config.tableColumns = savedColumns;
      config.pageSize = parsedItem.pageSize ? parsedItem.pageSize : config.pageSize;

      return config;
    }
    else {
      return config;
    }

  }


  mergeFilteredValues(_currentFilter: any, _incomingFilter: any) {
    if (_incomingFilter) {
      for (let key in _incomingFilter) {
         if((_currentFilter[key] == '$and' && _incomingFilter[key] == '$and') || (_currentFilter[key] == '$or' && _incomingFilter[key] == '$or')){
          _currentFilter[key] = _.concat((_currentFilter[key],  _incomingFilter[key]));
         }
         else if (!_currentFilter[key]) {
          _currentFilter[key] = _incomingFilter[key];
        }
      }
    }

    return _currentFilter;

  }

}
