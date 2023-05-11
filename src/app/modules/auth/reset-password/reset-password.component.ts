import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPCustomError } from 'src/assets/interfaces';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ResetPasswordComponent implements OnInit {

  public isSubmitting: boolean = false;

  @Input() public token!: string;

  public passwordResetForm: FormGroup = this._buildForm();

  constructor(
    public appUI: AppUi,
    private _formBuilder: FormBuilder,
    private _toastService: MessageService,
    private _router: Router,
    private _successResponseService: SuccessResponseService,
    private _httpService: HttpService,
    private _errorService: ErrorService,  ) { }

  ngOnInit(): void {
    console.log(this.token);
  }

  /**
   * will create password reset form
   * @returns {FormGroup} built form
   */
  private _buildForm(): FormGroup {
    return this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  /**
   * submit the password reset form
   * @param {FormGroup} formData for getting data of form
   */
  public formSubmission(formData: FormGroup) {
    if (formData.invalid) return;
    if (this.passwordResetForm.get('password')?.value !== this.passwordResetForm.get('confirmPassword')?.value) {
      this.passwordResetForm.get('confirmPassword')?.setErrors({ passwordMatch: false });
      return;
    }
    var obj: any = {};
    this.isSubmitting = true;
    for (var c in formData.controls) {
      formData.controls[c].disable();
      if (c !== 'confirmPassword')
        obj[c] = formData.controls[c].value;
    }
    obj.token = this.token;
    console.log(obj);


    var tempSubscription: Subscription = this._httpService.resetPassword(obj, this.token).subscribe({
      next: (res: any) => {
        this._successResponseService.showSuccess(res);
      },
      error: (err: any) => {
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        this._router.navigate(['/auth/login']);
        this.isSubmitting = false;
        tempSubscription.unsubscribe();
      }
    })
  }
}
