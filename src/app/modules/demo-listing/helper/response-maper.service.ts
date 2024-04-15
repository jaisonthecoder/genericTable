import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
const language = "en-US";

@Injectable({
  providedIn: "root",
})


export class ResponseMaperService {
 
  
  constructor(public datepipe: DatePipe) { }
  objDesc: string;
  terminalStatusCode: any;
  customStatusCode: any;

  public RequestListMapper(d) {
    let metadata = d.metadata ? JSON.parse(d.metadata) : {};
    // let customsStatus = metadata?.statusCustom ? JSON.parse(metadata.statusCustom) : {};
    // let terminalStatus = metadata?.statusTerminal ? JSON.parse(metadata.statusTerminal) : {};

    let ata = this.getMetadataItemStr(d, "ATA");
    let response = {
      id: d.id,
      referenceID: d.data?.requestReferenceId ? d.data?.requestReferenceId : "",
      vesselName: d.data?.vesselInfo?.vesselName !== undefined ? d.data?.vesselInfo?.vesselName : "",
      bookingNumber: d.data?.generalDetails?.bookingNo != undefined ? d.data?.generalDetails?.bookingNo : "",
      rotationNumber: d.data?.vesselInfo?.rotationNumber != undefined ? d.data?.vesselInfo?.rotationNumber : "",
      port: d.data?.vesselInfo?.port != "" ? d.data?.vesselInfo?.port: "",
      terminal: this.getTerminal(d.data),
      // terminalStatus: terminalStatus["en-US"] ? terminalStatus["en-US"] : "",
      // terminalStatusImgPath: environment.appUrl + "assets/img/" + d.statusCode + ".svg",
      terminalStatus : this.getStatusMetadataItem(d, "statusTerminal") ?(this.getStatusMetadataItem(d, "statusTerminal")): d.statusCode != "" ? d.statusCode : "",
      terminalStatusImgPath : environment.appUrl + "assets/img/" + (this.getStatusMetadataItem(d, "statusTerminal") ?? d.statusCode)?.replace(/\s/g, "") + ".svg",


      // customsStatus: customsStatus["en-US"] != "" ? customsStatus["en-US"] : "",
      // customsStatusImgPath: environment.appUrl + "assets/img/" + d.statusCode + ".svg",

    
      customsStatus : this.getStatusMetadataItem(d, "statusCustom") ?(this.getStatusMetadataItem(d, "statusCustom")) : d.statusCode != "" ? d.statusCode : "",
      customsStatusImgPath: environment.appUrl + "assets/img/" + (this.getStatusMetadataItem(d, "statusCustom") ?? d.statusCode)?.replace(/\s/g, "") + ".svg",
      

      shipper: d.data?.generalDetails?.shipper != "" ? d.data?.generalDetails?.shipper?.description['en-US'] : "",
      bookingType: d.data?.generalDetails?.selectedRequestType != "" ? d.data?.generalDetails?.selectedRequestType?.description['en-US'] : "",
      lastUpdatedDate: d.updatedDate ? this.datepipe.transform(d.updatedDate, "dd/MM/YYYY HH:mm") : "",
      portOfDischarge: d.data?.generalDetails?.portOfDischarge && Object.keys(d.data?.generalDetails?.portOfDischarge).length !== 0 ?  d.data?.generalDetails?.portOfDischarge?.description['en-US'] : "",
      eta: this.getMetadataItem(d, 'eta') == "" ? (d.data?.vesselInfo?.eta != undefined && d.data?.vesselInfo?.eta != ''  ? this.datepipe.transform(d.data?.vesselInfo?.eta, "dd/MM/YYYY HH:mm") : "N/A") : this.datepipe.transform(this.getMetadataItem(d, 'eta'), "dd/MM/YYYY HH:mm") ,
      ata: ata && ata?.ataDateTime ? this.datepipe.transform(ata?.ataDateTime, "dd/MM/YYYY HH:mm")  : "",
    };
    return response;
  }

  public getMetadataItemStr(itemObject, item) {
    if (itemObject.metadata != "") {
      var metaData = JSON.parse(itemObject.metadata);
      if (metaData[item] != null)
        return JSON.parse(metaData[item]);
      else return "";
    } else { return ""; }
  }

  public getTerminal(data: any)
  {
    if(data?.vesselInfo?.terminal !== undefined)
       return data?.vesselInfo?.terminal 
    else if(data?.generalDetails?.terminalFAO?.description !== undefined)
      return data?.generalDetails?.terminalFAO?.description['en-US'];
    else
      return "";
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
  public getMetadataItem(itemObject, item) {
    let itemValue = "";
    if (itemObject.metadata != "") {
      itemValue = item;
      if (
        JSON.parse(
          JSON.parse(JSON.stringify(itemObject.metadata)).replace(/-/g, "")
        ).ptws != undefined
      ) {
        itemValue = JSON.parse(
          JSON.parse(
            JSON.parse(JSON.stringify(itemObject.metadata)).replace(/-/g, "")
          ).ptws
        ).length;
        if (itemValue != undefined) {
          return itemValue;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getCancellationCutOffDate(sentDate) {
    if (sentDate) {
      let numOfMinutes = 30;
      sentDate = new Date(sentDate)
      sentDate.setMinutes(sentDate.getMinutes() + numOfMinutes);
      let cutOffDate = this.datepipe.transform(sentDate, "dd/MM/YYYY HH:mm")
      return cutOffDate;
    }
  }
  public  getStatusMetadataItem(itemObject, item) {
    if (itemObject.metadata != "") {
        var metaData = JSON.parse(itemObject.metadata);
        if (metaData[item] != null) {
            let status = JSON.parse(metaData[item])
            return status["en-US"];
        }
    }
    return null;
}

public transactionListMapper(d) {
  let response = {
    id: d.submissionId,
    dateTime: d.date
      ? this.datepipe.transform(d.date, "dd/MM/YYYY hh:mm")
      : "",
      user: d.user != "" ? d.user : "",
      transactionMessage: d.message != "" ? d.message : ""
  }
  return response;
}
}
