import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import {
  Details,
  DashboardHome,
  BarChartOptions,
  PieChartOptions,
  HomeChart,
  HTTPCustomError,
  AdminChart,
} from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isLoading: boolean = false;
  public userType: string = localStorage.getItem('userType')!;

  public homeData!: DashboardHome;

  public barChart!: HomeChart;
  public adminBarChart!: AdminChart;
  public trainerBarChart!: AdminChart;
  public talentBarChart!: AdminChart;

  public pieChart!: HomeChart;

  public barOptions!: BarChartOptions;
  public pieOptions!: PieChartOptions;

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    var tempSubscription: Subscription = this._httpService
      .getDashboardHome()
      .subscribe({
        next: (data: DashboardHome) => {
          this.homeData = data;
          console.log(data);
          this.initCharts();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          tempSubscription.unsubscribe();
          this._errorService.showError((err.error as HTTPCustomError).message);
        },
        complete: () => {
          tempSubscription.unsubscribe();          
          this.isLoading = false;
        },
      });
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    // Admin's Bar Graph
    if (this.userType == 'Admin') {
      this.adminBarChart = {
        labels: this.homeData.barGraph.labels,
        datasets: [
          {
            label: this.homeData.barGraph.datasets![0].label,
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: this.homeData.barGraph.datasets![0].data,
          },
          {
            label: this.homeData.barGraph.datasets![1].label,
            backgroundColor: documentStyle.getPropertyValue('--blue-200'),
            borderColor: documentStyle.getPropertyValue('--blue-200'),
            data: this.homeData.barGraph.datasets![1].data,
          },
        ],
      };
      // Admin's Pie Chart
      this.pieChart = {
        labels: this.homeData.pieChart.labels,
        datasets: [
          {
            data: this.homeData.pieChart.datasets.data,
            backgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--blue-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--blue-500'),
            ],
          },
        ],
      };
    }

    // Trainer's Bar Graph
    if (this.userType == 'Trainer') {
      this.barChart = {
        labels: this.homeData.barGraph.labels,
        datasets: [
          {
            label: this.homeData.barGraph.datasets![0].label,
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: this.homeData.barGraph.datasets![0].data,
          },
        ],
      };
      // Trainer's Pie Chart
      this.pieChart = {
        labels: this.homeData.pieChart.labels,
        datasets: [
          {
            data: this.homeData.pieChart.datasets.data,
            backgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--blue-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--cyan-500'),
              documentStyle.getPropertyValue('--blue-500'),
            ],
          },
        ],
      };
    } else {
      // Talent's Bar Graph
      this.barChart = {
        labels: this.homeData.barGraph.labels,
        datasets: [
          {
            label: this.homeData.barGraph.datasets![0].label,
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            data: this.homeData.barGraph.datasets![0].data,
          },
        ],
      };
      // Talent's Pie Chart
      this.pieChart = {
        labels: this.homeData.pieChart.labels,
        datasets: [
          {
            data: this.homeData.pieChart.datasets.data,
            backgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--blue-500'),
              documentStyle.getPropertyValue('--cyan-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--pink-500'),
              documentStyle.getPropertyValue('--blue-500'),
              documentStyle.getPropertyValue('--cyan-500'),
            ],
          },
        ],
      };
    }

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };    
  }
}
