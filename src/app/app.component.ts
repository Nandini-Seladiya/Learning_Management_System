import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { EndPoints } from 'src/assets/endPoints';
import { HTTPCustomError } from 'src/assets/interfaces';
import { AppUi } from './services/app-ui/app-ui.service';
import { ErrorService } from './services/error/error.service';
import { HttpService } from './services/http/http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    config = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };

    constructor(
        private _primengConfig: PrimeNGConfig,
        private _appUI: AppUi,
        private _httpService: HttpService,
        private _errorService: ErrorService
    ) { }

    ngOnInit() {
        this._primengConfig.ripple = true;
        if (localStorage.getItem('theme') == 'dark')
            this._appUI.changeFullTheme('lara-dark-indigo', 'dark');
        else
            this._appUI.changeFullTheme('lara-light-indigo', 'light');
    }
}
