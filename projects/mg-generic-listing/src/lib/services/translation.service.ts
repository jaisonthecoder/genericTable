import { Injectable } from '@angular/core';
import { translations } from '../data-provider/i18n/i18n-data';
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';

export class TranslationSet {
  public language: string;
  public values: { [key: string]: string } = {};
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  public languages = ['en-US', 'ar-AE', 'en', 'ar'];

  public language = localStorage.getItem('defaultLanguage') || 'en-US';

  private dictionary: { [key: string]: TranslationSet } = translations;

  private getLang = new BehaviorSubject<any>('');
  getLang$: Observable<any> = this.getLang.asObservable();

  constructor() { }

  translate(value: string, language = this.language): string {
    //console.log('translate called with value ' + value + ' and language ' + this.language);
    if (this.dictionary[this.language] && this.dictionary[this.language] != null && !_.isEmpty(this.dictionary[this.language].values) && this.dictionary[this.language].values[value]) {
      return this.dictionary[this.language].values[value];
    } else {
      return value;
    }
  }

  handleTranslation(translation: any, lang: string) {
    try {
      let translationObject: any = {};
      if (this.dictionary[lang]) {
        translationObject = this.dictionary[lang].values;
      }
      else {
        this.dictionary[lang] = {
          language: lang,
          values: translation
        }
      }

      for (let key in translation) {
        let value = translation[key];
        if (!translationObject[key]) {
          translationObject[key] = value;
        }

        // translationObject[key] = value;
      }

      this.dictionary[lang].values = translationObject;
      return translationObject;
    }
    catch (err) {
      console.log(err)
    }
  }



  setLanguage(lang: string, translations = null) {
    this.language = lang;
    if (translations) {
      this.handleTranslation(translations, lang);
    }
    this.getLang.next(lang);
  }

}
