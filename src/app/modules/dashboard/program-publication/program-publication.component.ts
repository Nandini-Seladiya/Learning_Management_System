import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Program, Trainer } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-program-publication',
  templateUrl: './program-publication.component.html',
  styleUrls: ['./program-publication.component.scss']
})
export class ProgramPublicationComponent implements OnInit {

  public masterTab: boolean = false;

  public programs!: Program[];
  public trainerNames!: SelectItem[];

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
    this._getScheduledPrograms();
    this._generateTabs();
  }

  private _getMasterPrograms(): void {
    var tempSubscription: Subscription = this._httpService.getMasterProgramsAdmin().subscribe({
      next: (data: (Program[] | Trainer[])[]) => {
        console.log(data);
        this.programs = data[0] as Program[];
        this.trainerNames = this._dataExtractService.exractAllTrainers(data[1] as Trainer[]);
      },
      error: (err: HttpErrorResponse) => {
        this.programs = [];
        tempSubscription.unsubscribe();
        this.isLoading = false;
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => { tempSubscription.unsubscribe(); this.isLoading = false }
    });
  }

  private _getScheduledPrograms(): void {
    var tempSubscription: Subscription = this._httpService.getAllPrograms(1).subscribe({
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
      { label: 'Published' },
      { label: 'Unpublished' },
    ];
  }

  /**
   * Switching between published and unpublised programs
   * @param {any} e 
   */
  public mainTabChange(e: any): void {
    this.isLoading = true;
    switch (e.label) {
      case 'Published':
        this.mainActiveTab = 0;
        this.masterTab = false;
        this._getScheduledPrograms();
        break;
      case 'Unpublished':
        this.mainActiveTab = 1;
        this.masterTab = true;
        this._getMasterPrograms();
        break;

      default:
        this.mainActiveTab = 0;
        this._getScheduledPrograms();
        break;
    }
  }

}
