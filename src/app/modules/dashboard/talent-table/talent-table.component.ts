import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { fadeInOut, fadeOutIn } from 'src/assets/animations';
import { Approvals, HTTPCustomError, HTTPSuccessResponse, Program, Talent } from 'src/assets/interfaces';
import { FilterService } from 'primeng/api';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error/error.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { EndPoints } from 'src/assets/endPoints';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'dashboard-talent-table',
  templateUrl: './talent-table.component.html',
  styleUrls: ['./talent-table.component.scss'],
  animations: [fadeInOut, fadeOutIn]
})
export class TalentTableComponent implements OnInit {

  @Input() talents!: Talent[];
  @Input() tabValue!: number;
  @Input() programNames!: SelectItem[];

  public readonly imageBaseURL: string = environment.backend.baseURL + '/' + EndPoints.IMAGE;
  public selectionForApprovals: Talent[] = [];

  @ViewChild('talentsTable') talentsTable!: Table;

  columnFields: string[] = ['credentials.id', 'personalDetails.name', 'credentials.email', 'personalDetails.gender'];
  grades: string[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'F'];

  public isApproving: boolean = false;

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
    console.log(this.imageBaseURL);

    this._registerFilters();

    if (this.router.url.includes('all-talents') && this.tabValue == 1) this.columnFields.push('enrolledProgramNames');
    if (this.router.url.includes('all-talents') && this.tabValue == 2) this.columnFields.push('enrolledPrograms');
    if (this.router.url.includes('all-talents')) this.columnFields.push('talentCRUD');
    if (this.router.url.includes('enrollment-approval')) {
      this.columnFields.unshift('checkBoxSelection')
      this.columnFields.push('enrollmentApproval');
    }
    if (this.router.url.includes('talent-approval')) {
      this.columnFields.unshift('checkBoxSelection');
      this.columnFields.push('talentApproval');
    }
  }

  // register custom filters for Primeng table
  private _registerFilters(): void {
    // register programs fitler
    const customProgramWiseFilter = "has-programs";
    this._filterService.register(customProgramWiseFilter, (value: string[], filter: number[]): boolean => {
      var tempFilter: string[] = [];
      for (var i in this.programNames) {
        for (var j in filter) {
          if (this.programNames[i].value == filter[j]) tempFilter.push(this.programNames[i].label!)
        }
      }
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof value == 'object')
        for (var v in value) {
          if (tempFilter.includes(value[v])) return true;
        }
      return false;
    });

    // register grades filter
    const customGradeWiseFilter = "has-grades";
    this._filterService.register(customGradeWiseFilter, (value: Program[], filter: string[]): boolean => {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof value == 'object')
        for (var v in value) {
          if (filter.includes(value[v].grades!.overallGrades!)) return true;
        }
      return false;
    });
  }

  /**
   * search the provided value in search input and change table structure
   * @param {Event} e
   */
  public searchValue(e: Event): void {
    this.talentsTable.filterGlobal((e.target as HTMLInputElement).value, 'contains')
  }

  /**
   * opens delete talent dialog
   * @param {string} talentName
   * @param {number} talentID 
   */
  public deleteTalent(talentName: string, talentID: number, index: number): void {
    this._confirmationService.confirm({
      key: 'confirm1',
      message: `Delete Talent ${talentName}?`,
      accept: () => this.approveSingle(talentID, false, index)
    });
  }

  /**
   * mass approval
   * @param {boolean} status 
   */
  public approveAll(status: boolean): void {
    var talents: number[] = [];
    for (var i in this.talents) {
      talents.push(this.talents[i].credentials.id!);
    }
    var obj: Approvals = {
      talents: talents,
      status: status
    }
    this.isApproving = true;

    var tempSubscription: Subscription = this._httpService.talentApproval(obj).subscribe({
      next: (res: HTTPSuccessResponse) => {
        this._successResponseService.showSuccess(res);
        this.talents = [];
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isApproving = false;
        this._errorService.showError((err.error as HTTPCustomError).message)
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isApproving = false
      }
    })
  }

  // mass rejection
  public rejectAll(): void {
    console.log(this.selectionForApprovals);
  }

  /**
   * approve the selected talents
   * @param {boolean} status 
   */
  public approveSelected(status: boolean): void {
    var talents: number[] = [];
    for (var i in this.selectionForApprovals) {
      talents.push(this.selectionForApprovals[i].credentials.id!);
    }
    var obj: Approvals = {
      talents: talents,
      status: status
    }
    this.isApproving = true;

    var tempSubscription: Subscription = this._httpService.talentApproval(obj).subscribe({
      next: (res: HTTPSuccessResponse) => {
        this.talents = [];
        this._successResponseService.showSuccess(res);
        var tempObservable: Subscription = this._httpService.getTalentApprovalData().subscribe({
          next: (data: Talent[]) => { this.talents = data },
          error: (err) => {
            tempObservable.unsubscribe();
            this.isApproving = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempObservable.unsubscribe();
            this.isApproving = false;
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isApproving = false
        this._errorService.showError((err.error as HTTPCustomError).message)
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isApproving = false;
        this.selectionForApprovals = [];
      }
    })
  }

  /**
   * approve a single talent
   * @param {number} talentID
   */
  public approveSingle(talentID: number, status: boolean, index: number): void {
    console.log(talentID);
    var obj: Approvals = {
      talents: [talentID],
      status: status
    }
    var tempSubscription: Subscription = this._httpService.talentApproval(obj).subscribe({
      next: (res: HTTPSuccessResponse) => {
        this._successResponseService.showSuccess(res);
        this.talents.splice(index, 1);
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isApproving = false;
        this._errorService.showError((err.error as HTTPCustomError).message)
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isApproving = false
      }
    })
  }

}
