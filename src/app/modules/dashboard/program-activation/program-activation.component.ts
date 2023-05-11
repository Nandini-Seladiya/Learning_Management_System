import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Program, ProgramTracking } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-program-activation',
  templateUrl: './program-activation.component.html',
  styleUrls: ['./program-activation.component.scss']
})
export class ProgramActivationComponent implements OnInit {

  public programs!: Program[];
  public trainerNames!: SelectItem[];
  public flags!: ProgramTracking;

  public mainTabs: MenuItem[] = [];

  public mainActiveTab: number = 0;

  public isLoading: boolean = false;

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
    this._getScheduledPrograms(this.flags);
  }

  /**
   * 
   * @param {ProgramTracking} flags 
   */
  private _getScheduledPrograms(flags: ProgramTracking): void {
    var tempSubscription: Subscription = this._httpService.getAllPrograms(2, flags).subscribe({
      next: (data: Program[]) => { [this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data) },
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
      { label: 'Active' },
      { label: 'Intermittent' },
    ];
  }

  /**
   * Switching between program categories
   * @param {any} e 
   */
  public mainTabChange(e: any): void {
    this.isLoading = true;
    switch (e.label) {
      case 'Active':
        this.mainActiveTab = 0;
        this.flags = {
          active: true,
          started: true,
          ended: false
        }
        this._getScheduledPrograms(this.flags);
        break;
      case 'Intermittent':
        this.mainActiveTab = 1;
        this.flags = {
          active: true,
          started: false,
          ended: false
        }
        this._getScheduledPrograms(this.flags);
        break;

      default:
        // this.mainActiveTab = 0;
        // this.flags = {
        //   active: true,
        //   started: true,
        //   ended: false
        // }
        // this._getScheduledPrograms(this.flags);
        break;
    }
  }

}