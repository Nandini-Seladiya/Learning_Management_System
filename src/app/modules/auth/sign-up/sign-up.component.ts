import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';
import { TalentFormService } from 'src/app/services/talent-form/talent-form.service';
import { SignUpMetaData } from 'src/assets/interfaces';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [TalentFormService]
})


export class SignUpComponent implements OnInit {

  public isLoading: boolean = false;
  public activatedIndex: number = 0;

  // array of forms of all steps
  public signUpForms: FormGroup[] = [];

  constructor(
    private _httpService: HttpService,
    public talentFormService: TalentFormService
  ) { }

  ngOnInit(): void {    
    this.isLoading = true;

    var tempObservable = this._httpService.getAllMasterData().subscribe({
      next: (data: SignUpMetaData) => { 
        console.log(data);
        this.signUpForms = this.talentFormService.buildSignUpForm(data) 
      },
      error: (err) => {
        tempObservable.unsubscribe()
        console.log(err)},
      complete: () => { this.isLoading = false; tempObservable.unsubscribe()}
    });
  }

  public nextStep(): void {
    (this.activatedIndex + 1 < 5) ? this.activatedIndex++ : {};
  }

  public previousStep(): void {
    (this.activatedIndex - 1 > -1) ? this.activatedIndex-- : {};
  }
}
