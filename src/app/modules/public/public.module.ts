import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProgramDetailsComponent } from './program-details/program-details.component';
import { LandingProgramCardComponent } from './landing-program-card/landing-program-card.component';
import { SharedModule } from '../shared/shared.module';




@NgModule({
  declarations: [
    PublicComponent,
    LandingPageComponent,
    ProgramDetailsComponent,
    LandingProgramCardComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    StyleClassModule,
    DividerModule,
    ChartModule,
    PanelModule,
    ButtonModule,
    SkeletonModule,
    FormsModule,
    InputTextModule
  ]
})
export class PublicModule { }
