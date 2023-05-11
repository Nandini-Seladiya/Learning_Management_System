import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Talent } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-talent-approval',
  templateUrl: './talent-approval.component.html',
  styleUrls: ['./talent-approval.component.scss']
})
export class TalentApprovalComponent implements OnInit {

  public talents!: Talent[];

  public isLoading: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    var tempSubscription: Subscription = this._httpService.getTalentApprovalData().subscribe({
      next: (data: Talent[]) => { this.talents = data },
      error: (err: HttpErrorResponse) => {
        this.talents = [];
        this.isLoading = false;
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isLoading = false
      }
    });
  }

}
