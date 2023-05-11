import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpService } from 'src/app/services/http/http.service';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';
import { HTTPCustomError, HTTPSuccessResponse, SystemUser, UserRole } from 'src/assets/interfaces';

@Component({
    selector: 'dashboard-role-management',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {

    public readonly permissions: SelectItem[] = [
        { value: 5, label: 'All Talents' },
        { value: 6, label: 'All Trainers' },
        { value: 7, label: 'All Programs' },
        { value: 8, label: 'Program Publication' },
        { value: 9, label: 'Talent Approvals' },
        { value: 10, label: 'Settings' },
        { value: 11, label: 'Role Management' },
        { value: 12, label: 'User Management' },
        { value: 13, label: 'History' },
    ]

    public displayAddRole: boolean = false;
    public isLoading: boolean = false;
    public noDataAvailable: boolean = false;
    public isSubmitting: boolean = false;
    public userRoles!: UserRole[];
    public firstSubmit: boolean = true;

    public roleForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        permissions: [[], Validators.required],
    });

    constructor(
        private _confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private _httpService: HttpService,
        private _errorService: ErrorService,
        private _successResponseService: SuccessResponseService
    ) { }

    ngOnInit(): void {
        this._getData();
    }

    private _getData() {
        this.isLoading = true;
        var tempSubscription: Subscription = this._httpService.getRoleManagementDetails().subscribe({
            next: (data: UserRole[]) => { this.userRoles = data; },
            error: (err: HttpErrorResponse) => {
                this.userRoles = [];
                this.noDataAvailable = true;
                tempSubscription.unsubscribe();
                this.isLoading = false;
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                tempSubscription.unsubscribe();
                this.isLoading = false;
            }
        })
    }

    /**
     * Changes permissions of the user
     * @param {number[]} data 
     * @param {any} id 
     */
    public permissionsChange(data: number[], id: any) {
        this.firstSubmit = false;
        this.isSubmitting = true;
        var obj: UserRole = {
            id: id,
            permissions: data
        }
        var tempSubscription: Subscription = this._httpService.updateUserRole(obj).subscribe({
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                this.isSubmitting = false;
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                tempSubscription.unsubscribe();
                this.isSubmitting = false;
            }
        })
    }

    /**
     * opens modal for adding new role and setting its permissions
     * @param {FormGroup} form 
     */
    public addNewRoleFormSubmission(form: FormGroup): void {
        this.isSubmitting = true;
        if (form.invalid) return;
        for (var c in form.controls) {
            this.roleForm.get(c)?.disable();
        }

        var tempSubscription: Subscription = this._httpService.addNewUserRole(form.value as UserRole).subscribe({
            next: (res: HTTPSuccessResponse) => {
                this._successResponseService.showSuccess(res);
                this._getData();
            },
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                for (var c in form.controls) {
                    form.controls[c].enable();
                }
                this.isSubmitting = false;
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                for (var c in form.controls) {
                    form.controls[c].enable();
                }
                tempSubscription.unsubscribe();
                this.displayAddRole = false;
                form.reset();
                this.isSubmitting = false;
            }
        });
    }

    /**
     * Opens comfirm popup for deleting the role
     * @param {string} roleName 
     * @param {number} roleID 
     */
    public deleteRole(roleName: string, roleID: number) {
        this._confirmationService.confirm({
            key: 'confirm1',
            message: `Delete Role ${roleName}?`,
            accept: () => this._deleteRole(roleID)
        });
    }

    /**
     * Logic for deleting the role
     * @param {number} id 
     */
    private _deleteRole(id: number): void {
        this.firstSubmit = false;
        this.isSubmitting = true;
        var tempSubscription: Subscription = this._httpService.deleteUserRole(id).subscribe({
            next: (res: HTTPSuccessResponse) => { 
                this._successResponseService.showSuccess(res);
                this._getData();
            },
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                this.isSubmitting = false;
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                tempSubscription.unsubscribe();
                this.isSubmitting = false;
            }
        })
    }
}