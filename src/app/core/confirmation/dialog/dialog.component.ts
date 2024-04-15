import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmationConfig } from '../confirmation.types';

@Component({
    selector     : 'fuse-confirmation-dialog',
    templateUrl  : './dialog.component.html',
    styles       : [
        `
            .fuse-confirmation-dialog-panel {
                @screen md {
                    
                }

                .mat-dialog-container {
                    padding: 0 !important;
                }
            }
            .mat-flat-button
            {
                height: 37px !important;
                min-height: 37px;
                width: 43% !important;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class FuseConfirmationDialogComponent
{
    /**
     * Constructor
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: FuseConfirmationConfig)
    {
    }

}
