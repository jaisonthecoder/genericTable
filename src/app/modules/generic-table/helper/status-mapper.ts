import { Injectable } from "@angular/core";
import { RequestStatus } from "./RequestStatus";




@Injectable()
export class StatusText {
    
    _requestStatus = RequestStatus;
    voyageStatusCode = RequestStatus;

    constructor() { }

    getStatusText(status) {
        if (status === this.voyageStatusCode.Draft) {
            return this.voyageStatusCode.Draft;
        }
        else if (status === this.voyageStatusCode.SentToTO) {
            return this.voyageStatusCode.PendingApproval;
        }
        else if (status === this.voyageStatusCode.Pending) {
            return this.voyageStatusCode.Pending;
        }
        else if (status === this.voyageStatusCode.InProgress) {
            return this.voyageStatusCode.InProgressStatusText;
        }
        else {
            return status;
        }
    }

    getStatusDescription(statusCode) {
        if (statusCode === this._requestStatus.Draft) {
            return this._requestStatus.Draft;
        }
        else if (statusCode === this._requestStatus.SentToTO) {
            return this._requestStatus.PendingApproval;
        }
        else if (statusCode === this._requestStatus.Pending) {
            return this._requestStatus.Pending;
        }
        else if (statusCode === this._requestStatus.InProgress) {
            return this._requestStatus.InProgressStatusText;
        }
        else {
            return statusCode;
        }
    }

    getStatusTextColor(status) {
        if (status === this._requestStatus.Approved) {
            return 'text-color-approved';   // #1AC258'; // approved
        }
        else if (status === this._requestStatus.Rejected) {
            return 'text-color-rejected'; //'#D92836'; // rejected
        }
        else if (status === this._requestStatus.OnHold) {
            return 'text-color-onhold'; //'#D92836'; // onHold
        }
        else if (status === this._requestStatus.InProgress
            || status === this._requestStatus.Pending) {
            return 'text-color-inprogress' //'#F1BB0E'; // InProgress
        }
        else {
            return 'text-color-draft'; // '#3E7DC3'; // Draft
        }
    }
}
