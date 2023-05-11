import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Program } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-my-grades',
  templateUrl: './my-grades.component.html',
  styleUrls: ['./my-grades.component.scss']
})
export class MyGradesComponent implements OnInit {

  public programs!: Program[];
  public isLoading: boolean = false;
  public trainerNames!: SelectItem[];

  constructor(
    private _httpService: HttpService,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    var tempSubscription: Subscription = this._httpService.getAllProgramsWithGrades().subscribe({
      next: (data: Program[]) => [this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data),
      error: (err: HttpErrorResponse) => {
        this.programs = [];
        tempSubscription.unsubscribe();
        this.isLoading = false;
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => { tempSubscription.unsubscribe(); this.isLoading = false }
    });
  }


}
