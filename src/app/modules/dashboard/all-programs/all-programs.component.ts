import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Program, Trainer } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-all-programs',
  templateUrl: './all-programs.component.html',
  styleUrls: ['./all-programs.component.scss']
})
export class AllProgramsComponent implements OnInit {

  public programs!: Program[];
  public trainerNames!: SelectItem[];

  public isLoading: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    var tempSubscription: Subscription = this._httpService.getMasterProgramsAdmin().subscribe({
      next: (data: (Program[] | Trainer[])[]) => [this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data[0] as Program[]),
      error: (err: HttpErrorResponse) => {
        this.programs = [];
        this.isLoading = false;
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => { 
        tempSubscription.unsubscribe();
        this.isLoading = false }
    });
  }
}
