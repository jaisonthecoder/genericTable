// SAMPLE MODEL

import { FormControl } from "@angular/forms";
export const manifestMetaObject = {'metadata.serviceRequests':{"$exists":true}}
export const TableColumns = [
    {
      columnDef: "id",
      header: "ID",
      cell: (element: TableCellModel) => `${element.id}`,
      filter: true,
      filterEnabled: false,
      sort:'asc',
      filterSearchValue:  new FormControl(""),
      dbField: 'dataDocument.vesselInfo.rotationNumber',
      colField: 'rotationNumber',
      isMasterData : false,
      metaObject: manifestMetaObject,
      show: false
    },
    {
      columnDef: "hblNo",
      header: "House BL#",
      cell: (element: TableCellModel) => `${element.hblNo}`,
      filter: true,
      filterEnabled: false,
      sort:'asc',
      filterSearchValue:  new FormControl(""),
      dbField: 'dataDocument.vesselInfo.rotationNumber',
      colField: 'rotationNumber',
      isMasterData : false,
      metaObject: manifestMetaObject,
      show: true
    },
    {
      columnDef: "shipper",
      header: "Shipper",
      cell: (element: TableCellModel) => `${element.shipper}`,
      filter: true,
      filterEnabled: false,
      sort:'asc',
      filterSearchValue:  new FormControl(""),
      dbField: 'dataDocument.vesselInfo.port',
      colField: 'port',
      isMasterData : true,
      metaData:'metadata.ptws',
      metaObject: manifestMetaObject,
      show: true
    },
   
    {
      columnDef: "noOfContainers",
      header: "No Of Container",
      cell: (element: TableCellModel) => `${element.noOfContainers}`,
      filter: false,
      filterEnabled: false,
      sort:'asc',
      filterSearchValue:  new FormControl(""),
      dbField: 'vesselInfo.rotationNumber',
      colField: 'rotationNumber',
      isMasterData : false,
      metaObject: manifestMetaObject,
      show: true
    },
    
    {
        columnDef: "noOfChasis",
        header: "No Of Chasis",
        cell: (element: TableCellModel) => `${element.noOfChasis}`,
        filter: false,
        filterEnabled: false,
        sort:'asc',
        filterSearchValue:  new FormControl(""),
        dbField: 'vesselInfo.rotationNumber',
        colField: 'rotationNumber',
        isMasterData : false,
        metaObject: manifestMetaObject,
        show: true

      }   
  ];



  export interface TableCellModel {
    id: string;
    hblNo: string,
    shipper: string;
    noOfContainers: any;
    noOfChasis:any    
  }


  export interface ColumnDefinitionModel {
    columnDef: string;
    header: string;
    cell: any;
    filter: boolean;
    filterEnabled : boolean;
    sort: string;
    filterSearchValue: any;

  }
  
  
  
  