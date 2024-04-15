import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import _ from 'lodash';
import { DefaultTableService } from '../services/generic-listing-table.service';
import { manifestMetaObject, TableCellModel, TableColumns } from './demo-tbl.model';


@Component({
  selector: 'demo-tbl',
  templateUrl: './demo-tbl.component.html',
  styleUrls: ['./demo-tbl.component.scss']
})
export class DemoTblComponent implements OnInit, OnDestroy{
  dataSource = [];  
  gridConfig = {
    tableColumns:  _.filter([TableColumns], { show: true }),
    dataList: [],
    dataSource:  [],
    pageSize:'5',
    pageIndex: '1',
    totalCount: null,
    itemperpageList: ['5', '10', '20'],
    tableMetaObject: manifestMetaObject,
    manifestMetaObject: manifestMetaObject
  }
  dataAPI: any; //  dummyAPI
  responseMaper: any; // Dummy Mapper
  constructor(private cdr: ChangeDetectorRef, 
          private route : ActivatedRoute,    
          private tblService: DefaultTableService,
          private _matDialog: MatDialog, private router: Router,
         
        
   ) { }

  ngOnInit(): void {
            this.tblService.selectedItem$.subscribe((item)=>{
          this.getHBLGridData(item);    
        })  
   }

  ngOnDestroy(): void {
  }


 
  

  getImgPath(imgName: string) {
    return environment.appUrl + "assets/img/" + imgName;
  }

  goToLanding(){
    this.router.navigate(["/manifest"]);
  }

  onHBLGridPageChanges(e){

  }


  getHBLGridData(event): void {

    let payload = event.payload;
    let filterValue = {};
    let payloadPagination = {
      filter: event.payload,
      order: {},
      pagination: event.pagination,
    };

    let sortOrder: any = {};
    sortOrder = event.sortOrder;

    this.dataAPI.getData(payload, payloadPagination, sortOrder).subscribe({
      next: (res) => {
        let result = res.data.data;
        // this.hblConfig.dataList = res.data.data;
        // this.hblConfig.dataList = res?.data?.data?.map((d) => {
        //   return <TableCellModel>this.responseMaper.getHBLResponseMapper(d);
        // });
        // this.hblConfig.totalCount = res.data?.totalItemCount;
        // this.hblConfig.pageIndex = res.data?.pageIndex;
        // this.hblConfig.pageSize = res.data?.pageSize;
        // this.hblConfig.dataSource = res.data.data;
        this.cdr.detectChanges();
      },
      error: (err) => {

      },
      complete: () => {

      }

    })

  }

  onMenuFilterChanges(){
    
  }
  testClick(){
    alert('Test Clicked');
  }

}
