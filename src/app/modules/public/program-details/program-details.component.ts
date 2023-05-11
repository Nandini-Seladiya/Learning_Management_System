import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { EndPoints } from 'src/assets/endPoints';
import { HTTPCustomError, HTTPSuccessResponse, Program, Skills } from 'src/assets/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'public-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  themeStat: any;
  width!: number;
  headerBgProperty!: string
  isLoading = false;
  isSubmitting: boolean = false;

  public readonly imageBaseURL: string = environment.backend.baseURL + '/' + EndPoints.IMAGE;

  //current program
  programDetails!: Program;

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    public appUI: AppUi,
    private _errorService: ErrorService,
    private _successResponseService: SuccessResponseService
  ) { }

  ngOnInit(): void {
    this.width = window.screen.availWidth;
    this.changeHeaderBackground();
    this._getData();

  }

  private _getData() {
    if (localStorage.getItem('isLoggedIn') && localStorage.getItem('usertype') == 'Talent')
      var tempObservable: Subscription = this._httpService.getProgramDetailsPrivate(parseInt(this._router.url.split('/').pop()!)).subscribe({
        next: (data: (Skills[] | Program | boolean)[]) => {
          this.programDetails = data[1] as Program;
          console.log(data);
          if (this.programDetails.programTracking) this.programDetails.programTracking.isEnrolled = data[2] as boolean;
        },
        error: (err: HttpErrorResponse) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => { console.log('call done'); this.isLoading = false; tempObservable.unsubscribe() }
      });
    else
      var tempObservable: Subscription = this._httpService.getProgramDetailsPublic(parseInt(this._router.url.split('/').pop()!)).subscribe({
        next: (data: (Skills[] | Program)[]) => {
          this.programDetails = data[1] as Program;
          if (this.programDetails.programTracking) this.programDetails.programTracking.isEnrolled = (data[1] as Program).programTracking?.isEnrolled ?? false;
          console.log(data)
        },
        error: (err: HttpErrorResponse) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => { console.log('call done'); this.isLoading = false; tempObservable.unsubscribe() }
      });
  }

  /**
   * 
   * @param {any} btn 
   */
  onEnrollClicked(btn: any) {
    if (!localStorage.getItem('isLoggedIn'))
      this._router.navigate(['/auth/login'])
    else {
      if (this.programDetails.programTracking!.isEnrolled) return;
      else {
        var tempObservable: Subscription = this._httpService.enrollIntoProgram(parseInt(this._router.url.split('/').pop()!)).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            if(this.programDetails.programTracking) this.programDetails.programTracking.isEnrolled = true;
          },
          error: (err: HttpErrorResponse) => {
            tempObservable.unsubscribe();
            this.isSubmitting = false;
            this._errorService.showError((err.error as HTTPCustomError).message);
          },
          complete: () => { this.isSubmitting = false; tempObservable.unsubscribe() }
        });
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = event.target.innerWidth;
    this.changeHeaderBackground();
  }

  changeHeaderBackground() {
    if (this.width > 800) {
      this.headerBgProperty = 'var(--primary-color)'
    } else {
      this.headerBgProperty = `linear-gradient(to right, rgb(0 0 0 / 70%), rgb(255 255 255 / 0%)), url('${this.programDetails.thumbnailImageURL}')`
    }
  }

}