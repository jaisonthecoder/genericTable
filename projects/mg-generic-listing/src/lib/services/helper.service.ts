import { Injectable } from '@angular/core';
import { translations } from '../data-provider/i18n/i18n-data';
import { BehaviorSubject, Observable } from 'rxjs';

export class TranslationSet {
  public language: string;
  public values: { [key: string]: string } = {};
}

@Injectable({providedIn:'root'})
export class HelperService {



  public clearInlineFilter = new BehaviorSubject<any>(false);
  clearInlineFilter$: Observable<any> = this.clearInlineFilter.asObservable();

  public clearInlineFilterSort = new BehaviorSubject<any>({});
  clearInlineFilterSort$: Observable<any> = this.clearInlineFilterSort.asObservable();

  constructor() { }


  public clearAllInlineFilter(trueOrFalse: any = false) {
    this.clearInlineFilter.next(trueOrFalse)
  }
  public _clearInlineFilterSort(data: any) {
    this.clearInlineFilterSort.next(data)
  }
}
