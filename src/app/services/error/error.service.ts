import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private _messageService: MessageService
  ) { }

  /**
   * Adding error message when error occurs
   * @param {string} message 
   */
  public showError(message: string):void {
    this._messageService.add({ key: 'tst', severity: 'error', sticky: false, summary: 'Error', detail: message });
  }
}
