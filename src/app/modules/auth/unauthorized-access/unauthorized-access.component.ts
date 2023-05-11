import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';

@Component({
  selector: 'auth-unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.scss']
})
export class UnauthorizedAccessComponent implements OnInit {

  public heading: string = '';
  public message: string = ''
  public imageLink: string = '';

  constructor(
    private _router: Router,
    private _appUI: AppUi,
    public location: Location
  ) { }

  ngOnInit(): void {

    if (this._router.url.split('/')[2] == 'access-denied') {
      this.heading = 'Access Denied';
      this.message = 'You do not have the necessary permisions. Please contact admin.';
      this.imageLink = 'assets/images/access/asset-access.svg'
    }
    else if (this._router.url.split('/')[2] == 'approval-acknowledgement') {
      this.heading = 'Approval Pending';
      this.message = 'Your account approval is pending. Please check after some time.';
      this.imageLink = 'assets/images/access/asset-access.svg'
    }
    else if (this._router.url.split('/')[1] == 'notfound') {
      this.heading = 'Page Not Found';
      this.message = 'The page you are trying to access is not available. Please check after some time.';
      this.imageLink = 'assets/images/access/asset-error.svg'
    }
  }
}
