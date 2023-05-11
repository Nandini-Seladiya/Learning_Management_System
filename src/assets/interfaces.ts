export interface TalentPersonalDetails {
    name: string,
    id?: number,
    gender: string,
    countryName: string,
    age: number
}

export interface TalentProfessionalDetails {
    currentProfessionalStatus: number;
    industryType: number,
    yearOfExperience: number,
    skills: any[],
    currentEmployerName: string,
    linkedInProfileLink: string,
    recordedVideoLink: string,
    experienceInIT: number,
    experienceLevel: number
}

export interface TalentEducationalDetails {
    nameOfDegree: string,
    nameOfUniversity: string,
    yearOfPassing: number
}

export interface TalentOtherDetails {
    knownLanguages: string[],
    fieldSpecialization: number,
    skillSpecialization: number,
    profileImage: string,
}

export interface TalentCredentialInterface {
    email: string,
    password?: string,
    id?: number
}

export interface Talent {
    personalDetails: TalentPersonalDetails,
    professionalDetails?: TalentProfessionalDetails,
    educationDetails?: TalentEducationalDetails[],
    otherDetails?: TalentOtherDetails,
    credentials: TalentCredentialInterface,
    enrolledPrograms?: Program[]
    enrolledProgramNames?: string[];
}

export interface Trainer {
    name: string,
    id?: string,
    password?: string
    programs?: Program[],
    yearOfExperience?: number,
    email?: string,
    profileImage?: string,
    assignedRole?: UserRole,
    enrolledProgramNames?: string[];
    age?: number,
    countryName?: string,
    gender?: string,
    linkedInProfileLink?: string,
    recordedVideoLink?: string
}

export interface Skills {
    mainSkillName: string,
    mainSkillID: number,
    subSkills: {
        subSkillID: number,
        subSkillName: string,
        subSkillScore?: number
    }[]
}

export interface EvaluationMarks {
    trackingId: number,
    talentId: number,
    marks: number,
    subSkillId: number
}

export interface Grades {
    talentName: string,
    programName: string,
    talentID?: number,
    programID?: number,
    overallGrades?: string,
    gradeDetails: Skills[],
    program?: Program
}

export interface SettingsChange {
    name?: string,
    skillName?: string,
    skillId?: number,
    subSkillName?: string
}

export interface Program {
    id?: number,
    name: string,
    trainers?: Trainer[],
    thumbnailImageURL?: string,
    skillsList?: string[],
    programTracking?: {
        isActive?: boolean,
        isStarted?: boolean,
        isEnded?: boolean,
        startDate?: string,
        endDate?: string,
        isEnrolled?: boolean,
        trackingId: number
    }
    duration?: string,
    programDuration?: number,
    durationOption?: string,
    image?: string,
    programOverview?: string,
    totalEnrolledTalents?: number,
    overallGrades?: string,
    grades?: Grades,
    programSkills?: Skills[],
    trainerNames?: string[]
    subSkillCategories?: number[]
}

export interface ProgramTracking {
    active?: boolean,
    started?: boolean,
    ended?: boolean,
    history?: boolean
}

export interface ProgramScheduling {
    id?: number,
    startDate?: string,
    endDate?: string,
    trainers: number[],
    totalAttendees?: number,
    trackingId?: number
}

export interface Approvals {
    talents: number[],
    status: boolean
}

export interface SignUpMetaDataDetail {
    value: number,
    label: string
}

export interface SignUpMetaData {
    currentProfessionalStatus: SignUpMetaDataDetail[],
    industryType: SignUpMetaDataDetail[],
    experienceInIT: SignUpMetaDataDetail[],
    fieldSpecialization: SignUpMetaDataDetail[],
    skills: SignUpMetaDataDetail[]
}

export interface Settings {
    skillsList: Skills[],
    signUpMetadata: SignUpMetaData
}

export interface UserRole {
    name?: string,
    description?: string,
    id: number,
    privilages?: number[],
    permissions?: number[]
}

export interface SystemUser {
    email?: string,
    id: number
    name?: string,
    role?: UserRole,
    roleId: number[]
}

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

export interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

export interface HTTPSuccessResponse {
    header: string,
    message: string,
    path?: string,
    isLogin?: boolean,
    token?: string,
    type?: string
}

export interface HTTPCustomError {
    stauts: string,
    timestamp: string,
    message: string,
    debugMessage: string,
    extraDetails?: {},
    validation?: boolean
}

export interface Login {
    email: string,
    password?: string
}

export interface HomeChart {
    labels: Array<string>;
    datasets: {
        label?: string;
        data: Array<number>;
        backgroundColor?: any;
        borderColor?: any;
        hoverBackgroundColor?: any;
    }[];

}

export interface AdminChart {
    labels: Array<string>;
    datasets: {
        label?: string;
        data: Array<number>;
        backgroundColor?: any;
        borderColor?: any;
        hoverBackgroundColor?: any;
    }[];

}
export interface Details {
    program?: string;
    data: {
        rank: number;
        name: string;
        image: string;
    }[];

}

export interface DashboardHome {
    summaryCards?: {
        programs: number;
        talents: number;
        trainers: number;
        evaluationPending: number;
        certificates: number;
        position: number;
    };
    barGraph: {
        labels: Array<string>;
        datasets?: {
            label: string;
            backgroundColor?: any;
            borderColor?: any;
            data: Array<number>;
        }[];
    };
    pieChart: {
        labels: Array<string>;
        datasets: {
            data: Array<number>;
        };
    };
    topTalents?: {
        program: string;
        data: { rank: number; name: string; image: string }[];
    }[];

}

export interface BarChartOptions {
    plugins: {
        legend: {
            labels: {
                fontColor: string;
            };
        };
    };
    scales: {
        x: {
            ticks: {
                color: string;
                font: {
                    weight: number;
                };
            };
            grid: {
                display: boolean;
                drawBorder: boolean;
            };
        };
        y: {
            ticks: {
                color: string;
            };
            grid: {
                color: string;
                drawBorder: boolean;
            };
        };
    };

}

export interface PieChartOptions {
    plugins: {
        legend: {
            labels: {
                usePointStyle: boolean;
                color: string;
            };
        };
    };

}





