// SAMPLE MODEL

import { GridColumnDefinition, advanceSearchTypeModel } from "@pcs/generic-listing";
export const metaObject = {
  "metadata.serviceRequests": { $exists: true },
};






export const TableColumns: GridColumnDefinition[] = [
  {
    columnDef: "id",
    header: "ID",
    cell: (element: any) => `${element.id}`,
    filter: false,    
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "id",
    colField: "id",
    isMasterData: false,
    metaObject: metaObject,
    show: false,
    headerBg:"rgb(190, 216 ,245)",
  },

  {
    columnDef: "select",
    header: "",
    cell: (element: any) => `${element.select}`,
    filter: false,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.select",
    colField: "select",
    isMasterData: false,
    metaObject: metaObject,
    show: false,
    isDefault: true,
    hideColHeader: true,
    headerBg:"#bed8f5",
    columnType:'select'

  },
  {
    columnDef: "vesselName",
    header: "Vessel Name",
    cell: (element: any) => `${element.vesselName}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.vesselName",
    colField: "vesselName",
    isMasterData: false,
    metaObject: metaObject,
    show: true,
    sticky: false,
    classList:"",
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
    isCustomizable:true
  },



  {
    columnDef: "imoNumber",
    header: "IMO Number",      
    cell: (element: any) => `${element.imoNumber}`,
  filter: true,
  filterEnabled: false,
  sort: null,
  filterSearchValue: "",
  dbField: "dataDocument.vesselInfo.imoNumber",
  colField: "voyageNo",
  isMasterData: false,
  metaObject: metaObject,
  show: true,
  sticky: false,
  textAlign:'left',
  isDefault: true,
  columnType:"string",
  advanceSearch: false,
  advanceSearchType:advanceSearchTypeModel.list,
  headerBg:"rgb(190 216 245)",
  type:'number',
  isCustomizable:true

  },

     
  {
    columnDef: "rotationNumber",
    header: "Rotation No.",      
    cell: (element: any) => `${element.rotationNumber}`,
  filter: true,
  filterEnabled: false,
  sort: null,
  filterSearchValue: "",
  dbField: "dataDocument.vesselInfo.rotationNumber",
  colField: "rotationNumber",
  isMasterData: false,
  metaObject: metaObject,
  show: true,
  sticky: false,
  textAlign:'left',
  isDefault: true,
  columnType:"string",
  advanceSearch: false,
  advanceSearchType:advanceSearchTypeModel.list,
  headerBg:"rgb(190 216 245)",
  isCustomizable:true

  },

      
  {
    columnDef: "vesselType",
    header: "Vessel Type",      
    cell: (element: any) => `${element.vesselType}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.vesselType",
    colField: "vesselType",
    isMasterData: true,
    metaObject: metaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: true,
    advanceSearch: true,
    advanceSearchType: advanceSearchTypeModel.list,
    columnType: 'string',
    headerBg:'#bed8f5',
    headerWeight:"600",
    lookupType:'vesselType',
    isCustomizable: true,
    width:'150',
    classList:"text-overflow no-wrap",
    textWrap:true,
    


    },





  {
    columnDef: "typeofRequest",
    header: "Type Of Request",
    cell: (element: any) => `${element.typeofRequest}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.requestType",
    colField: "typeofRequest",
    isMasterData: false,
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: true,
    
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
    classList:"text-overflow no-wrap",
    isCustomizable: true,
    width:"170"


  },

  {
    columnDef: "status",
    header: "Status",
    cell: (element: any) => `${element.terminalStatus}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "statusCode",
    colField: "terminalStatus",
    isMasterData: true,
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'center',
    isDefault: true,
    isCustomizable: true,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
    classList:"text-overflow no-wrap",
    lookupType:"VesselCallStatus"

  },

  {
    columnDef: "lastUpdatedDate",
    header: "Last Updated Date",
    cell: (element: any) => `${element.lastUpdatedDate}`,
    filter: true,
    filterEnabled: true,
    sort: null,
    filterSearchValue: "",
    dbField: "updatedDate.0",
    colField: "lastUpdatedDate",
    isMasterData: false,
    metaData: "metadata.lastUpdatedDate",
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:"text-overflow no-wrap",
    headerClassList:'',
    isDefault: true,
    isCustomizable: true,
    headerBg:"#bed8f5",
    advanceSearch: true,
    columnType: 'date',
    advanceSearchType: advanceSearchTypeModel.date,
    dateConvertFormat:'number'
  },  
  {
    columnDef: "request",
    header: "",
    cell: (element: any) => `${element.request}`,
    filter: false,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.request",
    colField: "request",
    isMasterData: false,
    metaData: "metadata.request",
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:"text-overflow no-wrap",
    headerClassList:'',
    isDefault: true,
    hideColHeader: false,
    isCustomizable: true,
    headerBg:"#bed8f5",
    columnType:'action'

  },  


  {
    columnDef: "eta",
    header: "ETA",
    cell: (element: any) => `${element.eta}`,
    filter: true,
    filterEnabled: true,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.eta",
    colField: "eta",
    isMasterData: true,
    metaData: "metadata.eta",
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:"text-overflow no-wrap",
    headerClassList:'',
    isDefault: false,
    isCustomizable: true,
    headerBg:"#bed8f5",
    advanceSearchType: advanceSearchTypeModel.date,
    columnType: 'date',
    dateConvertFormat:'iso',
    advanceSearch: true,
  },  

  {
    columnDef: "ata",
    header: "ATA",
    cell: (element: any) => `${element.ata}`,
    filter: true,
    filterEnabled: true,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.ata",
    colField: "ata",
    isMasterData: true,
    metaData: "dataDocument.portInfo.ata",
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:"text-overflow no-wrap",
    headerClassList:'',
    isDefault: false,
    isCustomizable: true,
    headerBg:"#bed8f5",
    advanceSearchType:advanceSearchTypeModel.date,
    columnType: 'date',
    dateConvertFormat:'iso',
    advanceSearch: true,
  },
 
  {
    columnDef: "vesselFlag",
    header: "Flag",
    cell: (element: any) => `${element.vesselFlag}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.vesselFlagMetaData.description.en-US",
    colField: "vesselFlag",
    isMasterData: true,
    metaObject: metaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: false,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
    lookupType:'Country',
    isCustomizable: true,

    },

    
  {
    columnDef: "port",
    header: "Port",
    cell: (element: any) => `${element.port}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.port.description.en-US",
    colField: "port",
    isMasterData: true,
    metaObject: metaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: false,
    advanceSearch: true,
    advanceSearchType: advanceSearchTypeModel.list,
    columnType: 'string',
    headerBg:'#bed8f5',
    headerWeight:"600",
    lookupType:'Ports',
    isCustomizable: true,
    classList:"text-overflow no-wrap",

    },

  {
    columnDef: "terminal",
    header: "Terminals",
    cell: (element: any) => `${element.terminal}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselInfo.terminal.description.en-US",
    colField: "terminal",
    isMasterData: true,
    metaObject: metaObject,
    show: true,
    sticky: false, 
    textAlign:'left',
    isDefault: false,
    advanceSearch: true,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
    lookupType:'Terminals',
    isCustomizable: true,
    classList:"text-overflow no-wrap",

    },
    {
      columnDef: "shippingLine",
      header: "Shipping Line",
      cell: (element: any) => `${element.shippingLine}`,
      filter: true,
      filterEnabled: false,
      sort: null,
      filterSearchValue: "",
      dbField: "dataDocument.vesselInfo.shippingLine",
      colField: "shippingLine",
      isMasterData: true,
      metaObject: metaObject,
      show: true,
      sticky: false, 
      textAlign:'left',
      isDefault: false,
      advanceSearch: true,
      columnType: 'string',
      advanceSearchType: advanceSearchTypeModel.list,
      headerBg:"#bed8f5",
      lookupType:'shippingLine',
      isCustomizable: true,
      classList:"text-overflow no-wrap",
      width:"150"

      },
 
  {
    columnDef: "voyageNo",
    header: "Voyage No.(IN)",
    cell: (element: any) => `${element.voyageNo}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.voyageInfo.voyageNoIn",
    colField: "voyageNo",
    isMasterData: false,
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: false,
    columnType:"string",
    advanceSearch: false,
    advanceSearchType:advanceSearchTypeModel.list,
    headerBg:"rgb(190 216 245)",    classList:"text-overflow no-wrap",

  }, 

 
  {
    columnDef: "VT",
    header: "VT",
    cell: (element: any) => `${element.vt}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vt",
    colField: "berth",
    isMasterData: false,
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: false,
    isCustomizable: true,
    advanceSearch: false,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",    classList:"text-overflow no-wrap",

  },


  {
    columnDef: "dangerousGoods",
    header: "Dangerous Goods",
    cell: (element: any) => `${element.dangerousGoods}`,
    filter: true,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.vesselCallDetails.cargoOperations.dangerousCargo",
    colField: "dangerousGoods",
    isMasterData: false,
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    isDefault: false,
    isCustomizable: true,
    advanceSearch: false,
    columnType: 'string',
    advanceSearchType: advanceSearchTypeModel.list,
    headerBg:"#bed8f5",
  },  



  {
    columnDef: "action",
    header: "Actions",
    cell: (element: any) => `${element.actions}`,
    filter: false,
    filterEnabled: false,
    sort: null,
    filterSearchValue: "",
    dbField: "dataDocument.actions",
    colField: "actions",
    isMasterData: false,
    metaData: "metadata.actions",
    metaObject: metaObject,
    show: true,
    sticky: false,
    textAlign:'left',
    classList:'',
    headerClassList:'',
    isDefault: true,
    hideColHeader: false,
    isCustomizable: true,
    headerBg:"#bed8f5",
    columnType:'action'

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


