import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HTTPSuccessResponse } from 'src/assets/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SuccessResponseService {

  constructor(
    private _messageService: MessageService
  ) { }

  /**
   * Add success message in toast
   * @param {HTTPSuccessResponse} successObject 
   */
  public showSuccess(successObject: HTTPSuccessResponse):void {
    this._messageService.add({ key: 'tst', severity: 'success', sticky: false, summary: successObject.header, detail: successObject.message });
  }
}
