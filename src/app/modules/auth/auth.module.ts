import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DialogModule } from 'primeng/dialog';
import { UnauthorizedAccessComponent } from './unauthorized-access/unauthorized-access.component';
import { ShowSecondsPipe } from 'src/app/pipes/show-seconds/show-seconds.pipe';
import { TokenVerificationComponent } from './token-verification/token-verification.component';
import { StepsModule } from 'primeng/steps';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { ChipModule } from "primeng/chip";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';


@NgModule({

    declarations: [
        LoginComponent,
        SignUpComponent,
        ResetPasswordComponent,
        UnauthorizedAccessComponent,
        ShowSecondsPipe,
        TokenVerificationComponent
    ],

    imports: [
        CommonModule,
        AuthRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ReactiveFormsModule,
        DialogModule,
        StepsModule,
        AutoCompleteModule,
        CalendarModule,
        ChipsModule,
        ChipModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule,
        CascadeSelectModule,
        MultiSelectModule,
        InputTextareaModule,
        RatingModule,
        KnobModule,
        ListboxModule,
        SelectButtonModule,
        InputSwitchModule,
        RadioButtonModule,
        ColorPickerModule,
        ToggleButtonModule,
        SliderModule,
        ProgressBarModule,
        SkeletonModule,
        RecaptchaModule,
        RecaptchaFormsModule
    ],
    providers: [
        ShowSecondsPipe,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: {
                siteKey: environment.recaptcha.siteKey,
            } as RecaptchaSettings,
        }
    ]
})
export class AuthModule { }
