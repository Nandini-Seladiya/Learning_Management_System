import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { fadeInOut, fadeOutIn } from 'src/assets/animations';
import { HTTPCustomError, HTTPSuccessResponse, Settings, SettingsChange, SignUpMetaData, SignUpMetaDataDetail, Skills } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeInOut, fadeOutIn]
})
export class SettingsComponent implements OnInit {

  public updateFieldDialogIndex = -1;
  public isLoading: boolean = false;
  public isSubmitting: boolean = false;
  public noDataAvailable: boolean = false;
  public settingsData: Settings = {
    skillsList: [],
    signUpMetadata: {
      currentProfessionalStatus: [],
      industryType: [],
      experienceInIT: [],
      fieldSpecialization: [],
      skills: []
    }
  };
  public settingsTabs: string[] = ['currentProfessioanlDetails', 'industryType', 'experienceInIT', 'fieldSpecialization', 'skills'];
  public displayUpdateDialog: boolean = false;
  public updateForm!: FormGroup;

  constructor(
    private _httpService: HttpService,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _successResponseService: SuccessResponseService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this._getData();
  }

  private _getData(): void {
    var tempSubscription: Subscription = this._httpService.getSettingsData().subscribe({
      next: (data: (SignUpMetaData | Skills[])[]) => { this.settingsData.signUpMetadata = data[0] as SignUpMetaData; this.settingsData.skillsList = data[1] as Skills[]; console.log(this.settingsData) },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.noDataAvailable = true;
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isLoading = false
      }
    })
  }

  /**
   * 
   * @param {SignUpMetaDataDetail} data 
   * @param {number} index 
   */
  public valueUpdate(data: SignUpMetaDataDetail, index: number): void {
    this.displayUpdateDialog = true;
    this.updateFieldDialogIndex = index;
    this.updateForm = this._buildForm(data);
  }

  /**
   * 
   * @param {SignUpMetaDataDetail} data 
   * @returns {FormGroup}
   */
  private _buildForm(data: SignUpMetaDataDetail): FormGroup {
    return this._formBuilder.group({
      name: [data.label, [Validators.required]],
      id: [data.value, [Validators.required]],
    })
  }

  /**
   * Adding the chips
   * @param {string} value 
   * @param {number} i 
   * @param {number} id 
   */
  public addToChips(value: string, i: number, id?: number,) {
    this.isSubmitting = true;
    let newChipToSubmit: SettingsChange = {
      name: (i !== 5 && i !== 6) ? value : undefined,
      skillName: (i == 5) ? value : undefined,
      skillId: (i == 6) ? id! : undefined,
      subSkillName: (i == 6) ? value : undefined
    }
    switch (i) {
      case 0:
        var tempSubscription: Subscription = this._httpService.addCurrentProfessionalStatus(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this.settingsData.signUpMetadata.currentProfessionalStatus.push(data);
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 1:
        var tempSubscription: Subscription = this._httpService.addIndustryType(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this.settingsData.signUpMetadata.industryType.push(data);
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 2:
        var tempSubscription: Subscription = this._httpService.addExperienceInIT(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this.settingsData.signUpMetadata.experienceInIT.push(data);
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 3:
        var tempSubscription: Subscription = this._httpService.addFieldSpecialization(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this.settingsData.signUpMetadata.fieldSpecialization.push(data);
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 4:
        var tempSubscription: Subscription = this._httpService.addSkill(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this.settingsData.signUpMetadata.skills.push(data);
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 5:
        var tempSubscription: Subscription = this._httpService.addMainSkill(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this._getData();
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 6:
        var tempSubscription: Subscription = this._httpService.addSubSkill(newChipToSubmit).subscribe({
          next: (data: SignUpMetaDataDetail) => {
            this._getData();
            this._messageService.add({ key: 'tst', severity: 'success', sticky: true, summary: 'Added', detail: 'Value added successfully' });
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
    }
    this.isSubmitting = false;
  }

  /**
   * Deleting the chips
   * @param {number} e 
   * @param {number} chipID 
   * @param {number} index 
   */
  public removeChip(e: number, chipID: number, index: number) {
    switch (index) {
      case 0:
        var tempSubscription: Subscription = this._httpService.deleteCurrentProfessionalStatus(chipID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.settingsData.signUpMetadata.currentProfessionalStatus.splice(e, 1);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 1:
        var tempSubscription: Subscription = this._httpService.deleteIndustryType(chipID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.settingsData.signUpMetadata.industryType.splice(e, 1);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 2:
        var tempSubscription: Subscription = this._httpService.deleteExperienceInIT(chipID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.settingsData.signUpMetadata.experienceInIT.splice(e, 1);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 3:
        var tempSubscription: Subscription = this._httpService.deleteFieldSpecialization(chipID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.settingsData.signUpMetadata.fieldSpecialization.splice(e, 1);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => { this.isLoading = false }
        })
        break;
      case 4:
        var tempSubscription: Subscription = this._httpService.deleteSkill(chipID).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this._successResponseService.showSuccess(res);
            this.settingsData.signUpMetadata.skills.splice(e, 1);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
    }
  }

  /**
   * Updating the form before submitting
   * @param {FormGroup} form 
   */
  public updateFormSubmission(form: FormGroup): void {
    if (form.invalid) return;
    this.isSubmitting = true;
    var newChipToSubmit: SettingsChange = {
      name: form.get('name')?.value
    }
    switch (this.updateFieldDialogIndex) {
      case 0:
        var tempSubscription: Subscription = this._httpService.updateCurrentProfessionalStatus(newChipToSubmit, form.get('id')?.value).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this.settingsData.signUpMetadata.currentProfessionalStatus.map((d) => { if (form.get('id')?.value == d.value) d.label = form.get('name')?.value });
            this._successResponseService.showSuccess(res);
          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 1:
        var tempSubscription: Subscription = this._httpService.updateIndustryType(newChipToSubmit, form.get('id')?.value).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this.settingsData.signUpMetadata.industryType.map((d) => { if (form.get('id')?.value == d.value) d.label = form.get('name')?.value });
            this._successResponseService.showSuccess(res);

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 2:
        var tempSubscription: Subscription = this._httpService.updateExperienceInIT(newChipToSubmit, form.get('id')?.value).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this.settingsData.signUpMetadata.experienceInIT.map((d) => { if (form.get('id')?.value == d.value) d.label = form.get('name')?.value });
            this._successResponseService.showSuccess(res);

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 3:
        var tempSubscription: Subscription = this._httpService.updateFieldSpecialization(newChipToSubmit, form.get('id')?.value).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this.settingsData.signUpMetadata.fieldSpecialization.map((d) => { if (form.get('id')?.value == d.value) d.label = form.get('name')?.value });
            this._successResponseService.showSuccess(res);

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
      case 5:
        var tempSubscription: Subscription = this._httpService.updateMainSkill(newChipToSubmit, form.get('id')?.value).subscribe({
          next: (res: HTTPSuccessResponse) => {
            this.settingsData.signUpMetadata.skills.map((d) => { if (form.get('id')?.value == d.value) d.label = form.get('name')?.value });
            this._successResponseService.showSuccess(res);

          },
          error: (err) => {
            tempSubscription.unsubscribe();
            this.isLoading = false;
            this._errorService.showError((err.error as HTTPCustomError).message)
          },
          complete: () => {
            tempSubscription.unsubscribe();
            this.isLoading = false
          }
        })
        break;
    }

    this.isSubmitting = false;
    this.displayUpdateDialog = false;
  }
}
