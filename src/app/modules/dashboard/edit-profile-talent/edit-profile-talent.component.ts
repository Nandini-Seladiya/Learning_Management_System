import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { TalentFormService } from 'src/app/services/talent-form/talent-form.service';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { HTTPCustomError, Program, SignUpMetaData, Talent } from 'src/assets/interfaces';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'dashboard-edit-profile-talent',
  templateUrl: './edit-profile-talent.component.html',
  styleUrls: ['./edit-profile-talent.component.scss'],
  providers: [TalentFormService]
})
export class EditProfileTalentComponent implements OnInit {

  public isLoading: boolean = false;

  // array of forms of all steps
  public signUpForms: FormGroup[] = [];

  constructor(
    private _httpService: HttpService,
    private _errorService: ErrorService,
    public talentFormService: TalentFormService,
    private _router: Router,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    if (localStorage.getItem('userType') == 'Talent')
      var tempObservable: Subscription = this._httpService.getTalentDetailsProfile().subscribe({
        next: (data: (SignUpMetaData | Talent | Program[])[]) => {
          var signUpMetadata: SignUpMetaData = data[0] as SignUpMetaData;
          var talentsData: Talent = data[1] as Talent;
          this.signUpForms = this.talentFormService.buildSignUpForm(signUpMetadata, talentsData);
        },
        error: (err: HttpErrorResponse) => {
          tempObservable.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => { this.isLoading = false; tempObservable.unsubscribe() }
      });
    else 
    var tempObservable = this._httpService.getTalentDetailsAdmin(parseInt(this._router.url.split('/').pop()!)).subscribe({
      next: (data: (SignUpMetaData | Talent | Program[])[]) => {
        var signUpMetadata: SignUpMetaData = data[0] as SignUpMetaData;
        var talentsData: Talent = data[1] as Talent;
        this.signUpForms = this.talentFormService.buildSignUpForm(signUpMetadata, talentsData);
      },
      error: (err: HttpErrorResponse) => {
        tempObservable.unsubscribe();
        this.isLoading = false;
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => { 
        tempObservable.unsubscribe();
        this.isLoading = false; tempObservable.unsubscribe() }
    });

  }
}

