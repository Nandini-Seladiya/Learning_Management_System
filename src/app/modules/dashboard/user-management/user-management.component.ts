import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem, MenuItem } from 'primeng/api';
import { HTTPCustomError, HTTPSuccessResponse, SystemUser, UserRole } from 'src/assets/interfaces';
import { HttpService } from 'src/app/services/http/http.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SuccessResponseService } from 'src/app/services/success-response/success-response.service';

@Component({
    selector: 'dashboard-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
    assignees: any = [];
    displayAddEditAssignee: boolean = false;
    selectedAssignee: any = null;
    modalType!: string;
    usersToAssign: SelectItem[] = [];

    public users!: SystemUser[];
    public roles: UserRole[] = [];
    public isLoading: boolean = false;
    public columnFields: string[] = ['id', 'name', 'email', 'role.name', 'userCRUD'];
    public displayDialog: boolean = false;
    public isSubmitting: boolean = false;
    public dialogHeader: string = '';

    public assigneeForm: FormGroup = this._buildForm();


    constructor(
        private _confirmationService: ConfirmationService,
        private _formBuilder: FormBuilder,
        private _httpService: HttpService,
        private _errorService: ErrorService,
        private _successResponseService: SuccessResponseService
    ) { }


    @ViewChild('exampleTable') exampleTable!: any;

    ngOnInit(): void {
        this._getData();
    }

    private _getData() {
        this.isLoading = true;
        var tempSubscription: Subscription = this._httpService.getRoleAssignmentDetails().subscribe({
            next: (data: (SelectItem<any>[] | UserRole[] | SystemUser[])[]) => { this.users = data[2] as SystemUser[]; this.roles = data[1] as UserRole[]; this.usersToAssign = data[0] as SelectItem[]; console.log(data) },
            error: (err: HttpErrorResponse) => {
                this.users = [];
                this.isLoading = false;
                tempSubscription.unsubscribe();
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                console.log('call done');
                tempSubscription.unsubscribe();
                this.isLoading = false;
            }
        })
    }

    /**
     * 
     * @returns {FormGroup}
     */
    private _buildForm(): FormGroup {
        return this._formBuilder.group({
            id: ['', Validators.required],
            roleId: [[], [Validators.required]],
        });
    }

    public userRoleFormSubmission(): void {

        for (var c in this.assigneeForm.controls) {
            this.assigneeForm.controls[c].disable();
        }

        var tempSubscription: Subscription = this._httpService.assignRoleToUser(this.assigneeForm.value as SystemUser).subscribe({
            next: (res: HTTPSuccessResponse) => {
                this._successResponseService.showSuccess(res);
                this._getData();
            },
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                this.isLoading = false;
                for (var c in this.assigneeForm.controls) {
                    this.assigneeForm.controls[c].enable();
                }
                this.isSubmitting = false;
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                for (var c in this.assigneeForm.controls) {
                    this.assigneeForm.controls[c].enable();
                }
                tempSubscription.unsubscribe();
                this.assigneeForm.reset();
                this.isLoading = false;
                this.isSubmitting = false;
                this.displayDialog = false;
            }
        });
    }

    /**
     * Opens confirm popup before deleting user
     * @param {string} userName 
     * @param {number} userID 
     * @param {number} roleId 
     */
    public deleteUserWithRole(userName:string , userID: number, roleId: number): void {
        this._confirmationService.confirm({
            key: 'confirm1',
            message: `Revoke all roles for ${userName}?`,
            accept: () => this._revokeRole(userID, roleId)
        });
    }

    public openDialog(): void {
        this.displayDialog = true;
        this.dialogHeader = 'Assign New User Role';
    }

    /**
     * 
     * @param {number} userID 
     * @param {number} roleId 
     */
    private _revokeRole(userID: number, roleId: number) {
        var obj: SystemUser = {
            id: userID,
            roleId: [roleId]
        }
        
        var tempSubscription: Subscription = this._httpService.removeAssignment(obj).subscribe({
            next: (res: HTTPSuccessResponse) => {
                this._successResponseService.showSuccess(res);
                this._getData();
            },
            error: (err: HttpErrorResponse) => {
                tempSubscription.unsubscribe();
                this.isLoading = false;
                this.isSubmitting = false;                
                this._errorService.showError((err.error as HTTPCustomError).message);
            },
            complete: () => {
                tempSubscription.unsubscribe();
                this.assigneeForm.reset();
                this.isLoading = false;
                this.isSubmitting = false;
                this.displayDialog = false;
            }
        });
    }

    /**
     * Global search
     * @param {any} e 
     */
    public searchValue(e: any): void {
        this.exampleTable.filterGlobal(e.target.value, 'contains');
    }
}