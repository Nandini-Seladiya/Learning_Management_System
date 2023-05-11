import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { EvaluationMarks, Grades, HTTPCustomError } from 'src/assets/interfaces';
import * as XLSX from 'xlsx';


@Component({
  selector: 'dashboard-talent-evaluation-sheet',
  templateUrl: './talent-evaluation-sheet.component.html',
  styleUrls: ['./talent-evaluation-sheet.component.scss']
})
export class TalentEvaluationSheetComponent implements OnInit {

  @ViewChild('evaluationSheet') evaluationSheet!: Table;
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  public tableData: any[] = [];
  public programID: string = '';
  public isSubmitting: boolean = false;
  public isLoading: boolean = false;
  public firstSubmit: boolean = true;

  public pageTitle: string = this._router.url.includes('history') ? 'Talents' : 'Evaluation';

  public mainColumns: any = [];
  public subColumns: any = [];
  public subColCounts: number[] = [1];
  public displayedColumnsSub: string[] = [];

  constructor(
    private _router: Router,
    public location: Location,
    private _httpService: HttpService,
    private _activatedRoute: ActivatedRoute,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this._activatedRoute.params.subscribe((d: any) => {
      this.programID = d.programID;
    })
    this._getData();
  }

  private _getData() {
    var tempSubscription: Subscription = this._httpService.getTalentEvaluationData(parseInt(this.programID)).subscribe({
      next: (data: Grades[]) => this._generateTable(data),
      error: (err: HttpErrorResponse) => {
        this.tableData = [];
        this.isLoading = false;
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isLoading = false
      }
    });
  }

  /**
   * Creates a talent table based on grades
   * @param {Grades[]} data 
   */
  private _generateTable(data: Grades[]): void {
    var APIData = data;

    this.mainColumns.push({
      name: 'Talent Name',
      id: 'talentName'
    });

    this.subColumns.push({
      name: '',
      id: 'talentName1'
    });

    for (var s in APIData[0].gradeDetails) {
      this.mainColumns.push({
        name: APIData[0].gradeDetails[s].mainSkillName,
        id: APIData[0].gradeDetails[s].mainSkillID
      });
    }

    for (var x in APIData[0].gradeDetails) {
      var count = 0;
      for (var i in APIData[0].gradeDetails[x].subSkills) {
        this.subColumns.push({
          id: APIData[0].gradeDetails[x].subSkills[i].subSkillID,
          name: APIData[0].gradeDetails[x].subSkills[i].subSkillName
        });
        count++;
      }
      this.subColCounts.push(count);
    }

    this.subColumns.map((d: any) => {
      this.displayedColumnsSub.push(d.id);
    })

    for (var x in APIData) {
      var temp: any = {
        talentName1: APIData[x].talentName,
        talentID: APIData[x].talentID
      };
      for (var i in APIData[x].gradeDetails) {
        for (var k in APIData[x].gradeDetails[i].subSkills) {
          temp[APIData[x].gradeDetails[i].subSkills[k].subSkillID] = APIData[x].gradeDetails[i].subSkills[k].subSkillScore;
        }
      }
      this.tableData.push(temp);
    }
    return;
  }

  /**
   * 
   * @param {Event} e 
   * @param {number} talentID 
   * @param {string} c 
   * @param {number} index 
   */
  public updateEvaluation(e: Event, talentID: number, c: string, index: number): void {
    this.isSubmitting = true;
    if (this.firstSubmit) this.firstSubmit = false;

    if (parseInt((e.target as HTMLInputElement).value) > 10 || parseInt((e.target as HTMLInputElement).value) < 0) return;
    var mainSkillID;
    var tempSections: number[] = [];
    this.subColCounts.map((n: number) => {
      if (!tempSections[0])
        tempSections.push(n);
      else
        tempSections.push(tempSections[tempSections.length - 1] + n)
    })

    for (var i = 0; i < tempSections.length; i++) {
      if ((tempSections[i] - 1) >= index) {
        mainSkillID = this.mainColumns[i].id
        break;
      }
    }

    var obj: EvaluationMarks = {
      marks: parseInt((e.target as HTMLInputElement).value),
      talentId: talentID,
      trackingId: parseInt(this.programID),
      subSkillId: parseInt(c)
    }

    var tempSubscription: Subscription = this._httpService.updateTalentGrade(obj).subscribe({
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => {
        tempSubscription.unsubscribe();
        this.isSubmitting = false
      }
    })
  }

  /**
   * 
   * @param {Table} table 
   */
  public clear(table: Table) {
    table.clear();
  }

  /**
   * 
   * @param {Event} e 
   */
  public searchValue(e: Event): void {
    this.evaluationSheet.filterGlobal((e.target as HTMLInputElement).value, 'contains')
  }

  public exportAsExcel() {
    this.tableData = [];
    this._getData();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tableContainer.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'evaluation.xlsx');
  }
}