import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { tap, last, Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPCustomError, HTTPSuccessResponse, Program, Skills } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit {

  public isLoading: boolean = false;
  public isSubmitting: boolean = false;
  public isEditForm: boolean = false;
  public programFormData!: Program;
  public settingsMetadata!: any;
  public trainerNames!: SelectItem[];
  public programForm!: FormGroup;
  public durationOptions: any[] = [
    { name: 'Day', value: 'Day' },
    { name: 'Month', value: 'Month' },
    { name: 'Year', value: 'Year' },
  ]
  public isProgramUploading: boolean = false;
  public profileImageProgressStatus: number = 0;
  public profileImageLink: string = '';

  public pageTitle: string;
  public programDetails!: Program

  constructor(
    private _httpService: HttpService,
    private _formBuilder: FormBuilder,
    private _successResponseService: SuccessResponseService,
    private _errorService: ErrorService,
    private _router: Router,
    public location: Location
  ) {
    this.pageTitle = (this._router.url.includes('edit')) ? 'Edit Program' : 'Add New Program';
  }

  ngOnInit(): void {

    // set for edit using routerlink
    this.isLoading = true;

    if (this._router.url.includes('edit')) {
      this.isEditForm = true;
      var tempObservable: Subscription = this._httpService.getMasterProgramDetails(parseInt(this._router.url.split('/').pop()!)).subscribe({
        next: (data: (Skills[] | Program)[]) => { this.settingsMetadata = data[0] as Skills[]; this.programDetails = data[1] as Program; console.log(data) },
        error: (err) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message)},
        complete: () => { this.isLoading = false; this.programForm = this._buildForm(this.programDetails); tempObservable.unsubscribe() }
      });
    }
    else {
      this.isEditForm = false;
      var tempObservable: Subscription = this._httpService.getAddProgramForm().subscribe({
        next: (skills: Skills[]) => { this.settingsMetadata = skills },
        error: (err) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message)},
        complete: () => { this.isLoading = false; this.programForm = this._buildForm(); tempObservable.unsubscribe() }
      });
    }
  }

/**
 * Refills the edit form with stored values
 * @param {Program} data 
 * @returns {FormGroup}
 */
  private _buildForm(data?: Program): FormGroup {
    if (data) this.profileImageLink = data.image!;
    return this._formBuilder.group({
      id: [data ? data.id : null],
      name: [data ? data.name : '', [Validators.required]],
      programDuration: [data ? (data.duration?.split(' ')[0]) : 1, [Validators.required]],
      durationOption: [data ? (data.duration?.split(' ')[1]) : 'Month', [Validators.required]],
      image: [data ? data.image : '', [Validators.required]],
      programOverview: [data ? data.programOverview : '', [Validators.required]],
      subSkillCategories: [data ? data.skillsList : []]
    })
  }

  /**
   * Uploads profile picture
   * @param {any} e 
   */
  public onProgramPictureUpload(e: Event) {
    this.isProgramUploading = true;
    this.profileImageProgressStatus = 0;
    this._httpService.uploadPicture((e.target as HTMLInputElement).files![0], 103).pipe(
      tap((message: any) => this.profileImageProgressStatus = Math.floor((message.loaded / message.total) * 100)),
      last()
    ).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.isProgramUploading = false;
        this.profileImageLink = (e.target as HTMLInputElement).files![0].name;
        this.programForm.get('image')?.setValue(event.body.link);
      }
    })
  }

  public removeProgramPicture(): void {
    this.profileImageLink = '';
  }
  /**
   * 
   * @param {any} e 
   */
  public subSkillSelcted(e: any) {
    
    if (this.programForm.get('subSkillCategories')?.value.length == 0) {
      this.programForm.get('subSkillCategories')?.value.push(e.itemValue.subSkillID);
    }
    else {
      if (this.programForm.get('subSkillCategories')?.value.includes(e.itemValue.subSkillID))
        this.programForm.get('subSkillCategories')?.value.splice(this.programForm.get('subSkillCategories')?.value.indexOf(e.itemValue.subSkillID), 1);
      else this.programForm.get('subSkillCategories')?.value.push(e.itemValue.subSkillID);
    }
  }

  /**
   * 
   * @param {FormGroup} form 
   */
  public programFormSubmission(form: FormGroup): void {
    this.isSubmitting = true;

    for(var c in form.controls) {
      form.controls[c].disable();
    }

    if (!this.isEditForm)
      var tempSubscription: Subscription =  this._httpService.addNewProgram(form.value as Program).subscribe({
        next: (res: HTTPSuccessResponse) => this._successResponseService.showSuccess(res),
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this.isSubmitting = false;
          for(var c in form.controls) {
            form.controls[c].disable();
          }
          this._errorService.showError((err.error as HTTPCustomError).message)},
        complete: () => { 
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this.isSubmitting = false; this.programForm.reset(); this.programForm.get('subSkillCategories')?.setValue([]) }
      })

    else
    var tempSubscription: Subscription =  this._httpService.updateProgram(form.value as Program).subscribe({
        next: (res: HTTPSuccessResponse) => this._successResponseService.showSuccess(res),
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this.isSubmitting = false;
          for(var c in form.controls) {
            form.controls[c].disable();
          }
          this._errorService.showError((err.error as HTTPCustomError).message)},
        complete: () => { 
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this.isSubmitting = false }
      })
  }
}
