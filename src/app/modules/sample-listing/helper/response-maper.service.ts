import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const language = "en-US";

@Injectable({
  providedIn: "root",
})


export class ResponseMaperService {
  constructor(public datepipe: DatePipe) { }
  objDesc: string;
  terminalStatusCode: any;
  customStatusCode: any;

  public RequestListMapper(d:any) {
    let atd = this.getMetadataItem(d, "ATD");
    let ata = this.getMetadataItem(d, "ATA");
    let response = {
      id: d.id,
      appointmentRef: d.data.requestReferenceId ? d.data.requestReferenceId :"",
      appointmentSlot: d.data?.appointmentDetails?.timeSlot
        ?  d.data?.appointmentDetails?.timeSlot
        : "",
      paymentType: "Cash",
      truckNo:
          d.data?.appointmentDetails?.truckNo != undefined
          ? d.data?.appointmentDetails?.truckNo?.truckNo ? 
          d.data?.appointmentDetails?.truckNo?.truckNo : 
          d.data?.appointmentDetails?.truckNo? 
          d.data?.appointmentDetails?.truckNo : ""
          : "",
      appointmentDate:
        this.getMetadataItem(d, 'appointmentDetails') == ""
          ? (d.data?.appointmentDetails.appointmentDate != undefined ? this.datepipe.transform(d.data?.appointmentDetails.appointmentDate, "dd/MM/YYYY") : "")
          : this.datepipe.transform(this.getMetadataItem(d, 'appointmentDetails'), "dd/MM/YYYY"),
      ata: ata && ata?.ataDateTime ? this.datepipe.transform(ata.ataDateTime, "dd/MM/YYYY HH:mm") : "",
      createdDate: d.createdDate
        ? this.datepipe.transform(d.createdDate, "dd/MM/YYYY HH:mm")
        : "",
      atd: atd && atd?.atdDateTime ? this.datepipe.transform(atd.atdDateTime, "dd/MM/YYYY HH:mm") : "",
      port: d.data?.selectedContainers[0]?.port ? d.data?.selectedContainers[0]?.port :"N/A" ,
      terminal: d.data?.selectedContainers[0]?.terminal ? d.data?.selectedContainers[0].terminal :'N/A',
      truckType:
        d.data?.appointmentDetails?.chassisType != undefined
          ? d.data?.appointmentDetails?.chassisType
          : "",
      status: d.statusCode != "" ? d.statusCode : "",
      statusImgPath: environment.appUrl + "assets/img/" + d.statusCode + ".svg",

      // serviceName: "string",
      // requestedStartTime: "string",
      // requestedEndTime: "string"
      createdBy: d.createdBy ? d.createdBy : "",
      lastUpdatedDate: d.updatedDate ? this.datepipe.transform(d.updatedDate, "dd/MM/YYYY HH:mm") : "",
      posCombo:d.data.posCombo,
      selectedContainers: d.data?.selectedContainers,
      containerPositionList:d.data?.containerPositionList,
      appointmentDetails:d.data?.appointmentDetails,
    };

    return response;
  }


  getdescriptionData(description: any): string {
    this.objDesc = "";
    if (description != undefined && description != "") {
      this.objDesc = description["en-US"];
      return this.objDesc;
    } else {
      return "";
    }
  }

  getDescription(item:any){
    let description = "";
    if(item && item.description){
      description = item.description[language];
    }
    return description;
  }

  getStatusCode(data: any, statusType: any) {
    if (statusType === "statusTerminal") {
      this.terminalStatusCode = JSON.parse(JSON.parse(data).statusTerminal)[
        "en-US"
      ];
      return this.terminalStatusCode;
    }
    if (statusType === "statusCustom") {
      this.customStatusCode = JSON.parse(JSON.parse(data).statusCustom)[
        "en-US"
      ];
      return this.customStatusCode;
    }
  }

  getCamelCaseYesOrNo(value: any) {
    if (value == "yes") {
      return "Yes";
    } else if (value == "no") {
      return "No";
    } else {
      return value;
    }
  }

  public getMetadataItem(itemObject:any, item:any) {
    let itemValue = "";
    if (itemObject.metadata != "") {
      var metaData = JSON.parse(itemObject.metadata);
      if (metaData[item] != null)
        return metaData[item];
      else
        return "";
    }
    else {
      return "";
    }
  }

  public getMetadataPTWCount(itemObject:any, item:any) {
    var result = this.getMetadataItem(itemObject, item);
    if (result == "")
      result = 0;

    return result;
  }

  getCancellationCutOffDate(sentDate:any) {
    if (sentDate) {
      let numOfMinutes = 30;
      sentDate = new Date(sentDate)
      sentDate.setMinutes(sentDate.getMinutes() + numOfMinutes);
      let cutOffDate = this.datepipe.transform(sentDate, "dd/MM/YYYY HH:mm")
      return cutOffDate;
    }
    else{
      return sentDate;
    }
  }
}
