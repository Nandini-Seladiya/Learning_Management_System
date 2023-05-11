import { Component } from '@angular/core';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public currentYear: number = new Date().getFullYear();
  constructor(public appUI: AppUi) { }
}
