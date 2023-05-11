import { Component, Input, OnInit } from '@angular/core';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { fadeInOut, fadeOutIn } from 'src/assets/animations';
import { EndPoints } from 'src/assets/endPoints';
import { Program } from 'src/assets/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'public-landing-program-card',
  templateUrl: './landing-program-card.component.html',
  styleUrls: ['./landing-program-card.component.scss'],
  animations: [fadeInOut, fadeOutIn]
})
export class LandingProgramCardComponent implements OnInit {
  @Input() allPrograms!: Program;
  public readonly imageBaseURL: string = environment.backend.baseURL + '/' +EndPoints.IMAGE;

  constructor(
    public appUI: AppUi
  ) {}

  ngOnInit(): void {
    console.log(this.imageBaseURL);
    console.log(this.allPrograms);    
  }

}