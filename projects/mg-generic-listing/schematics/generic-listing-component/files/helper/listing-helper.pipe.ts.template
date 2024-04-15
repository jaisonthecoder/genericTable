import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "environments/environment";

@Pipe({
  name: 'imagePath',
  standalone: true,
})
export class ImagePipe implements PipeTransform {
  transform(value: string): string {
    return environment.appUrl + "assets/img/" + value;
  }
}


@Pipe({
  name: 'truncateText',
  standalone: true
})
export class TruncTextPipe implements PipeTransform {

  private readonly _limit: number = 15;

  transform(value: string, limit: number = this._limit): string {
    if(value!= undefined)
      return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}