import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPCustomError } from 'src/assets/interfaces';

@Component({
  selector: 'auth-token-verification',
  templateUrl: './token-verification.component.html',
  styleUrls: ['./token-verification.component.scss']
})
export class TokenVerificationComponent implements OnInit {

  public token!: string;
  public showResetPassword: boolean = false;
  public isVerifying!: boolean;
  public success!: boolean;
  public redirectSeconds: number = 5;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _successResponseService: SuccessResponseService,
    private _httpService: HttpService,
    private _errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.isVerifying = true;
    this._activatedRoute.params.subscribe((p: any) => {
      this.isVerifying = false;
      this.success = true;
      if (this.success)
        switch (this._router.url.split('/')[2]) {
          case 'email-verification':
            this._emailVerfication(p.token);
            break;
          case 'reset-password':
            this.token = p.token;
            this.showResetPassword = true;
            break;
          default:
            break;
        }
    });
  }

  private _startRedirectCountDown(): void {
    setInterval(() => {
      if (this.redirectSeconds > 1)
        this.redirectSeconds--;
      else this._router.navigate(['/auth/login']);
    }, 1000);
  }

  private _emailVerfication(token: string) {
    var tempSubscription: Subscription = this._httpService.emailVerification(token).subscribe({
      next: (res: any) => {
        console.log(res);
        this._successResponseService.showSuccess(res);
      },
      error: (err: any) => {
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        this.isVerifying = false;
        this._startRedirectCountDown();
        tempSubscription.unsubscribe();
      }
    })
  }
}
