import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { EndPoints } from 'src/assets/endPoints';
import { HTTPCustomError, Program, ProgramTracking } from 'src/assets/interfaces';

@Component({
  selector: 'public-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  public allPrograms!: Program[];
  public allUserPrograms!: Program[];
  public isLoading: boolean = false;
  public value: string = "";
  public isLoggedIn: string | null = localStorage.getItem('isLoggedIn');
  public filteredPrograms!: Program[];
  public isLoggingOut: boolean = false;
  public readonly imageBaseURL: string = EndPoints.IMAGE;


  constructor(
    public appUI: AppUi,
    public router: Router,
    private _httpService: HttpService,
    private _errorService: ErrorService,
    private _router: Router,
    private _successResponseService: SuccessResponseService,

  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    // if not logged in
    if (localStorage.getItem('userType') == 'Talent') {
      var tempSubscription: Subscription = this._httpService.getAllPrograms(4).subscribe({
        next: (data: Program[]) => {
          this.allUserPrograms = data;
          this.isLoading = false;
          this.allUserPrograms = this.allUserPrograms.flat(1);
        },
        error: (err: HttpErrorResponse) => {
          this.allUserPrograms = [];
          this.isLoading = false;
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log("call done");
          this.isLoading = false;
          tempSubscription.unsubscribe();
        }
      });
    }

    // if logged in
    else {
      var tempSubscription: Subscription = this._httpService.getAllPrograms(1).subscribe({
        next: (data: Program[]) => {
          console.log(data);

          this.allPrograms = data;
          this.filteredPrograms = data;
          console.log(this.allPrograms);
        },
        error: (err: HttpErrorResponse) => {
          this.allPrograms = [];
          this.isLoading = false;
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log("call done");
          tempSubscription.unsubscribe();
          this.isLoading = false;
        }
      });
    }
  }

  onSearchTextChanged() {
    if (this.value) {
      this.filteredPrograms = this.allPrograms.filter((program) =>
        program.name.toLocaleLowerCase().includes(this.value)
      );
      if (this.filteredPrograms.length == 0) {
        this.filteredPrograms = this.allPrograms;
      }
    } else {
      this.filteredPrograms = this.allPrograms;
    }
  }

  public userLogout(): void {

    this.isLoggingOut = true;
    var tempSubscription: Subscription = this._httpService.userLogout().subscribe({
      next: (res: HttpStatusCode) => {
        console.log('here');
        this._successResponseService.showSuccess({ header: 'Logout', message: 'Logout Successful' });
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        location.reload();
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isLoading = false;
        this._errorService.showError((err.error as HTTPCustomError).message)
      },
      complete: () => {
        this.isLoggingOut = false;
        tempSubscription.unsubscribe();
        console.log('here');
      }
    })
  }
}