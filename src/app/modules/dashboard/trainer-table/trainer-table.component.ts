import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, FilterService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { fadeInOut, fadeOutIn } from 'src/assets/animations';
import { EndPoints } from 'src/assets/endPoints';
import { Approvals, HTTPCustomError, HTTPSuccessResponse, Trainer } from 'src/assets/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dashboard-trainer-table',
  templateUrl: './trainer-table.component.html',
  styleUrls: ['./trainer-table.component.scss'],
  animations: [fadeInOut, fadeOutIn]

})
export class TrainerTableComponent implements OnInit {

  @Input() trainers!: Trainer[];
  @Input() programNames!: string[];

  @ViewChild('trainersTable') trainersTable!: Table;

  public readonly imageBaseURL: string = environment.backend.baseURL + '/' +EndPoints.IMAGE;
  columnFields: string[] = ['id', 'name', 'email', 'enrolledProgramNames', 'yearOfExperience', 'trainerCRUD'];

  public isSubmitting: boolean = false;

  constructor(
    public router: Router,
    private _confirmationService: ConfirmationService,
    private _filterService: FilterService,
    private _httpService: HttpService,
    public appUI: AppUi,
    private _successResponseService: SuccessResponseService,
    private _errorService: ErrorService,

  ) { }

  ngOnInit(): void {
    this._registerFilters();
  }


  // register custom filters for Primeng table
  private _registerFilters(): void {
    const customProgramWiseFilter = "has-programs";
    this._filterService.register(customProgramWiseFilter, (value: any, filter: any): boolean => {
      console.log(value);
      console.log(filter);
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof value == 'object')
        for (var v in value) {
          if (filter.includes(value[v])) return true;
        }
      return false;
    });
  }

  /**
   * search the provided value in search input and change table structure
   * @param {Event} e 
   */
  public searchValue(e: Event): void {
    this.trainersTable.filterGlobal((e.target as HTMLInputElement).value, 'contains');
  }

  /**
   * delete single trainer
   * @param {string} trainerName 
   * @param {number} trainerID 
   */
  public deleteTrainer(trainerName: string, trainerID: number, index: number): void {
    this.isSubmitting = true;
    
    this._confirmationService.confirm({
      key: 'confirm1',
      message: `Delete Trainer ${trainerName}?`,
      accept: () => this.approveSingle(trainerID, false, index)
    });
  }

  /**
   * approve a single talent
   * @param {number} trainerID
   */
  public approveSingle(trainerID: number, status: boolean, index: number): void {
    console.log(trainerID);
    var obj: Approvals = {
      talents: [trainerID],
      status: status
    }
    var tempSubscription: Subscription = this._httpService.talentApproval(obj).subscribe({
      next: (res: HTTPSuccessResponse) => {
        this._successResponseService.showSuccess(res);
        this.trainers.splice(index, 1);
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isSubmitting = false;
        this._errorService.showError((err.error as HTTPCustomError).message)
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isSubmitting = false
      }
    })
  }
}