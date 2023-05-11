import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class WarningService {

  constructor(
    private _messageService: MessageService
  ) { }

  public showWarning():void {
    this._messageService.add({ key: 'tst', severity: 'warn', sticky: true, summary: 'Wait', detail: 'Please wait until current progress completes' });
  }

  public showNoInternet(): void {
    this._messageService.add({ key: 'tst', severity: 'warn', sticky: true, summary: 'No Internet', detail: 'You are not connected to the internet' });
  }
}
