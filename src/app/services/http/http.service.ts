import { HttpClient, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable, TRANSLATIONS } from '@angular/core';
import { endWith, forkJoin, Observable } from 'rxjs';
import { Approvals, DashboardHome, EvaluationMarks, Grades, HTTPSuccessResponse, Login, Program, ProgramScheduling, ProgramTracking, Settings, SettingsChange, SignUpMetaData, SignUpMetaDataDetail, Skills, SystemUser, Talent, Trainer, UserRole } from 'src/assets/interfaces';
import { EndPoints } from 'src/assets/endPoints';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient
  ) { }

  /* ####################### ACTUAL API CALLS ########################### */

  public userLogin(loginCredentials: Login): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.LOGIN, loginCredentials);
  }

  public userLogout(): Observable<HttpStatusCode> {
    return this._http.get<HttpStatusCode>(EndPoints.LOGOUT);
  }

  public getAllMasterData(): Observable<SignUpMetaData> {
    return this._http.get<SignUpMetaData>(EndPoints.MASTER_DATA);
  }

  public getTalnetApprovalStatus(email: string): Observable<boolean> {
    return this._http.get<boolean>(`${EndPoints.APPROVAL_STATUS}/${email}`)
  }

  public sendResetPasswordLink(credential: Login): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.SEND_FORGET_PASSWORD_LINK, credential);
  }

  public emailVerification(token: string): Observable<HTTPSuccessResponse> {
    return this._http.get<HTTPSuccessResponse>(`${EndPoints.EMAIL_VERIFICATION}${token}`);
  }

  public resetPassword(credential: Login, token: string): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(`${EndPoints.RESET_PASSWORD}${token}`, credential);
  }

  // Landing page

  public getProgramDetailsPublic(programID: number): Observable<(Skills[] | Program)[]> {
    let requests = [
      this._http.get<Skills[]>(EndPoints.SKILLS_DETAILS_OF_PROGRAM),
      this._http.get<Program>(`${EndPoints.GET_PROGRAM_DETAILS}/${programID}`),
    ];
    return forkJoin(requests);
  }

  public getMasterProgramDetails(programID: number): Observable<(Skills[] | Program)[]> {
    let requests = [
      this._http.get<Skills[]>(EndPoints.SKILLS_DETAILS_OF_PROGRAM),
      this._http.get<Program>(`${EndPoints.GET_MASTER_PROGRAM}/${programID}`),
    ];
    return forkJoin(requests);
  }

  public getProgramDetailsPrivate(programID: number): Observable<(Skills[] | Program | boolean)[]> {
    let requests = [
      this._http.get<Skills[]>(EndPoints.SKILLS_DETAILS_OF_PROGRAM),
      this._http.get<Program>(`${EndPoints.GET_PROGRAM_DETAILS}/${programID}`),
      this._http.get<boolean>(`${EndPoints.ENROLLMENT_STATUS}/${programID}`)
    ];
    return forkJoin(requests);
  }

  public enrollIntoProgram(trackingID: number): Observable<HTTPSuccessResponse> {
    return this._http.get<HTTPSuccessResponse>(`${EndPoints.ENROLL_INTO_PROGRAM}/${trackingID}`);
  }

  // Dashboard home
  public getDashboardHome(): Observable<DashboardHome> {
    return this._http.get<DashboardHome>(EndPoints.DASHBOARD_HOME);
  }

  // Programs in Dashboard
  public getMasterProgramsAdmin(): Observable<(Program[] | Trainer[])[]> {
    let requests = [
      this._http.get<Program[]>(EndPoints.MASTER_PROGRAMS),
      this._http.get<Trainer[]>(EndPoints.TRAINERS)
    ];
    return forkJoin(requests);
  }

  public getAllPrograms(type?: number, flags: ProgramTracking = {}): Observable<Program[]> {
    return this._http.post<Program[]>(`${EndPoints.SCHEDULED_PROGRAMS_DATA}/${type ?? ''}`, flags);
  }

  public getAllProgramsWithGrades(): Observable<Program[]> {
    return this._http.get<Program[]>(EndPoints.GET_PROGRAMS_FOR_GRADES);
  }

  public addNewProgram(programDetails: Program): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.ADD_NEW_PROGRAM, programDetails);
  }

  public deleteProgram(programID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.DELETE_PROGRAM}/${programID}`)
  }

  public updateProgram(programDetails: Program): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(EndPoints.UPDATE_PROGRAM, programDetails);
  }

  public getAddProgramForm(): Observable<Skills[]> {
    return this._http.get<Skills[]>(EndPoints.PROGRAM_FORM_DATA);
  }

  // Program Publication and activation

  public programPublish(form: ProgramScheduling): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.PUBLISH_PROGRAM, form);
  }

  public programStart(form: ProgramScheduling): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.PROGRAM_START, form);
  }

  public programUnpublish(trackingID: number): Observable<HTTPSuccessResponse> {
    return this._http.get<HTTPSuccessResponse>(`${EndPoints.UNPUBLISH_PROGRAM}/${trackingID}/false`);
  }


  public programEnd(trackingID: number): Observable<HTTPSuccessResponse> {
    return this._http.get<HTTPSuccessResponse>(`${EndPoints.PROGRAM_END}/${trackingID}/true`);
  }

  // grades
  public getProgramGradesDetails(trackingID: number): Observable<Skills[]> {
    return this._http.get<Skills[]>(`${EndPoints.GRADE_DETAILS}/${trackingID}`);
  }

  public downloadCertificate(trackingID: number): Observable<any> {
    return this._http.get<any>(`${EndPoints.DOWNLOAD_CERTIFICATE}/${trackingID}`, { responseType: 'arraybuffer' as 'json'});
  }

  // Talents evaluation grades CRUD
  public getTalentsGradesDetailsOfProgram<Grades>(programID: number) {
    return this._http.get<Grades>('');
  }

  public getTalentEvaluationData(programID: number): Observable<Grades[]> {
    return this._http.get<Grades[]>(`${EndPoints.PROGRAM_EVALUATION_DATA}/${programID}`)
  }

  public updateTalentGrade(data: EvaluationMarks): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.PROGRAM_EVALUATION_UPDATE_GRADES, data);
  }


  // Trainer CRUD
  public getAllTrainers(): Observable<Trainer[]> {
    return this._http.get<Trainer[]>(EndPoints.TRAINERS);
  }

  public getTrainerDetailsAdmin(trainerID: number): Observable<Trainer> {
    return this._http.get<Trainer>(`${EndPoints.TRAINER_DETAILS}/${(trainerID)}`);
  }

  public getTrainerDetailsProfile(): Observable<Trainer> {
    return this._http.get<Trainer>(EndPoints.VIEW_SELF);
  }


  public addNewTrainer(talentDetails: Trainer): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.TRAINER_REGISTRATION, talentDetails);
  }

  public deleteTrainer(trainerID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.DELETE_USER}/${trainerID}`);
  }

  public updateTrainer(trainerDetails: Trainer): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(EndPoints.EDIT_TRAINER, trainerDetails);
  }

  // Talent CRUD

  public getAllTalents(flag: boolean): Observable<Talent[]> {
    return this._http.get<Talent[]>(`${EndPoints.GET_ALL_TALENTS}/${flag}`);
  }

  public getTalentDetailsAdmin(talentID: number): Observable<(SignUpMetaData | Talent | Program[])[]> {
    let requests = [
      this._http.get<SignUpMetaData>(EndPoints.MASTER_DATA),
      this._http.get<Talent>(`${EndPoints.TALENT_DETAILS}/${(talentID)}`),
      this._http.get<Program[]>(`${EndPoints.GET_ALL_ENROLLED_PROGRAMS_LISTING}/${(talentID)}`)
    ];
    return forkJoin(requests);
  }

  public getTalentDetailsProfile(): Observable<(SignUpMetaData | Talent | Program[])[]> {
    let requests = [
      this._http.get<SignUpMetaData>(EndPoints.MASTER_DATA),
      this._http.get<Talent>(EndPoints.VIEW_SELF),
      this._http.post<Program[]>(`${EndPoints.SCHEDULED_PROGRAMS_DATA}/3`, { active: true, started: false, ended: false })
    ];
    return forkJoin(requests);
  }

  public addNewTalent(talentDetails: Talent): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.SIGN_UP, talentDetails);
  }

  public deleteTalent(talentID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.DELETE_USER}/${talentID}`);
  }

  public updateTalent(talentDetails: Talent): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(EndPoints.EDIT_TALENT, talentDetails);
  }


  // Metadata settings 
  public getSettingsData(): Observable<(SignUpMetaData | Skills[])[]> {
    let requests = [
      this._http.get<SignUpMetaData>(EndPoints.MASTER_DATA),
      this._http.get<Skills[]>(EndPoints.MAIN_SKILL)
    ];
    return forkJoin(requests);
  }

  public addMainSkill(skill: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.MAIN_SKILL, skill);
  }

  public updateMainSkill(data: SettingsChange, skillID: number,): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.MAIN_SKILL}/${skillID}`, data);
  }

  public deleteMainSkill(skillID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.MAIN_SKILL}/${skillID}`);
  }

  public addSubSkill(skill: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.SUB_SKILL, skill);
  }

  public updateSubSkill(skillID: number, data: SettingsChange): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.SUB_SKILL}/${skillID}`, data);
  }

  public deleteSubSkill(skillID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.SUB_SKILL}/${skillID}`);
  }

  public addCurrentProfessionalStatus(value: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.CURRENT_WORKING_STATUS, value);
  }

  public addIndustryType(value: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.INDUSTRY_TYPE, value);
  }

  public addExperienceInIT(value: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.EXPERIENCE_IN_IT, value);
  }

  public addFieldSpecialization(value: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.FIELD_SPECIALIZATION, value);
  }

  public addSkill(value: SettingsChange): Observable<SignUpMetaDataDetail> {
    return this._http.post<SignUpMetaDataDetail>(EndPoints.SKILLS, value);
  }

  public updateCurrentProfessionalStatus(value: SettingsChange, id: number): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.CURRENT_WORKING_STATUS}/${id}`, value);
  }

  public updateIndustryType(value: SettingsChange, id: number): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.INDUSTRY_TYPE}/${id}`, value);
  }

  public updateExperienceInIT(value: SettingsChange, id: number): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.EXPERIENCE_IN_IT}/${id}`, value);
  }

  public updateFieldSpecialization(value: SettingsChange, id: number): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.FIELD_SPECIALIZATION}/${id}`, value);
  }

  public updateSkill(value: SettingsChange, id: number): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(`${EndPoints.SKILLS}/${id}`, value);
  }


  public deleteCurrentProfessionalStatus(id: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.CURRENT_WORKING_STATUS}/${id}`);
  }

  public deleteIndustryType(id: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.INDUSTRY_TYPE}/${id}`);
  }

  public deleteExperienceInIT(id: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.EXPERIENCE_IN_IT}/${id}`);
  }

  public deleteFieldSpecialization(id: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.FIELD_SPECIALIZATION}/${id}`);
  }

  public deleteSkill(id: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.SKILLS}/${id}`);
  }

  // approvals 
  public getTalentApprovalData(): Observable<Talent[]> {
    return this._http.get<Talent[]>(EndPoints.GET_TALENT_FOR_APPROVAL);
  }

  public talentApproval(talents: Approvals): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.TALENT_APPROVAL_ACTION, talents);
  }


  // Role Management CRUD

  public getRoleManagementDetails(): Observable<UserRole[]> {
    return this._http.get<UserRole[]>(EndPoints.ROLES_DETAILS)
  }

  public addNewUserRole(role: UserRole): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.ADD_ROLE, role);
  }

  public updateUserRole(role: UserRole): Observable<HTTPSuccessResponse> {
    return this._http.put<HTTPSuccessResponse>(EndPoints.UPDATE_ROLE, role);
  }

  public deleteUserRole(roleID: number): Observable<HTTPSuccessResponse> {
    return this._http.delete<HTTPSuccessResponse>(`${EndPoints.DELETE_ROLE}/${roleID}`);
  }

  // Role Assignment CRUD
  public getRoleAssignmentDetails(): Observable<(SelectItem[] | UserRole[] | SystemUser[])[]> {
    let requests = [
      this._http.get<SelectItem[]>(EndPoints.SYSTEM_USERS),
      this._http.get<UserRole[]>(EndPoints.ROLES),
      this._http.get<SystemUser[]>(EndPoints.USER_ROLES)
    ]
    return forkJoin(requests);
  }

  public assignRoleToUser(data: SystemUser): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.ASSIGN_NEW_ROLE, data);
  }

  public removeAssignment(data: SystemUser): Observable<HTTPSuccessResponse> {
    return this._http.post<HTTPSuccessResponse>(EndPoints.REVOKE_ROLE, data);
  }


  // File upload

  public uploadPicture(file: File | null, type: number) {
    let formData = new FormData();
    if (file)
      formData.append('Document', file, file.name);

    const request = new HttpRequest('POST', `${EndPoints.IMAGE_UPLOAD}/${type}`, formData, {
      reportProgress: true,
    });

    return this._http.request(request);
  }

  public getUserPermissions(): Observable<number[]> {
    return this._http.get<number[]>(EndPoints.GET_PERMISSIONS_OF_USER);
  }
}

