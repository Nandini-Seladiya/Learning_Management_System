import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HTTPSuccessResponse, HTTPCustomError } from 'src/assets/interfaces';

@Component({
  selector: 'dashboard-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  public isLoading: boolean = false;

  model: MenuItem[] = [];

  constructor(
    public appUI: AppUi,
    public el: ElementRef,
    private _httpService: HttpService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {

    var tempSubscription: Subscription = this._httpService.getUserPermissions().subscribe({
      next: (data: number[]) => {
        this.appUI.setPermissions = data;
        this.model = this._showTabs(data);
      },
      error: (err: HttpErrorResponse) => {
        tempSubscription.unsubscribe();
        this.isLoading = false;
        this.model = [
          {
            items: [
              { label: 'Home', icon: 'pi pi-home', routerLink: ['/dashboard/home'] },
              { label: 'My Programs', icon: 'pi pi-book', routerLink: ['/dashboard/my-programs'] },
              { label: 'My Grades', icon: 'pi pi-book', routerLink: ['/dashboard/my-grades'] },
            ]
          }
        ];
        this._errorService.showError((err.error as HTTPCustomError).message);
      },
      complete: () => { 
        tempSubscription.unsubscribe();
        this.isLoading = false }
    })
  }

  private _showTabs(data: number[]): MenuItem[] {
    var items: MenuItem[] = [];
    items.push({ label: 'Home', icon: 'pi pi-home', routerLink: ['/dashboard/home'] });
    if (data.includes(1)) items.push({ label: 'My Programs', icon: 'pi pi-book', routerLink: ['/dashboard/my-programs'] });
    if (data.includes(2)) items.push({ label: 'My Grades', icon: 'pi pi-book', routerLink: ['/dashboard/my-grades'] });
    if (data.includes(3)) items.push({ label: 'Talent Evaluation', icon: 'pi pi-check-square', routerLink: ['/dashboard/talent-evaluation'] });
    if (data.includes(4)) items.push({ label: 'Program Activation', icon: 'pi pi-history', routerLink: ['/dashboard/program-activation'] });
    if (data.includes(5)) items.push({ label: 'All Talents', icon: 'pi pi-users', routerLink: ['/dashboard/all-talents'] });
    if (data.includes(6)) items.push({ label: 'All Trainers', icon: 'pi pi-users', routerLink: ['/dashboard/all-trainers']  });
    if (data.includes(7)) items.push({ label: 'All Programs', icon: 'pi pi-database', routerLink: ['/dashboard/all-programs'] });
    if (data.includes(8)) items.push({ label: 'Program Publication', icon: 'pi pi-arrow-circle-up', routerLink: ['/dashboard/program-publication'] });
    if (data.includes(9)) items.push({ label: 'Talent Approvals', icon: 'pi pi-sign-in', routerLink: ['/dashboard/talent-approvals']  });
    if (data.includes(10)) items.push({  label: 'Settings', icon: 'pi pi-cog', routerLink: ['/dashboard/settings'] });
    if (data.includes(11)) items.push({ label: 'Role Management', icon: 'pi pi-lock', routerLink: ['/dashboard/role-management'] });
    if (data.includes(12)) items.push({  label: 'User Management', icon: 'pi pi-user-edit', routerLink: ['/dashboard/user-management'] });
    if (data.includes(13)) items.push({  label: 'History', icon: 'pi pi-history', routerLink: ['/dashboard/history'] });
    var tabs = [
      {
        items: items
      }
    ]
    return tabs;
  }
}