import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../services/error/error.service';
import { HTTPCustomError } from 'src/assets/interfaces';
import { WarningService } from '../services/warning/warning.service';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestInterceptor implements HttpInterceptor {

  constructor(
    private _warningService: WarningService,
    private _errorService: ErrorService

  ) { }

  /**
   * 
   * @param {HttpRequest<any>} request 
   * @param {HttpHandler} next 
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    if(localStorage.getItem('token')) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        url: `${environment.backend.baseURL}/${request.url}`
      })
    }
    else {
      request = request.clone({
        url: `${environment.backend.baseURL}/${request.url}`
      })
    }

    console.log(request.url);
    

    if (!window.navigator.onLine) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            new HttpErrorResponse({ error: error.name, statusText: error.message });
            this._warningService.showNoInternet();
          })
        }
        )) as Observable<HttpEvent<unknown>>
    }
    
    else {
      return next.handle(request).pipe(timeout(15000), retry(2),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => {
            new HttpErrorResponse({ error: error.name, statusText: error.message });
            this._errorService.showError(error.message)
          })
        })) as Observable<HttpEvent<unknown>>
    }
  }
}
