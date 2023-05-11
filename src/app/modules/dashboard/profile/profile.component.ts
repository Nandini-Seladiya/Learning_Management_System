import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  
  public profile: number = -1;

  ngOnInit(): void {
    this.profile = (localStorage.getItem('userType') == 'Talent') ? 1 : 2;
  }
  
}
