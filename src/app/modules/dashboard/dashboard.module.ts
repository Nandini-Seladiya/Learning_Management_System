import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';

import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from '../shared/shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { KnobModule } from 'primeng/knob';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ChipModule } from 'primeng/chip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';

import { MyProgramsComponent } from './my-programs/my-programs.component';
import { HomeComponent } from './home/home.component';
import { MyGradesComponent } from './my-grades/my-grades.component';
import { ProgramPublicationComponent } from './program-publication/program-publication.component';
import { ProgramActivationComponent } from './program-activation/program-activation.component';
import { TalentEvaluationComponent } from './talent-evaluation/talent-evaluation.component';
import { TalentEvaluationSheetComponent } from './talent-evaluation-sheet/talent-evaluation-sheet.component';
import { AllTalentsComponent } from './all-talents/all-talents.component';
import { AllTrainersComponent } from './all-trainers/all-trainers.component';
import { AllProgramsComponent } from './all-programs/all-programs.component';
import { TalentApprovalComponent } from './talent-approval/talent-approval.component';
import { AddProgramComponent } from './add-program/add-program.component';
import { AddTrainerComponent } from './add-trainer/add-trainer.component';
import { SettingsComponent } from './settings/settings.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { GradeDetailsComponent } from './grade-details/grade-details.component';
import { ViewProfileTrainerComponent } from './view-profile-trainer/view-profile-trainer.component';
import { ViewProfileTalentComponent } from './view-profile-talent/view-profile-talent.component';
import { EditProfileTalentComponent } from './edit-profile-talent/edit-profile-talent.component';
import { ProgramTableComponent } from './program-table/program-table.component';
import { TalentTableComponent } from './talent-table/talent-table.component';
import { TrainerTableComponent } from './trainer-table/trainer-table.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileComponent } from './profile/profile.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { HistoryComponent } from './history/history.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        MenubarModule,
        TabMenuModule,
        StepsModule,
        TieredMenuModule,
        ContextMenuModule,
        MegaMenuModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        BreadcrumbModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        ProgressBarModule,
        SliderModule,
        MultiSelectModule,
        DropdownModule,
        SharedModule,
        InputNumberModule,
        ProgressSpinnerModule,
        SkeletonModule,
        KnobModule,
        AvatarGroupModule,
        AvatarModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        DialogModule,
        CalendarModule,
        AccordionModule,
        ChipModule,
        SelectButtonModule,
        DividerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        DashboardComponent,
        HeaderComponent,
        SidenavComponent,
        SidenavItemComponent,
        MyProgramsComponent,
        HomeComponent,
        MyGradesComponent,
        ProgramPublicationComponent,
        ProgramActivationComponent,
        TalentEvaluationComponent,
        TalentEvaluationSheetComponent,
        AllTalentsComponent,
        AllTrainersComponent,
        AllProgramsComponent,
        TalentApprovalComponent,
        AddProgramComponent,
        AddTrainerComponent,
        SettingsComponent,
        RoleManagementComponent,
        GradeDetailsComponent,
        ViewProfileTrainerComponent,
        ViewProfileTalentComponent,
        EditProfileTalentComponent,
        ProgramTableComponent,
        TalentTableComponent,
        TrainerTableComponent,
        UserManagementComponent,
        ProfileComponent,
        HistoryComponent
    ],
    providers: []
})
export class DashboardModule { }


export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}