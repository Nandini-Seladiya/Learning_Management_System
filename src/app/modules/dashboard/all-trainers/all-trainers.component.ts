import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPCustomError, Talent, Trainer } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-all-trainers',
  templateUrl: './all-trainers.component.html',
  styleUrls: ['./all-trainers.component.scss']
})
export class AllTrainersComponent implements  OnInit {

  public trainers!: Trainer[];

  public programNames: string[] = [];

  public isLoading: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;

      var tempSubscription: Subscription = this._httpService.getAllTrainers().subscribe({
        next: (data: Trainer[]) => {
            this.trainers = this._generateProgramWiseData(data);
        },
        error: (err: HttpErrorResponse) => {
          this.trainers = [];
          this.isLoading = false;
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => { 
          tempSubscription.unsubscribe();
          this.isLoading = false }
      });
  }

  /**
   * 
   * @param {Trainer[]} data 
   * @returns {Trainer[]}
   */
  private _generateProgramWiseData(data: Trainer[]): Trainer[] {
    for (var i in data) {
      var enrolledProgramsNames = [];
      for (var j = 0; j < data[i].programs!?.length; j++) {
        if (!this.programNames.includes(data[i].programs![j].name)) this.programNames.push(data[i].programs![j].name)
        enrolledProgramsNames.push(data[i].programs![j].name)
      }
      data[i].enrolledProgramNames = enrolledProgramsNames;
    }
    return data;
  }

}
