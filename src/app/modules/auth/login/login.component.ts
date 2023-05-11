import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPCustomError, HTTPSuccessResponse, Login } from 'src/assets/interfaces';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',],
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
  public isSubmitting1: boolean = false;
  public isSubmitting2: boolean = false;
  public forgetPasswordDialogDisplay: boolean = false;

  public loginForm: FormGroup = this._buildForm('loginForm');
  public forgetPasswordForm: FormGroup = this._buildForm('forgetPasswordForm');

  constructor(
    public appUI: AppUi,
    private _formBuilder: FormBuilder,
    private _successResponseService: SuccessResponseService,
    private _httpService: HttpService,
    private _errorService: ErrorService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * function to build the form
   * @param {string} id will build the form accroding to id: login form or forget password form 
   * @returns {FormGroup} will return new form group
   */
  private _buildForm(id: string): FormGroup {
    if (id == 'loginForm')
      return this._formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
      });
    else return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * function to submit the form
   * @param {FormGroup} formData will take form group to get its data
   * @param {number} formNumber to identify the form
   */
  public formSubmission(formData: FormGroup, formNumber: number) {
    if (formData.invalid) return;

    var obj: Login = {
      email: '',
      password: ''
    };
    for (var c in formData.controls) {
      formData.controls[c].disable();
      obj[c as keyof Login] = formData.controls[c].value;
    }
    console.log(obj);

    formNumber == 1 ? this.isSubmitting1 = true : this.isSubmitting2 = true;



    this.isSubmitting1 = true;
    this.isSubmitting2 = true;

    for (var c in formData.controls) {
      formData.controls[c].enable();
    }

    if (formNumber == 1)
      var tempSubscription1: Subscription = this._httpService.getTalnetApprovalStatus(obj.email).subscribe({
        next: (status: boolean) => {

          if (status)
            var tempSubscription: Subscription = this._httpService.userLogin(obj).subscribe({
              next: (res: any) => {
                console.log(res);
                this._successResponseService.showSuccess(res);
                if (res.isLogin) {
                  localStorage.setItem('isLoggedIn', 'true');
                  localStorage.setItem('token', res.token!);
                  localStorage.setItem('userType', res.type!);
                  (res.type == 'Talent') ? this._router.navigate(['/']) : this._router.navigate(['/dashboard/home']);
                }
              },
              error: (err: any) => {
                tempSubscription.unsubscribe();
                this._errorService.showError((err.error as HTTPCustomError).message);
              },
              complete: () => {
                this.isSubmitting1 = false;
                this.isSubmitting2 = false;
                tempSubscription.unsubscribe();
              }
            })

          else this._router.navigate(['/auth/approval-acknowledgement'])

        },
        error: (err: any) => {
          tempSubscription1.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          this.isSubmitting1 = false;
          this.isSubmitting2 = false;
          tempSubscription1.unsubscribe();
        }
      })

    if (formNumber == 2)
      var tempSubscription: Subscription = this._httpService.sendResetPasswordLink(obj).subscribe({
        next: (res: any) => {
          console.log(res);
          this._successResponseService.showSuccess(res);
        },
        error: (err: any) => {
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          this.isSubmitting1 = false;
          this.isSubmitting2 = false;
          this.forgetPasswordDialogDisplay = false;
          tempSubscription.unsubscribe();
        }
      })

  }
}
