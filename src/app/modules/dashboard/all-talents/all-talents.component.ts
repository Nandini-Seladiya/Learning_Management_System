import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Talent } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-all-talents',
  templateUrl: './all-talents.component.html',
  styleUrls: ['./all-talents.component.scss']
})
export class AllTalentsComponent implements OnInit {

  public talents!: Talent[];

  public mainTabs: MenuItem[] = [];

  public programNames: SelectItem[] = [];

  public mainActiveTab: number = 0;

  public isLoading: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this._generateTabs();
    this.isLoading = true;
    this._getData(false);
  }

  private _generateTabs(): void {
    this.mainTabs = [
      { label: 'All' },
      { label: 'Program Wise' },
      { label: 'Grade Wise' }
    ];
  }

  /**
  * Switching Tabs
  * @param {any} e 
  */
  public mainTabChange(e: any): void {
    this.isLoading = true;
    switch (e.label) {
      case 'All':
        this.mainActiveTab = 0;
        this._getData(false);
        break;
      case 'Program Wise':
        this.mainActiveTab = 1;
        this._getData(true);
        break;
      case 'Grade Wise':
        this.mainActiveTab = 2;
        this._getData(true);
        break;
      default:
        this.mainActiveTab = 0;
        this._getData(false);
        break;
    }
  }

  /**
   * Display All Talents Table
   * @param {boolean} flag 
   */
  private _getData(flag: boolean): void {
    var tempSubscription: Subscription = this._httpService.getAllTalents(flag).subscribe({
      next: (data: Talent[]) => {
        if (this.mainActiveTab == 1)
          [this.talents, this.programNames] = this._dataExtractService.extractProgramNamesForFilter(data);
        else
          this.talents = data
      },
      error: (err: HttpErrorResponse) => {
        this.talents = [];
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