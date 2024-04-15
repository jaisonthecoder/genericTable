// SAMPLE MODEL

import { GridColumnDefinition } from "@pcs/generic-listing";
export const manifestMetaObject = {
  "metadata.serviceRequests": { $exists: true },
};






export const TableColumns: GridColumnDefinition[] = [
  {
    columnDef: "id",
    header: "ID",
    cell: (element: any) => `${element.id}`,
    filter: false,    
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.rotationNumber",
    colField: "rotationNumber",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: false,
    headerBg:"rgb(190, 216 ,245)",
  },

  {
    columnDef: "select",
    header: "",
    cell: (element: any) => `${element.select}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.select",
    colField: "select",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    isDefault: true,
    hideColHeader: true,
    headerBg:"#bed8f5",
  },
  {
    columnDef: "appointmentRef",
    header: "Appointment Ref No.",
    cell: (element: any) => `${element.appointmentRef}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "requestReferenceId",
    colField: "appointmentRef",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    classList:"",
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: "list",
    headerBg:"#bed8f5",
    headerColor:"red",

  },

  {
    columnDef: "port",
    header: "Port",
    cell: (element: any) => `${element.port}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.selectedContainers.0.port",
    colField: "port",
    isMasterData: true,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    advanceSearchType: "list",
    columnType: 'string',
    headerBg:'#bed8f5',
    headerColor:"red",
    headerWeight:"600"
  },

  {
    columnDef: "terminal",
    header: "Terminal",
    cell: (element: any) => `${element.terminal}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.selectedContainers.0.terminal",
    colField: "terminal",
    isMasterData: true,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: "list",
    headerBg:"#bed8f5",
    
    },

    {
      columnDef: "appointmentDate",
      header: "Appointment Date",
      cell: (element: any) => `${element.appointmentDate}`,
      filter: true,
      filterEnabled: false,
      sort: "asc",
      filterSearchValue: "",
      dbField: "dataDocument.appointmentDetails.appointmentDate",
      colField: "appointmentDate",
      isMasterData: false,
      metaObject: manifestMetaObject,
      show: true,
      sticky: false,
      textAlign:'left',
      columnType:'date',
      isDefault: true,
      advanceSearch: true,
      advanceSearchType: "date",
      headerBg:"rgb(190 216 245)",
  
    },

  {
    columnDef: "appointmentSlot",
    header: "Appointment Slot",
    cell: (element: any) => `${element.vat}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.appointmentSlot",
    colField: "appointmentSlot",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: true,
    columnType:"date",
    advanceSearch: true,
    advanceSearchType: "list",
    headerBg:"rgb(190 216 245)",


  },
 

  {
    columnDef: "paymentType",
    header: "Payment Type",
    cell: (element: any) => `${element.paymentType}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "appointmentDetails.paymentType",
    colField: "paymentType",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    advanceSearchType: "text",
    columnType: 'string',
    headerBg:"#bed8f5",
  },


 

  {
    columnDef: "truckNo",
    header: "Truck No",
    cell: (element: any) => `${element.truckNo}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "appointmentDetails.truckNo.truckNo",
    colField: "truckNo",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: true,
    isCustomizable: true,
    advanceSearch: true,
    advanceSearchType: "list",
    columnType: 'string',
    headerBg:"#bed8f5",


  },
  {
    columnDef: "truckType",
    header: "Truck Type",
    cell: (element: any) => `${element.truckType}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "appointmentDetails.chassisType",
    colField: "truckType",
    isMasterData: true,
    metaData: "metadata.truckType",
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: true,
    isCustomizable: true,
    advanceSearch: true,
    advanceSearchType: "list",
    columnType: 'string',
    headerBg:"#bed8f5",


  },  
  {
    columnDef: "createdDate",
    header: "Created Date",
    cell: (element: any) => `${element.createdDate}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.createdDate",
    colField: "createdDate",
    isMasterData: true,
    metaData: "metadata.createdDate",
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: false,
    isCustomizable: true,
    headerBg:"#bed8f5",

  },  


  {
    columnDef: "createdBy",
    header: "Created By",
    cell: (element: any) => `${element.createdBy}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.createdBy",
    colField: "createdBy",
    isMasterData: true,
    metaData: "metadata.createdBy",
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: false,
    isCustomizable: true,
    headerBg:"#bed8f5",

  },  



  {
    columnDef: "lastUpdatedDate",
    header: "Last Updated Date",
    cell: (element: any) => `${element.lastUpdatedDate}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.lastUpdatedDate",
    colField: "lastUpdatedDate",
    isMasterData: true,
    metaData: "metadata.lastUpdatedDate",
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: false,
    isCustomizable: true,
    headerBg:"#bed8f5",
  },  


  {
    columnDef: "status",
    header: "Status",
    cell: (element: any) => `${element.status}`,
    filter: true,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "appointmentDetails.status",
    colField: "status",
    isMasterData: false,
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: true,
    isCustomizable: true,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: "list",
    headerBg:"#bed8f5",
  },
  {
    columnDef: "action",
    header: "Actions",
    cell: (element: any) => `${element.actions}`,
    filter: false,
    filterEnabled: false,
    sort: "asc",
    filterSearchValue: "",
    dbField: "dataDocument.actions",
    colField: "actions",
    isMasterData: false,
    metaData: "metadata.actions",
    metaObject: manifestMetaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: true,
    hideColHeader: false,
    isCustomizable: true,
    headerBg:"#bed8f5",

  },  
];

export interface TableCellModel {
  id: string;
  hblNo: string;
  shipper: string;
  noOfContainers: any;
  noOfChasis: any;
}

export interface ColumnDefinitionModel {
  columnDef: string;
  header: string;
  cell: any;
  filter: boolean;
  filterEnabled: boolean;
  sort: string;
  filterSearchValue: any;
}