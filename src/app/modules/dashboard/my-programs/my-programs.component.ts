import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Program, ProgramTracking } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-my-programs',
  templateUrl: './my-programs.component.html',
  styleUrls: ['./my-programs.component.scss']
})
export class MyProgramsComponent implements OnInit {

  public programs!: Program[];
  public isLoading: boolean = false;

  public mainTabs: MenuItem[] = [];
  public trainerNames: SelectItem[] = [];

  public mainActiveTab: number = 0;
  public flags: ProgramTracking = {};

  constructor(
    private _httpService: HttpService,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this._generateTabs();

    this.flags = {
      active: true,
      started: true,
      ended: false
    }
    this._getData();
  }

  
  private _getData() {
    if (localStorage.getItem('userType') == 'Trainer')
      var tempSubscription: Subscription = this._httpService.getAllPrograms(2, this.flags).subscribe({
        next: (data: Program[]) => [this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data),
        error: (err: HttpErrorResponse) => {
          this.programs = [];
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => { tempSubscription.unsubscribe(); this.isLoading = false }
      });
    if (localStorage.getItem('userType') == 'Talent')
      var tempSubscription: Subscription = this._httpService.getAllPrograms(3, this.flags).subscribe({
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

  private _generateTabs(): void {

    this.mainTabs = [
      { label: 'On Going' },
      { label: 'Completed' },
      { label: 'Upcoming' },
    ];
  }

  /**
   * Switching between program categories
   * @param {any} e 
   */
  public mainTabChange(e: any): void {
    this.isLoading = true;
    switch (e.label) {
      case 'On Going':
        this.mainActiveTab = 0;
        this.flags = {
          active: true,
          started: true,
          ended: false
        }
        this._getData();
        break;
      case 'Completed':
        this.mainActiveTab = 1;

        this.flags = {
          active: false,
          started: true,
          ended: true
        }
        this._getData();
        break;
      case 'Upcoming':
        this.mainActiveTab = 2;

        this.flags = {
          active: true,
          started: false,
          ended: false
        }
        this._getData();
        break;

      default:
        this.mainActiveTab = 0;
        this.flags = {
          active: true,
          started: false,
          ended: false
        }
        this._getData();
        break;
    }
  }
}
