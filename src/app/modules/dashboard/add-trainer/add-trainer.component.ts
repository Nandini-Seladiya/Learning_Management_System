import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { tap, last, Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { COUNTRIES } from 'src/assets/data/countries';
import { GENDERS } from 'src/assets/data/genders';
import { HTTPCustomError, HTTPSuccessResponse, Trainer } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-add-trainer',
  templateUrl: './add-trainer.component.html',
  styleUrls: ['./add-trainer.component.scss']
})
export class AddTrainerComponent implements OnInit {

  public countries: string[] = COUNTRIES;
  public gender: MenuItem[] = GENDERS;
  public isSubmitting: boolean = false;
  public isLoading: boolean = false;
  public isEditForm: boolean = false;

  public addTrainerForm!: FormGroup;

  public isProfileUploading: boolean = false;
  public profileImageProgressStatus: number = 0;
  public profileImageLink: string = '';

  public pageTitle: string;
  public trainerDetails!: Trainer

  constructor(
    private fb: FormBuilder,
    private _httpService: HttpService,
    private _router: Router,
    public location: Location,
    private _successResponseService: SuccessResponseService,
    private _errorService: ErrorService
  ) {
    this.pageTitle = (this._router.url.includes('edit')) ? 'Edit Trainer' : 'Add New Trainer';
  }

  ngOnInit(): void {
    this.isLoading = true;
    
    if (this._router.url.includes('edit') && localStorage.getItem('userType') == 'Admin') {
      this.isEditForm = true;
      var tempObservable: Subscription = this._httpService.getTrainerDetailsAdmin(parseInt(this._router.url.split('/').pop()!)).subscribe({
        next: (data: Trainer) => { this.trainerDetails = data; },
        error: (err: HttpErrorResponse) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => { 
          this.isLoading = false; this.addTrainerForm = this._buildForm(this.trainerDetails); 
          tempObservable.unsubscribe()
           }
      });
    }

    else if (this._router.url.includes('/profile/edit-trainer') && localStorage.getItem('userType') == 'Trainer') {
      
      this.isEditForm = true;
      var tempObservable: Subscription = this._httpService.getTrainerDetailsProfile().subscribe({
        next: (data: Trainer) => { this.trainerDetails = data; },
        error: (err: HttpErrorResponse) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message)
        },
        complete: () => { 
          this.isLoading = false; this.addTrainerForm = this._buildForm(this.trainerDetails); 
          tempObservable.unsubscribe()
           }
      });
    }

    else {
      this.addTrainerForm = this._buildForm();
      this.isLoading = false;
    }
  }

  /**
   * Creates Add Trainer Form
   * @param {Trainer} data 
   * @returns {FormGroup}
   */
  private _buildForm(data?: Trainer): FormGroup {
    if (data) this.profileImageLink = data.profileImage!;
    return this.addTrainerForm = this.fb.group({
      'name': [data ? data.name : '', Validators.required],
      'id': [data ? data.id : ''],
      'countryName': [data ? data.countryName : '', Validators.required],
      'password': [data ? data.password : new Date().getTime()],
      'gender': [data ? data.gender : '', Validators.required],
      'email': [data ? data.email : '', [Validators.required, Validators.email]],
      'yearOfExperience': [data ? data.yearOfExperience : '', Validators.required],
      'profileImage': [data ? data.profileImage : '', Validators.required],
      'age': [data ? data.age : '', [Validators.required]],
      'linkedInProfileLink': [data ? data.linkedInProfileLink : '', [Validators.required, Validators.pattern(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/)]],
      'recordedVideoLink': [data ? data.recordedVideoLink : '', [Validators.required, Validators.pattern(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/)]]
    })
  }

  /**
   * Uploads profile picture
   * @param {any} e 
   */
  public onProfilePictureUpload(e: any) {
    this.isProfileUploading = true;
    this.profileImageProgressStatus = 0;
    this._httpService.uploadPicture(e.target.files[0], 102).pipe(
      tap((message: any) => this.profileImageProgressStatus = Math.floor((message.loaded / message.total) * 100)),
      last()
    ).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.isProfileUploading = false;
        this.profileImageLink = e.target.files[0].name;
        this.addTrainerForm.get('profileImage')?.setValue(event.body.link);
      }
    })
  }

  public removeProfilePicture(): void {
    this.profileImageLink = '';
  }

  /**
   * 
   * @param {FormGroup} form 
   */
  addTrainer(form: FormGroup): void {
    if (form.invalid) return;
    this.isSubmitting = true;

    for(var c in form.controls) {
      form.controls[c].disable();
    }

    if (!this.isEditForm)
      var tempSubscription: Subscription = this._httpService.addNewTrainer(form.value as Trainer).subscribe({
        next: (res: HTTPSuccessResponse) => this._successResponseService.showSuccess(res),
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this.isSubmitting = false;
          for(var c in form.controls) {
            form.controls[c].disable();
          }
          this._errorService.showError((err.error as HTTPCustomError).message); this.isLoading = false, this.isSubmitting = false, this.isProfileUploading = false
        },
        complete: () => {
          tempSubscription.unsubscribe();
          this.addTrainerForm.reset();
          this.isLoading = false, this.isSubmitting = false, this.isProfileUploading = false
        }
      });

    else
      var tempSubscription: Subscription = this._httpService.updateTrainer(form.value as Trainer).subscribe({
        next: (res: HTTPSuccessResponse) => this._successResponseService.showSuccess(res),
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isSubmitting = false;
          for(var c in form.controls) {
            form.controls[c].enable();
          }
          this._errorService.showError((err.error as HTTPCustomError).message); this.isLoading = false, this.isSubmitting = false, this.isProfileUploading = false
        },
        complete: () => {
          tempSubscription.unsubscribe();
          this.isLoading = false, this.isSubmitting = false, this.isProfileUploading = false
        }
      });
  }
}
