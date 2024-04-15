import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: "root",
})


export class ResponseMaperService {

  lang: string = localStorage.getItem("defaultLanguage") ? localStorage.getItem("defaultLanguage") : 'en-US';
  constructor(public datepipe: DatePipe, private _translocoService: TranslocoService) {
    this._translocoService.langChanges$.subscribe((lang) => { this.lang = lang; })

  }
  objDesc: string;
  terminalStatusCode: any;
  customStatusCode: any;

  public RequestListMapper(d: any) {
    let ata:any = this.getMetadataItem(d, "ATA", true);
    let response = {
      id: d.id,
      lastUpdatedDate: d.updatedDate
        ? this.datepipe.transform(d.updatedDate, "dd/MM/YYYY HH:mm")
        : "",
      status: d.statusCode != "" ? d.statusCode : "",
      vesselName: d.data?.vesselInfo?.vesselName != "" ? d.data?.vesselInfo?.vesselName : "",
      imoNumber: d.data?.vesselInfo?.imoNumber != undefined ? d.data?.vesselInfo?.imoNumber : "",
      rotationNumber: d.data?.vesselInfo?.rotationNumber != undefined ? d.data?.vesselInfo?.rotationNumber : "",
      // eta: d.data?.vesselInfo.eta != undefined ? this.datepipe.transform(d.data?.vesselInfo.eta, "dd/MM/YYYY HH:mm") : "",
      eta: this.getMetadataItem(d, 'eta') == "" ? (d.data?.vesselInfo.eta != undefined ? this.datepipe.transform(d.data?.vesselInfo.eta, "dd/MM/YYYY HH:mm") : "N/A") : this.datepipe.transform(this.getMetadataItem(d, 'eta'), "dd/MM/YYYY HH:mm"),
      ata: ata && ata?.ataDateTime ? this.datepipe.transform(ata.ataDateTime, "dd/MM/YYYY HH:mm") : "N/A",
      vesselFlag:
        d.data?.vesselInfo?.vesselFlagMetaData && d.data?.vesselInfo?.vesselFlagMetaData != ""
          ? JsonParser.getCountryFlag(d.data?.vesselInfo?.vesselFlagMetaData, "name")
          : "",
      port: d.data?.vesselInfo?.port?.description ? this.getdescriptionData( d.data?.vesselInfo?.port?.description) :  d.data?.vesselInfo?.port ,
      terminal: d.data?.vesselInfo?.terminal?.description ? this.getdescriptionData( d.data?.vesselInfo?.terminal?.description) :  d.data?.vesselInfo?.terminal ,
      typeofRequest: d.data?.requestType != undefined ? d.data?.requestType : "",
      statusImgPath: environment.appUrl + "assets/img/" + d.statusCode + ".svg",
      flagImgPath:
        d.data?.vesselInfo?.vesselFlagMetaData && d.data?.vesselInfo?.vesselFlagMetaData != ""
          ? environment.appUrl +
          "assets/images/flags/1x1/" +
          JsonParser.getCountryFlag(d.data?.vesselInfo?.vesselFlagMetaData, "code") +
          ".svg"
          : "assets/images/flags/1x1/noFlag.svg",
      dateFromLastPort: d.data?.vesselInfo?.departureDateFromLastPort != undefined ? d.data?.vesselInfo?.departureDateFromLastPort : '',
      dateETA: d.data?.vesselInfo?.eta != undefined ? d.data?.vesselInfo?.eta : "",
      vesselType: d.data?.vesselInfo?.vesselType != undefined ? d.data?.vesselInfo?.vesselType : "",
      shippingLine: d.data?.vesselInfo?.shippingLine != undefined ? d.data?.vesselInfo?.shippingLine : "",
      voyageNo: d.data?.vesselInfo?.voyageNumber != undefined ? d.data?.vesselInfo?.voyageNumber : "",
      VT: "",
      totalServiceRequestCount: this.getMetadataServiceCount(d, "serviceRequestCount"),
      totalPTWRequestCount: this.getMetadataServiceCount(d, "ptwCount"),


      dangerousGoods: d.data?.vesselCallDetails?.cargoOperations?.dangerousCargo != undefined ? this.getCamelCaseYesOrNo(d.data?.vesselCallDetails?.cargoOperations?.dangerousCargo) : ""

    };

    return response;
  }

  public getMetadataServiceCount(itemObject, item) {
    var result = this.getMetadataItem(itemObject, item);
    if (result == "")
      result = 0;

    return result;
  }

  public getOtherRequestsStatus(d)
  {
    return environment.appUrl + "assets/img/" + (this.getStatusMetadataItem(d, "vesselCallStatus") ?? d.statusCode)?.replace(/\s/g, "") + ".svg"
  }


  public getMetadataItemStr(itemObject: any, item: any) {
    if (itemObject.metadata != "") {
      var metaData = JSON.parse(itemObject.metadata);
      if (metaData[item] != null)
        return JSON.parse(metaData[item]);
      else return "";
    } else { return ""; }
  }

  public getTerminal(data: any) {
    if (data?.vesselInfo?.terminal !== undefined)
      return data?.vesselInfo?.terminal
    else if (data?.generalDetails?.terminalFAO?.description !== undefined)
      return data?.generalDetails?.terminalFAO?.description[this.lang];
    else
      return "";
  }



  getdescriptionData(description: any): string {
    this.lang = this.getLang();
    this.objDesc = "";
    if (description != undefined && description != "") {
      this.objDesc = description[this.lang];
      return this.objDesc;
    } else {
      return "";
    }
  }



  getLang() {
    let _lang = localStorage.getItem("defaultLanguage");
    if (_lang) {
      this.lang = _lang;
    }

    return this.lang;
  }



  getStatusCode(data: any, statusType: any) {
    if (statusType === "statusTerminal") {
      this.terminalStatusCode = JSON.parse(JSON.parse(data).statusTerminal)[
        this.lang
      ];
      return this.terminalStatusCode;
    }
    if (statusType === "statusCustom") {
      this.customStatusCode = JSON.parse(JSON.parse(data).statusCustom)[
        this.lang
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
  
  public getMetadataItemOld(itemObject: any, item: any) {
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


  public getMetadataItem(itemObject, item, doParseItem = false) {
    if (itemObject.metadata != "") {
      var metaData = JSON.parse(itemObject.metadata);
      if (metaData[item] != null) {
        if (doParseItem)
          return JSON.parse(metaData[item]);
        else return metaData[item];
      }
      else return "";
    } else { return ""; }
  }


  getCancellationCutOffDate(sentDate: any) {
    if (sentDate) {
      let numOfMinutes = 30;
      sentDate = new Date(sentDate)
      sentDate.setMinutes(sentDate.getMinutes() + numOfMinutes);
      let cutOffDate = this.datepipe.transform(sentDate, "dd/MM/YYYY HH:mm")
      return cutOffDate;
    }
  }
  public getStatusMetadataItem(itemObject: any, item: any) {
    if (itemObject.metadata != "") {
      var metaData = JSON.parse(itemObject.metadata);
      if (metaData[item] != null) {
        let status = JSON.parse(metaData[item])
        return status['en-US'];
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
      user: d.user != "" ? this._translocoService.translate(d.user, null, this.lang) : "",
      transactionMessage: d.data && d.data.messageSA != "" ? this.isValidJson(d.data.messageSA) ? JSON.parse(d.data.messageSA)[this.lang] ? JSON.parse(d.data.messageSA)[this.lang] : d.data.messageSA : d.message : ""
    }
    return response;
  }

  isValidJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }





  public getMBLResponseMapper(d) {
    let response = {
      manifestBatchId: d.manifestBatchId ? d.manifestBatchId : "",
      mblNo: d.bLDetail.blNumber != undefined ? d.bLDetail.blNumber : "",
      billType: d.billType != undefined ? d.billType : "N/A",
      // billType : "Import",
      loadPort: d.bLDetail?.portOfLoading?.description ? d.bLDetail?.portOfLoading?.description[this.lang] : d.houseBLs[0]?.bLDetail ? d.houseBLs[0].bLDetail?.portOfLoading?.description['en-US'] : "N/A",
      houseBLs: d.houseBLs,
      bLDetail: d.bLDetail
    }
    return response;
  }


  public containerMapper(d) {
    let response = {

      containerNo: d.containerNo ? d.containerNo : "N/A",
      sizeAndType: d.sizeAndType?.description ? d.sizeAndType?.description[this.lang] : "N/A",
      grossWeight: d.grossWeight ? d.grossWeight : "N/A",
      containerStatus: d.containerStatus?.description ? d.containerStatus?.description[this.lang] : "N/A",
      temperatureRangeMin: d.reefer?.length ? d.reefer[0]?.temperatureRangeMin : "",
      temperatureRangeMax: d.reefer?.length ? d.reefer[0]?.temperatureRangeMax : ""
    };

    return response;
  }



}



export class JsonParser {
  public static getCountryFlag(flagObject, type) {
    let flagCode,
      flagCountry = "";
    if (typeof flagObject === "object") {
      let descriptionObj = flagObject.metadata;
      descriptionObj.forEach((flag: any) => {
        if (flag.metadata_Type == "Other_Info") {
          let description = flag.data;
          try {
            if (typeof description === "string") {
              flagCode = JSON.parse(
                JSON.parse(JSON.stringify(description)).replace(/-/g, "")
              ).Country_ISO2_Code?.toLowerCase();
              flagCountry = JSON.parse(
                JSON.parse(JSON.stringify(description)).replace(/-/g, "")
              ).Country_Alias;
            } else if (description) {
              flagCode = description["Country_ISO-2_Code"].toLowerCase();
              flagCountry = description["Country_Alias"];
            } else {
              return "";
            }
          } catch (Error) {
          }
        }
      });
      if (type == "code") return flagCode ? flagCode : "";
      else if (type == "name") return flagCountry;
    } else {
      return "";
    }
  }

  public static getHmRemarks(remarksObject) {
    let hmRemarks = "";
    hmRemarks = JSON.parse(
      JSON.parse(JSON.stringify(remarksObject)).replace(/-/g, "")
    ).hm_remarks;
    return hmRemarks ? hmRemarks : "";
  }

  public static getStatus(status, type) {
    let statusDescription = "";
    if (type == "terminal") {
      statusDescription = JSON.parse(
        JSON.parse(JSON.parse(JSON.stringify(status)).replace(/-/g, ""))
          .statusTerminal
      ).enUS;
    } else if (type == "customs") {
      statusDescription = JSON.parse(
        JSON.parse(JSON.parse(JSON.stringify(status)).replace(/-/g, ""))
          .statusCustom
      ).enUS;
    }

    return statusDescription ? statusDescription : "";
  }

  
}
