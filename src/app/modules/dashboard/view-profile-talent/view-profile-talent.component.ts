import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { HttpService } from 'src/app/services/http/http.service';
import { GENDERS } from 'src/assets/data/genders';
import { LANGUAGES } from 'src/assets/data/languages';
import { DEGREES } from 'src/assets/data/nameOfDegree';
import { UNIVERSITIES } from 'src/assets/data/nameOfUniversity';
import { SKILL_SPECIALIZATION } from 'src/assets/data/skillSpecialization';
import { HTTPCustomError, Program, SignUpMetaData, Talent } from 'src/assets/interfaces';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { EndPoints } from 'src/assets/endPoints';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dashboard-view-profile-talent',
  templateUrl: './view-profile-talent.component.html',
  styleUrls: ['./view-profile-talent.component.scss']
})
export class ViewProfileTalentComponent {
  public isLoading: boolean = false;

  public readonly languages: SelectItem[] = LANGUAGES;
  public readonly skillSpecialization: String[] = SKILL_SPECIALIZATION;
  public readonly nameOfUniversity: string[] = UNIVERSITIES;
  public readonly nameOfDegree: string[] = DEGREES;
  public readonly genders: SelectItem[] = GENDERS;
  public readonly imageBaseURL: string = environment.backend.baseURL + '/' + EndPoints.IMAGE;
  public userType = localStorage.getItem('userType');

  public talentData!: Talent;
  public trainerNames!: SelectItem[];
  public metadata!: SignUpMetaData;
  public programs!: Program[];
  public isError: boolean = false;

  constructor(
    private _httpService: HttpService,
    public router: Router,
    public location: Location,
    public appUI: AppUi,
    private _dataExtractService: DataExtractService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.router.url.includes('/dashboard/all-talents/'));
    console.log(this.router.url.split('/').pop());

    if (localStorage.getItem('userType') == 'Talent')
      var tempSubscription: Subscription = this._httpService.getTalentDetailsProfile().subscribe({
        next: (data: (SignUpMetaData | Talent | Program[])[]) => { this.metadata = data[0] as SignUpMetaData; this.talentData = data[1] as Talent;[this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data[2] as Program[]); console.log(this.metadata, this.talentData, this.programs); },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log('call done');
          tempSubscription.unsubscribe();
          this.isLoading = false;
        }
      });

    else
      var tempSubscription: Subscription = this._httpService.getTalentDetailsAdmin(parseInt(this.router.url.split('/').pop()!)).subscribe({
        next: (data: (SignUpMetaData | Talent | Program[])[]) => { this.metadata = data[0] as SignUpMetaData; this.talentData = data[1] as Talent;[this.programs, this.trainerNames] = this._dataExtractService.extractTrainerNamesForFilter(data[2] as Program[]); console.log(this.metadata, this.talentData, this.programs); },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log('call done');
          tempSubscription.unsubscribe();
          this.isLoading = false;
        }
      });
  }
}
