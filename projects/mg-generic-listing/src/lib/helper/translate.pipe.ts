import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { ValidationErrors, ValidatorFn, AbstractControl, Validators, FormGroup } from '@angular/forms';

@Pipe({
  name: 'translang',
  pure: false
})
export class ListingTranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: any, args?: any): any {
    return this.translationService.translate(value) || value;
  }
}






export class CustomValidators {
    

    static dateRangeValidator(fromDateField: string, toDateField: string, errorName: string = 'rangeMissMatch'): ValidatorFn {
        return (formGroup:any|AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField).value;
            const toDate = formGroup.get(toDateField).value;
            // Ausing the fromDate and toDate are numbers. In not convert them first after null check
            if ((fromDate !== null && toDate !== null) && fromDate > toDate) {
                formGroup['controls'][toDateField].setErrors({ rangeMissMatch: true });
                // return {[errorName]: true};
            }
            return null;
        };
    }



}


