import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalentFormService } from 'src/app/services/talent-form/talent-form.service';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TokenVerificationComponent } from './token-verification/token-verification.component';
import { UnauthorizedAccessComponent } from './unauthorized-access/unauthorized-access.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { checkForToken } from 'src/app/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'access-denied',
        component: UnauthorizedAccessComponent,
        title: 'Access Denied'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'LMS | Login',
        canDeactivate: [(c: LoginComponent) => !c.isSubmitting1 && !c.isSubmitting2],
        canActivate: [checkForToken]
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
        title: 'LMS | Sign Up',
        canDeactivate: [(c: TalentFormService) => !c.isSubmitting],
        canActivate: [checkForToken]

    },
    {
        path: 'approval-acknowledgement',
        component: UnauthorizedAccessComponent,
        title: 'LMS | Approval Acknowledgement'

    },
    {
        path: 'email-verification/:token',
        component: TokenVerificationComponent,
        title: 'LMS | Email Verification',
        canDeactivate: [(c: TokenVerificationComponent) => !c.isVerifying],
        canActivate: [checkForToken]

    },
    {
        path: 'reset-password/:token',
        component: TokenVerificationComponent,
        title: 'LMS | Password Reset',
        canDeactivate: [(c1: TokenVerificationComponent, c2: ResetPasswordComponent) => !c1.isVerifying && !c2.isSubmitting],
        canActivate: [checkForToken]
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
