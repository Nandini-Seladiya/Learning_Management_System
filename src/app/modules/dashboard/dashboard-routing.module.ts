import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { TalentFormService } from 'src/app/services/talent-form/talent-form.service';
import { AddProgramComponent } from './add-program/add-program.component';
import { AddTrainerComponent } from './add-trainer/add-trainer.component';
import { AllProgramsComponent } from './all-programs/all-programs.component';
import { AllTalentsComponent } from './all-talents/all-talents.component';
import { AllTrainersComponent } from './all-trainers/all-trainers.component';
import { DashboardComponent } from './dashboard.component';
import { EditProfileTalentComponent } from './edit-profile-talent/edit-profile-talent.component';
import { GradeDetailsComponent } from './grade-details/grade-details.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { MyGradesComponent } from './my-grades/my-grades.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgramActivationComponent } from './program-activation/program-activation.component';
import { ProgramPublicationComponent } from './program-publication/program-publication.component';
import { ProgramTableComponent } from './program-table/program-table.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { SettingsComponent } from './settings/settings.component';
import { TalentApprovalComponent } from './talent-approval/talent-approval.component';
import { TalentEvaluationSheetComponent } from './talent-evaluation-sheet/talent-evaluation-sheet.component';
import { TalentEvaluationComponent } from './talent-evaluation/talent-evaluation.component';
import { TalentTableComponent } from './talent-table/talent-table.component';
import { TrainerTableComponent } from './trainer-table/trainer-table.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ViewProfileTalentComponent } from './view-profile-talent/view-profile-talent.component';
import { ViewProfileTrainerComponent } from './view-profile-trainer/view-profile-trainer.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'prefix' },
    {
        path: '',
        component: DashboardComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
                title: 'Dashboard | Home'
            },
            {
                path: 'my-programs',
                component: MyProgramsComponent,
                canActivate: [AuthGuard],
                title: 'Dashboard | My Programs',
            },
            {
                path: 'my-grades',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: MyGradesComponent,
                        title: 'Dashboard | My Grades',
                    },
                    {
                        path: ':programID',
                        component: GradeDetailsComponent,
                        title: 'Dashboard | Grade Details'
                    }
                ]
            },
            {
                path: 'program-publication',
                canActivate: [AuthGuard],
                component: ProgramPublicationComponent,
                title: 'Dashboard | Program Publication',

                canDeactivate: [(c: ProgramTableComponent) => !c.isSubmitting]
            },
            {
                path: 'program-publication',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: ':programID',
                        component: TalentEvaluationSheetComponent,
                        title: 'Dashboard | Details'
                    }
                ]
            },
            {
                path: 'program-activation',
                canActivate: [AuthGuard],
                component: ProgramActivationComponent,
                title: 'Dashboard | Program Activation',
                canDeactivate: [(c: ProgramTableComponent) => !c.isSubmitting]
            },
            {
                path: 'talent-evaluation',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: TalentEvaluationComponent,
                        title: 'Dashboard | Talent Evaluation',
                    },
                    {
                        path: ':programID',
                        component: TalentEvaluationSheetComponent,
                        title: 'Dashboard | Evaluation Sheet',
                        canDeactivate: [(c: TalentEvaluationSheetComponent) => !c.isSubmitting]
                    }
                ]
            },
            {
                path: 'history',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: HistoryComponent,
                        title: 'Dashboard | Program History',
                    },
                    {
                        path: ':programID',
                        component: TalentEvaluationSheetComponent,
                        title: 'Dashboard | Evaluation Sheet',
                        canDeactivate: [(c: TalentEvaluationSheetComponent) => !c.isSubmitting]
                    }
                ]
            },
            {
                path: 'all-talents',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: AllTalentsComponent,
                        title: 'Dashboard | All Talents',
                        canDeactivate: [(c: TalentTableComponent) => !c.isApproving]
                    },
                    {
                        path: 'view/:talentID',
                        component: ViewProfileTalentComponent,
                        title: 'Dashboard | View Talent Profile',
                    },
                    {
                        path: 'edit/:talentID',
                        component: EditProfileTalentComponent,
                        title: 'Dashboard | Edit Talent Profile',
                        canDeactivate: [(talentFormService: TalentFormService) => !talentFormService.isProfileUploading && !talentFormService.isSubmitting]
                    }
                ]
            },
            {
                path: 'all-trainers',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: AllTrainersComponent,
                        title: 'Dashboard | All Trainers',
                        canDeactivate: [(c: TrainerTableComponent) => !c.isSubmitting]
                    },
                    {
                        path: 'view/:trainerID',
                        component: ViewProfileTrainerComponent,
                        title: 'Dashboard | View Trainer Profile',
                    },
                    {
                        path: 'edit/:trainerID',
                        component: AddTrainerComponent,
                        title: 'Dashboard | Edit Trainer Profile',
                        canDeactivate: [(c: AddTrainerComponent) => !c.isSubmitting]
                    },
                    {
                        path: 'add-trainer',
                        component: AddTrainerComponent,
                        title: 'Dashboard | Add Trainer',
                        canDeactivate: [(c: AddTrainerComponent) => !c.isSubmitting]
                    }
                ]
            },
            {
                path: 'all-programs',
                canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        component: AllProgramsComponent,
                        title: 'Dashboard | All Programs',
                    },
                    {
                        path: 'edit/:programID',
                        component: AddProgramComponent,
                        title: 'Dashboard | Edit Program',
                        canDeactivate: [(c: AddProgramComponent) => !c.isSubmitting]
                    },
                    {
                        path: 'add-program',
                        component: AddProgramComponent,
                        title: 'Dashboard | Add Program',
                        canDeactivate: [(c: AddProgramComponent) => !c.isSubmitting]
                    }
                ]
            },
            {
                canActivate: [AuthGuard],
                path: 'talent-approvals',
                children: [
                    {
                        path: '',
                        component: TalentApprovalComponent,
                        title: 'Dashboard | Talent Approvals',
                        canDeactivate: [(c: TalentTableComponent) => !c.isApproving]
                    },
                    {
                        path: 'view/:talentID',
                        component: ViewProfileTalentComponent,
                        title: 'Dashboard | Talent Profile'
                    }
                ]
            },
            {
                path: 'add-program',
                canActivate: [AuthGuard],
                component: AddProgramComponent,
                title: 'Dashboard | Add Program',

                canDeactivate: [(c: AddProgramComponent) => !c.isSubmitting]
            },
            {
                path: 'add-trainer',
                canActivate: [AuthGuard],
                component: AddTrainerComponent,
                title: 'Dashboard | Add Trainer',

                canDeactivate: [(c: AddTrainerComponent) => !c.isSubmitting]
            },
            {
                path: 'settings',
                canActivate: [AuthGuard],
                component: SettingsComponent,
                title: 'Dashboard | Settings',

                canDeactivate: [(c: SettingsComponent) => !c.isSubmitting]
            },
            {
                path: 'role-management',
                canActivate: [AuthGuard],
                component: RoleManagementComponent,
                title: 'Dashboard | Role Management'
            },
            {
                path: 'user-management',
                canActivate: [AuthGuard],
                component: UserManagementComponent,
                title: 'Dashboard | User Management',
                
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'profile',
                children : [
                    {
                        path: 'edit-trainer', 
                        component: AddTrainerComponent
                    },
                    {
                        path: 'edit-talent', 
                        component: EditProfileTalentComponent
                    }
                ]
            }
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
