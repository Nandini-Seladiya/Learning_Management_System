import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPSuccessResponse, HTTPCustomError } from 'src/assets/interfaces';

@Component({
    selector: 'dashboard-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    
    menuItems: MenuItem[] = [];

    public isLoggingOut: boolean = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    public userType: string | null = localStorage.getItem('userType');
    
    @Output() languageValue = new EventEmitter<string>();
    
    @Input() currentLanguage!: string; 

    langs!: SelectItem[];
    constructor(
        public appUI: AppUi,
        private _successResponseService: SuccessResponseService,
        private _httpService: HttpService,
        private _errorService: ErrorService,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.langs = [
            { label: 'English', value: 'en' },
            { label: 'French', value: 'fre' },
            { label: 'Gujarati', value: 'gujarati' },
            { label: 'Spanish', value: 'spanish' },
            { label: 'German', value: 'german' },
        ];
        if (localStorage.getItem('userType') !== 'Admin')
            this.menuItems.push({
                label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: './profile'
            });
        this.menuItems.push({
            label: 'Log Out', icon: 'pi pi-fw pi-sign-out', command: () => this.userLogout()
        })
        if (localStorage.getItem('theme') == 'dark')
            (document.getElementById('themeCheckBox') as HTMLInputElement).checked = true;
        else
            (document.getElementById('themeCheckBox') as HTMLInputElement).checked = false;
    }

    /**
     * Changing Theme
     * @param {any} e 
     */
    public changeTheme(e: any): void {

        if (e.target.checked == true) {
            this.appUI.changeFullTheme('lara-dark-indigo', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            this.appUI.changeFullTheme('lara-light-indigo', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    public userLogout(): void {

        this.isLoggingOut = true;
        var tempSubscription: Subscription = this._httpService.userLogout().subscribe({
            next: (res: HttpStatusCode) => {
                this._successResponseService.showSuccess({ header: 'Logout', message: 'Logout Successful' });
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                this._router.navigate(['/'])
            },
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                this.isLoggingOut = false;
                this._errorService.showError((err.error as HTTPCustomError).message)},
            complete: () => {
                tempSubscription.unsubscribe();
                this.isLoggingOut = false;
            }
        })
    }
    changeLanguage(data: string) {
        console.log(data);
        this.languageValue.emit(data);
    }
}

