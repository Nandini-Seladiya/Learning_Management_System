import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { Program, ProgramTracking, HTTPCustomError } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public isLoading: boolean = false;
  public programs!: Program[];
  public trainerNames!: SelectItem[];

  constructor(
    private _httpService: HttpService,
    public router: Router,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    const flag: ProgramTracking = {
      history: true,
    }
    var tempSubscription: Subscription = this._httpService.getAllPrograms(1, flag).subscribe({
      next: (data: Program[]) => { [this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data) },
      error: (err: HttpErrorResponse) => {
        this.programs = [];
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
        this.isLoading = false;
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isLoading = false;
      }
    });
  }

}
