import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SvgIconService {
  constructor(private _iconRegistry: MatIconRegistry, private _sanitizer: DomSanitizer) {}

  /**
   * @remarks Method takes icons array and an optional isImage boolean to load the svg
   * from the image directory.
   * 
   * This method registers the svg images / icons to Angular Icon registry to be used with 
   * `mat-icon` module of angular.
   * 
   * **Please ensure registorIcons is only called once in your component and that too during 
   * constructor initialization phase.** This is very important to not pollute the angular icons 
   * registry as well as maintaining the good practices regarding the icons registry.
   * 
   * @param icons - string array with image / icons filenames
   * @param isImage Boolean to load from the image directory.
   * 
   * @see  Angular Mat Icon Registry Documentation - {@link https://material.angular.io/components/icon/api#MatIconRegistry}
   * 
   * @example Injecting in the constructor and using it
   * 
   * #Usage
   * ```ts
   * constructor(private _iconService: SvgIconService) {
   *  _iconService.registerIcons(
   *    [
   *      'search', 
   *      'Icon-ionic-ios-add-circle'
   *    ]);
   * } 
   * ```
   */
  public registerIcons(icons: Array<string>, isImage: boolean = false): void {

    for(const icon of icons){
      if(isImage){
        this._iconRegistry.addSvgIcon(
          icon,
          this._sanitizer.bypassSecurityTrustResourceUrl(`${environment.assetsUrl}/images/${icon}.svg`)
        );

        continue;
      }

      this._iconRegistry.addSvgIcon(
        icon,
        this._sanitizer.bypassSecurityTrustResourceUrl(`${environment.assetsUrl}/icons/${icon}.svg`)
      );
    }
  }
}
