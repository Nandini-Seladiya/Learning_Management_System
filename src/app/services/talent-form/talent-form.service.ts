import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem, MenuItem } from 'primeng/api';
import { tap, last, Subscription } from 'rxjs';
import { HTTPSuccessResponse, SignUpMetaData, Talent, TalentEducationalDetails } from 'src/assets/interfaces';
import { HttpService } from '../http/http.service';
import { MessageService } from 'primeng/api';
import { COUNTRIES } from 'src/assets/data/countries';
import { LANGUAGES } from 'src/assets/data/languages';
import { GENDERS } from 'src/assets/data/genders';
import { DEGREES } from 'src/assets/data/nameOfDegree';
import { UNIVERSITIES } from 'src/assets/data/nameOfUniversity';
import { SKILL_SPECIALIZATION } from 'src/assets/data/skillSpecialization';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SuccessResponseService } from '../success-response/success-response.service';


@Injectable()
export class TalentFormService {

  public isSubmitting: boolean = false;

  // basic properties
  public experienceLevel: number | undefined = 0;
  public eduControls!: any;

  // profile pic upload
  public isProfileUploading: boolean = false;
  public profileImageProgressStatus: number = 0;
  public profileImageLink: string | undefined = '';

  // array of forms of all steps
  public signUpForms: FormGroup[] = [];

  // factory defaluts
  public readonly countries: string[] = COUNTRIES;
  public readonly languages: SelectItem[] = LANGUAGES;
  public readonly skillSpecialization: String[] = SKILL_SPECIALIZATION
  public readonly nameOfUniversity: string[] = UNIVERSITIES
  public readonly nameOfDegree: string[] = DEGREES
  public readonly genders: SelectItem[] = GENDERS

  public readonly formStpes: MenuItem[] = [
    { label: 'Personal Details' },
    { label: 'Professional Details' },
    { label: 'Educational Details' },
    { label: 'Expectations & Other Details' },
    { label: 'Credentials' }
  ]

  // data from API
  public signUpFormBuildingData!: SignUpMetaData;
  public userData!: Talent;


  constructor(
    private _formBuilder: FormBuilder,
    private _httpService: HttpService,
    private _toastService: MessageService,
    private _router: Router,
    private _recaptchaService: ReCaptchaV3Service,
    private _successResponseService: SuccessResponseService
  ) { }

  /**
   * Builds form for editing talent if data exists or else builds an empty form
   * @param {SignUpMetaData} signUpMetadata 
   * @param {Talent} talentData 
   * @returns {FormGroup[]}
   */
  public buildSignUpForm(signUpMetadata: SignUpMetaData, talentData?: Talent): FormGroup[] {

    console.log(signUpMetadata, talentData);

    this.signUpFormBuildingData = signUpMetadata;
    if (talentData) this.userData = talentData;

    // form 1: personal details
    var signUpFormOne = this._formBuilder.group({
      name: [this.userData ? this.userData.personalDetails.name : '', [Validators.required]],
      gender: [this.userData ? this.userData.personalDetails.gender : '', [Validators.required]],
      countryName: [this.userData ? this.userData.personalDetails.countryName : '', [Validators.required]],
      age: [this.userData ? this.userData.personalDetails.age : '', [Validators.required, Validators.min(14), Validators.max(60)]],
      knownLanguages: [this.userData ? this.userData.otherDetails?.knownLanguages : [], Validators.required]
    });
    this.signUpForms.push(signUpFormOne);


    // form 2: professional details
    var signUpFormTwo = this._formBuilder.group({
      currentProfessionalStatus: [this.userData ? this.userData.professionalDetails?.currentProfessionalStatus : '', [Validators.required]],
      industryType: [this.userData ? this.userData.professionalDetails?.industryType : '', [Validators.required]],
      yearOfExperience: [this.userData ? this.userData.professionalDetails?.yearOfExperience : '', [Validators.required, Validators.min(0)]],
      skills: [this.userData ? this.userData.professionalDetails?.skills : []],
      currentEmployerName: [this.userData ? this.userData.professionalDetails?.currentEmployerName : '', Validators.required],
      linkedInProfileLink: [this.userData ? this.userData.professionalDetails?.linkedInProfileLink : '', [Validators.required, Validators.pattern(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/)]],
      recordedVideoLink: [this.userData ? this.userData.professionalDetails?.recordedVideoLink : '', [Validators.required, Validators.pattern(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/)]],
      experienceInIT: [this.userData ? this.userData.professionalDetails?.experienceInIT : '', Validators.required],
      experienceLevel: [this.userData ? this.userData.professionalDetails?.experienceLevel! * 20 : 0, Validators.required]
    });
    this.signUpForms.push(signUpFormTwo)


    // form 3: educational details
    var signUpFormThree = this._formBuilder.group({
      educationalData: this._formBuilder.array(this.userData ? [] : [this._createEducationalFields()])
    });
    this.signUpForms.push(signUpFormThree)
    if (this.userData) this._addEducationalDetailGroup(this.userData.educationDetails);
    this.eduControls = this.getEducationalDetailsMainFieldControls();


    // form 4: other details
    var signUpFormFour = this._formBuilder.group({
      fieldSpecialization: [this.userData ? this.userData.otherDetails?.fieldSpecialization : '', Validators.required],
      skillSpecialization: [this.userData ? this.userData.otherDetails?.skillSpecialization : '', Validators.required],
      profileImage: [this.userData ? this.userData.otherDetails?.profileImage : '', Validators.required],
    });
    this.signUpForms.push(signUpFormFour)


    // set profile image link
    this.userData ? this.profileImageLink = this.userData.otherDetails?.profileImage : '';

    // setting experience level slider
    this.userData ? this.experienceLevel = this.userData.professionalDetails?.experienceLevel : this.experienceLevel = 0;


    // form 5: credential details
    var signUpFormFive = this._formBuilder.group({
      email: [this.userData ? this.userData.credentials.email : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      id: [this.userData ? this.userData.credentials.id : null]
    });
    this.signUpForms.push(signUpFormFive);

    return this.signUpForms;
  }

  public setExperienceLevel(e: any) {
    this.signUpForms[1].get('experienceLevel')?.setValue(e.value);
    this.experienceLevel = e.value / 20;
  }

  private _createEducationalFields(): FormGroup {
    return this._formBuilder.group({
      nameOfDegree: ['', Validators.required],
      nameOfUniversity: ['', Validators.required],
      yearOfPassing: ['', Validators.required]
    });
  }

  public getEducationalDetailsMainField(): FormArray {
    return this.signUpForms[2].get('educationalData') as FormArray;
  }

  public getEducationalDetailsMainFieldControls() {
    return (this.signUpForms[2].get('educationalData') as FormArray).controls;
  }

  public addEducationalField(): void {
    this.getEducationalDetailsMainField().push(this._createEducationalFields());
  }

  public removeEducationalField(i: number): void {
    this.getEducationalDetailsMainField().removeAt(i);
  }

  /**
   * Creating educational fields dynamically
   * @param {TalentEducationalDetails} educationalData 
   */
  private _createEducationalFieldsWithData(educationalData: TalentEducationalDetails) {
    return this._formBuilder.group({
      nameOfDegree: [educationalData.nameOfDegree, Validators.required],
      nameOfUniversity: [educationalData.nameOfUniversity, Validators.required],
      yearOfPassing: [educationalData.yearOfPassing, Validators.required]
    });
  }

  /**
   * 
   * @param {TalentEducationalDetails[]} educationalData 
   * @returns 
   */
  private _addEducationalDetailGroup(educationalData: TalentEducationalDetails[] | undefined) {
    var educationalFormArray = this.signUpForms[2].get('educationalData') as FormArray
    for (var i = 0; i < educationalData!.length; i++) {
      educationalFormArray.push(this._createEducationalFieldsWithData(educationalData![i]));
    }
    return educationalFormArray;
  }

  /**
   * Uploading function for profile picture
   * @param {Event} e 
   */
  public onProfilePictureUpload(e: Event) {
    this.isProfileUploading = true;
    this.profileImageProgressStatus = 0;

    var tempSubscription: Subscription = this._httpService.uploadPicture((e.target as HTMLInputElement).files![0], 102).pipe(
      tap((message: any) => this.profileImageProgressStatus = Math.floor((message.loaded / message.total) * 100)),
      last()
    ).subscribe((event: HttpResponse<any>) => {
      if (typeof (event) === 'object') {
        console.log(event);
        this.isProfileUploading = false;
        this.profileImageLink = (e.target as HTMLInputElement).files![0].name;
        this.signUpForms[3].get('profileImage')?.setValue(event.body.link);
      }
    })
  }

  public removeProfilePicture(): void {
    this.profileImageLink = '';
    this.signUpForms[3].get('profileImage')?.setValue('');
  }

  // for final submission
  public finalSubmission(): void {
    this.isSubmitting = true;
    console.log('here');

    var tempSubscription: Subscription = this._recaptchaService.execute('importantAction').subscribe({
      next: (token: string) => {
        this.isSubmitting = true;
        console.log('here1');

        this.signUpForms[1].get('experienceLevel')?.setValue(this.signUpForms[1].get('experienceLevel')?.value / 20);

        var talent: any = {};
        for (var i in this.signUpForms) {
          for (var j in this.signUpForms[i].controls) {
            talent[j] = this.signUpForms[i].get(j)?.value;
          }
        }

        if (this._router.url.includes('sign-up'))
          var tempSubscription2: Subscription = this._httpService.addNewTalent(talent).subscribe({
            next: (res) => {
              this._successResponseService.showSuccess(res);
            },
            error: (err: HttpErrorResponse) => {
              tempSubscription2.unsubscribe();
              this._toastService.add({ key: 'tst', severity: 'error', sticky: true, summary: 'Error', detail: err.error.message });
            },
            complete: () => {
              this.isSubmitting = false;
              tempSubscription2.unsubscribe();
              if (this._router.url.includes('sign-up'))
                this._router.navigate(['/auth/login']);
            }
          })

        else
          var tempSubscription2: Subscription = this._httpService.updateTalent(talent).subscribe({
            next: (res: HTTPSuccessResponse) => {
              this._successResponseService.showSuccess(res);
            },
            error: (err: HttpErrorResponse) => {
              tempSubscription2.unsubscribe();
              this._toastService.add({ key: 'tst', severity: 'error', sticky: true, summary: 'Error', detail: err.error.message });
            },
            complete: () => {
              this.isSubmitting = false;
              tempSubscription2.unsubscribe();
            }
          })

        this.signUpForms[1].get('experienceLevel')?.setValue(this.experienceLevel! * 20);
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this._toastService.add({ key: 'tst', severity: 'error', sticky: true, summary: 'Error', detail: err.error.message })
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isSubmitting = false
      }

    });
  }

}
