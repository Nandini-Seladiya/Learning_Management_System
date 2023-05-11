import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, FilterService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { fadeInOut, fadeOutIn } from 'src/assets/animations';
import { HTTPCustomError, HTTPSuccessResponse, Program, ProgramScheduling, Trainer } from 'src/assets/interfaces';
import { EndPoints } from 'src/assets/endPoints';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error/error.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dashboard-program-table',
  templateUrl: './program-table.component.html',
  styleUrls: ['./program-table.component.scss'],
  animations: [fadeInOut, fadeOutIn]
})
export class ProgramTableComponent implements OnInit {

  @Input() programs!: Program[];
  @Input() trainerNames!: SelectItem[];
  @Input() masterTab!: boolean;

  @ViewChild('programsTable') programsTable!: Table;

  // current date for validation purpose
  public readonly today = new Date();
  public readonly imageBaseURL: string = environment.backend.baseURL + '/' + EndPoints.IMAGE;

  // form UI & dialog related activities 
  public isSubmitting: boolean = false;
  public allowLink: boolean = false;
  public processingProgram!: number
  public programPublicationFormDisplay: boolean = false;
  public programActivationFormDisplay: boolean = false;
  public programPublicationForm: FormGroup = this._buildForm('programPublicationForm');
  public programActivationForm: FormGroup = this._buildForm('programActivationForm');
  public userType: string | null = localStorage.getItem('userType');

  // table's columns for search purpose
  public columnFields: string[] = ['id', 'name', 'trainers', 'trainerNames', 'skillsList', 'dateRange'];

  constructor(
    public router: Router,
    private _confirmationService: ConfirmationService,
    private _filterService: FilterService,
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _successResponseService: SuccessResponseService,
    private _errorService: ErrorService,
    public appUI: AppUi
  ) { }

  ngOnInit(): void {

    // register trainers fitler
    this._filterRegistration();

    // logic to control columns in table
    if (this.router.url.includes('my-programs') || this.router.url.includes('my-grades') || this.router.url.includes('program-activation') || this.router.url.includes('talent-evaluation')) this.columnFields.push('dateRange');
    if (this.router.url.includes('talent-evaluation')) this.columnFields.push('evaluate');
    if (this.router.url.includes('program-activation')) this.columnFields.push('activation');
    if (this.router.url.includes('program-publication')) {
      this.columnFields.unshift('publication');
      this.columnFields.splice(this.columnFields.indexOf('trainers'), 1);
      this.columnFields.splice(this.columnFields.indexOf('trainerNames'), 1);
    }
    if (this.router.url.includes('all-programs')) {
      this.allowLink = false;
      this.columnFields.push('programCRUD');
      this.columnFields.splice(this.columnFields.indexOf('trainers'), 1);
      this.columnFields.splice(this.columnFields.indexOf('dateRange'), 1);
      this.columnFields.splice(this.columnFields.indexOf('trainerNames'), 1);
    }
    if (this.router.url.includes('my-grades')) {
      this.columnFields.push('viewGrades');
      this.columnFields.push('overallGrades');
    }
    if (this.router.url.includes('history')) this.allowLink = true;

  }

  // to detect changes form parent component and change columns accordingly
  ngOnChanges() {
    if (this.router.url.includes('program-publication')) {
      if (this.masterTab) {
        this.allowLink = false;
        this.columnFields.splice(this.columnFields.indexOf('trainers'), 1);
        this.columnFields.splice(this.columnFields.indexOf('trainerNames'), 1);
        this.columnFields.splice(this.columnFields.indexOf('dateRange'), 1);
      }
      else {
        this.allowLink = true;
        this.columnFields.push('dateRange');
        this.columnFields.push('trainers');
        this.columnFields.push('trainerNames');
      }
    }
  }

  // filter registration to work with Primeng table
  private _filterRegistration(): void {
    const customProgramWiseFilter = "has-trainer";
    this._filterService.register(customProgramWiseFilter, (value: string[], filter: number[]): boolean => {
      var tempFilter: string[] = [];
      for (var i in this.trainerNames) {
        for (var j in filter) {
          if (this.trainerNames[i].value == filter[j]) tempFilter.push(this.trainerNames[i].label!)
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
  }

  /**
   * @param {Table} table 
   */
  clear(table: Table) {
    table.clear();
  }

  /**
   * search the provided value in search input and change table structure
   * @param {Event} e 
   */
  public searchValue(e: Event): void {
    this.programsTable.filterGlobal((e.target as HTMLInputElement).value, 'contains')
  }

  /**
   * open the modal for deleting the program
   * @param {string} programName 
   * @param {number} programID 
   */
  public deleteProgram(programName: string, programID: number, index: number): void {
    this._confirmationService.confirm({
      key: 'confirm1',
      message: `Delete Program ${programName}?`,
      accept: () => {
        var tempSubscription: Subscription = this._httpService.deleteProgram(programID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.programs.splice(index, 1);
          },
          error: (err: HttpErrorResponse) => {
            tempSubscription.unsubscribe();
            this._errorService.showError((err.error as HTTPCustomError).message)
          }
        })
      }
    });
  }

  /**
   * open the modal for publishing the program with provided id
   * @param {number} programID 
   */
  public publishProgram(programID: number, i: number): void {
    this.programPublicationForm.get('id')?.setValue(programID);
    this.processingProgram = i;
    this.programPublicationFormDisplay = true;
  }

  public activateProgram(programID: number, i: number): void {
    this.programActivationForm.get('id')?.setValue(programID);
    this.processingProgram = i;
    this.programActivationFormDisplay = true;
  }

  /**
   * 
   * @param {number} programID 
   * @param {number} type 
   * @param {number} i 
   */
  public programScheduleCancel(programID: number, type: number, i: number) {
    this.processingProgram = i;
    if (type == 1) {
      var tempSubscription: Subscription = this._httpService.programUnpublish(programID).subscribe({
        next: (res: HTTPSuccessResponse) => {
          this._successResponseService.showSuccess(res);
          this.programs.splice(this.processingProgram, 1);
        },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => {
          this.isSubmitting = false;
          tempSubscription.unsubscribe();
        }
      })
    }
    if (type == 2) {
      var tempSubscription: Subscription = this._httpService.programEnd(programID).subscribe({
        next: (res: HTTPSuccessResponse) => {
          this._successResponseService.showSuccess(res);
          this.programs.splice(this.processingProgram, 1);
        },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => {
          this.isSubmitting = false;
          tempSubscription.unsubscribe();
        }
      })
    }
  }

  /**
   * builds the form according to passed id
   * @param {string} id 
   * @returns {FormGroup} 
   */
  private _buildForm(id: string): FormGroup {
    if (id == 'programPublicationForm')
      return this._formBuilder.group({
        trainerID: [[], Validators.required],
        programDates: [[], Validators.required],
        id: [[], Validators.required],
      });
    else return this._formBuilder.group({
      numberOfAttendees: [0, [Validators.required]],
      id: [Validators.required]
    });
  }

  /**
   * Form submission for publishing or activating program
   * @param {FormGroup} formData 
   * @param {number} formNumber 
  */
  public formSubmission(formData: FormGroup, formNumber: number): void {
    if (formData.invalid) return;

    this.isSubmitting = true;

    var obj: ProgramScheduling = {
      trainers: [],
      id: undefined,
      startDate: "",
      endDate: "",
      trackingId: undefined,
      totalAttendees: 0
    };

    for (var c in formData.controls) {
      formData.controls[c].disable();
    }

    if (formNumber == 1) {
      obj.trainers = this.programPublicationForm.get('trainerID')?.value;
      obj.id = this.programPublicationForm.get('id')?.value;
      obj.startDate = formatDate(this.programPublicationForm.get('programDates')?.value[0], 'MMMM d, y', 'en-US');
      obj.endDate = formatDate(this.programPublicationForm.get('programDates')?.value[1], 'MMMM d, y', 'en-US');
      var tempSubscription: Subscription = this._httpService.programPublish(obj).subscribe({
        next: (res: HTTPSuccessResponse) => {
          this._successResponseService.showSuccess(res);
          formData.reset();
          this.programPublicationFormDisplay = false;
        },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => {
          this.isSubmitting = false;
          tempSubscription.unsubscribe();
        }
      });


    }
    if (formNumber == 2) {
      obj.trackingId = this.programActivationForm.get('id')?.value;
      obj.totalAttendees = this.programActivationForm.get('numberOfAttendees')?.value;
      var tempSubscription: Subscription = this._httpService.programStart(obj).subscribe({
        next: (res: HTTPSuccessResponse) => {
          this._successResponseService.showSuccess(res);
          formData.reset();
          this.programActivationFormDisplay = false;
          this.programs.splice(this.processingProgram, 1);
        },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => {
          this.isSubmitting = false;
          tempSubscription.unsubscribe();
        }
      });

    }
  }
}
