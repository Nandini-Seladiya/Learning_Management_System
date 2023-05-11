import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { DataExtractService } from 'src/app/services/data-extract/data-extract.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { GENDERS } from 'src/assets/data/genders';
import { LANGUAGES } from 'src/assets/data/languages';
import { DEGREES } from 'src/assets/data/nameOfDegree';
import { UNIVERSITIES } from 'src/assets/data/nameOfUniversity';
import { SKILL_SPECIALIZATION } from 'src/assets/data/skillSpecialization';
import { EndPoints } from 'src/assets/endPoints';
import { Location } from '@angular/common';
import { Talent, SignUpMetaData, Program, HTTPCustomError, Trainer } from 'src/assets/interfaces';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dashboard-view-profile-trainer',
  templateUrl: './view-profile-trainer.component.html',
  styleUrls: ['./view-profile-trainer.component.scss']
})
export class ViewProfileTrainerComponent implements OnInit {

  public isLoading: boolean = false;

  public readonly languages: SelectItem[] = LANGUAGES;
  public readonly skillSpecialization: String[] = SKILL_SPECIALIZATION;
  public readonly nameOfUniversity: string[] = UNIVERSITIES;
  public readonly nameOfDegree: string[] = DEGREES;
  public readonly genders: SelectItem[] = GENDERS;
  public readonly imageBaseURL: string = environment.backend.baseURL + '/' + EndPoints.IMAGE;

  public trainerData!: Trainer;
  public trainerNames!: SelectItem[];
  public metadata!: SignUpMetaData;
  public programs!: Program[];
  public isError: boolean = false;
  public userType = localStorage.getItem('userType');

  constructor(
    private _httpService: HttpService,
    public router: Router,
    public location: Location,
    public appUI: AppUi,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

    if (localStorage.getItem('userType') == 'Trainer')
      var tempSubscription: Subscription = this._httpService.getTrainerDetailsProfile().subscribe({
        next: (data: Trainer) => { this.trainerData = data; console.log(data) },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log('call done1');
          tempSubscription.unsubscribe();
          this.isLoading = false;
        }
      });

    else
      var tempSubscription: Subscription = this._httpService.getTrainerDetailsAdmin(parseInt(this.router.url.split('/').pop()!)).subscribe({
        next: (data: Trainer) => { this.trainerData = data; console.log(data) },
        error: (err: HttpErrorResponse) => {
          tempSubscription.unsubscribe();
          this.isLoading = false;
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          console.log('call done2');
          tempSubscription.unsubscribe();
          this.isLoading = false;
        }
      });
  }

}
