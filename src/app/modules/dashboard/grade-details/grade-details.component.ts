import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { Grades, HTTPCustomError, HTTPSuccessResponse, Program, Skills } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-grade-details',
  templateUrl: './grade-details.component.html',
  styleUrls: ['./grade-details.component.scss']
})
export class GradeDetailsComponent implements OnInit {


  isLoading: boolean = false;

  myPrograms!: Skills[];

  myGrade: any;

  avg: number[] = [];

  avgGrade: string[] = [];

  blob: any;

  constructor(
    private _httpService: HttpService,
    public router: Router,
    private _errorService: ErrorService,
    public location: Location,
    private _succesMessageService: SuccessResponseService
  ) { }

  ngOnInit(): void {

    var tempSubscription: Subscription = this._httpService.getProgramGradesDetails(parseInt(this.router.url.split('/').pop()!)).subscribe({
      next: (data: Skills[]) => { this.myPrograms = data; this.getGrades() },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isLoading = false
      }
    })

  }

  getGrades() {
    let sum = 0;
    for (let j = 0; j < this.myPrograms.length; j++) {
      for (let i = 0; i < this.myPrograms[j].subSkills.length; i++) {
        this.myGrade = this.myPrograms[j].subSkills[i].subSkillScore;
        sum += (this.myGrade)
      }
      sum = sum / this.myPrograms[j].subSkills.length;
      this.avg.push(sum);
      sum = 0;
    }

    this.avg.map((e) => {

      if (e > 9) {
        this.avgGrade.push('A+');
      }

      else if (e > 8) {
        this.avgGrade.push('A');
      }

      else if (e > 7) {
        this.avgGrade.push('B+');
      }
      else if (e > 6) {
        this.avgGrade.push('B');
      }
      else if (e > 5) {
        this.avgGrade.push('C+');
      }
      else if (e > 4) {
        this.avgGrade.push('C');
      }
      else {
        this.avgGrade.push('F');
      }
    })
  }
  download() {
    var tempSubscription: Subscription = this._httpService.downloadCertificate(parseInt(this.router.url.split('/').pop()!)).subscribe({
      next: (data: any) => {
        var binaryData = [];
        binaryData.push(data);
        var downloadURL = window.URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }))
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "certificate.pdf";
        link.click();
      },
      error: (err: any) => {
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
      }
    })
  }
}