import { HttpParams } from '@angular/common/http';

export interface IGenericTableLookupService {
  fetch(params?: HttpParams): Promise<any>;
  
}
