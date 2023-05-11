import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';


import { SharedRoutingModule } from './shared-routing.module';
import { FooterComponent } from './footer/footer.component';
import { TableSkeletonComponent } from './table-skeleton/table-skeleton.component';
import { ProfileSkeletonComponent } from './profile-skeleton/profile-skeleton.component';
import { FormSkeletonComponent } from './form-skeleton/form-skeleton.component';
import { AccordionSkeletonComponent } from './accordion-skeleton/accordion-skeleton.component';


@NgModule({
  declarations: [
    FooterComponent,
    TableSkeletonComponent,
    ProfileSkeletonComponent,
    FormSkeletonComponent,
    AccordionSkeletonComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    TableModule,
    SkeletonModule
  ],
  exports:[
    FooterComponent,
    TableSkeletonComponent,
    ProfileSkeletonComponent,
    FormSkeletonComponent,
    AccordionSkeletonComponent
  ]
})
export class SharedModule { }
