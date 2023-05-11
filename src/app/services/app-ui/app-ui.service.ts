import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AppConfig, LayoutState } from 'src/assets/interfaces';
import { APP_UI_LIGHT_CONFIG } from 'src/assets/configurations';
import { MenuItem, SelectItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class AppUi {

    public config: AppConfig = APP_UI_LIGHT_CONFIG;

    constructor() { }

    public state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject();

    private permissions: number[] = [];

    private permissionMapping: SelectItem[] = [
        { value: 1, icon: 'pi pi-book', label:'/dashboard/my-programs'},
        { value: 2, icon: 'pi pi-book', label:'/dashboard/my-grades'},
        // { label: 'My Grades / p1', icon: 'pi pi-book', value:'/dashboard/my-grades/p1'}
        { value: 8, icon: 'pi pi-arrow-circle-up', label:'/dashboard/program-publication'},
        { value: 4, icon: 'pi pi-history', label:'/dashboard/program-activation'},
        { value: 3, icon: 'pi pi-check-square', label:'/dashboard/talent-evaluation'},
        // { label: 'Talent Evaluation/ id', icon: 'pi pi-book', value:'/dashboard/talent-evaluation/p1'},
        { value: 5, icon: 'pi pi-users', label:'/dashboard/all-talents'},
        // { label: 'All Talents/ view', icon: 'pi pi-book', value:'/dashboard/all-talents/view/s1'},
        // { label: 'All Talents/ edit', icon: 'pi pi-book', value:'/dashboard/all-talents/edit/s2'},
        { value: 6, icon: 'pi pi-users', label:'/dashboard/all-trainers'},
        // { label: 'All Trainers/ view', icon: 'pi pi-book', value:'/dashboard/all-trainers/view/t1'},
        // { label: 'All Trainers/ edit', icon: 'pi pi-book', value:'/dashboard/all-trainers/edit/t2'},
        { value: 7, icon: 'pi pi-database', label:'/dashboard/all-programs'},
        // { label: 'All Programs/ edit', icon: 'pi pi-book', value:'/dashboard/all-programs/edit/p2'},
        // { value: , icon: 'pi pi-file-import', label:'/dashboard/enrollment-approvals'},
        { value: 9, icon: 'pi pi-sign-in', label:'/dashboard/talent-approvals'},
        { value: 10, icon: 'pi pi-cog', label:'/dashboard/settings'},
        { value: 11, icon: 'pi pi-lock', label:'/dashboard/role-management'},
        { value: 12, icon: 'pi pi-user-edit', label:'/dashboard/user-management'},
        { value: 13, icon: 'pi pi-history', label:'/dashboard/history'}
    ];

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    /**
     * if image loading gives any kind of error, this will remove the entire element rather than showing broken image
     * @param {Event} e 
     */
    imageError(e: Event) {
        (e.target as HTMLImageElement).src = 'assets/images/placeholders/profile-icon.jpg';
    }

    /**
     * if image loading gives any kind of error, this will remove the entire element rather than showing broken image
     * @param {Event} e 
     */
    programImageError(e: Event) {
        (e.target as HTMLImageElement).src = 'assets/images/placeholders/program-image.jpg';
    }


    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        }
        else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    /**
     * this will change the entire theme of application
     * @param {string} theme 
     * @param {string} colorScheme 
     */
    changeFullTheme(theme: string, colorScheme: string) {

        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        var newHref = themeLink.getAttribute('href')!.replace('lara-light-indigo', theme);
        if (!themeLink.getAttribute('href')!.includes(theme)) {
            switch (colorScheme) {
                case 'dark':
                    newHref = themeLink.getAttribute('href')!.replace('lara-light-indigo', theme);
                    break;
                case 'light':
                    newHref = themeLink.getAttribute('href')!.replace('lara-dark-indigo', theme);
                    break;
                default:
                    break;
            }
        }

        this.config.colorScheme
        this.replaceThemeLink(newHref, () => {
            this.config.theme = theme;
            this.config.colorScheme = colorScheme;
            this.onConfigUpdate();
        });
    }


    /**
     * 
     * @param {string} href 
     * @param {Function} onComplete 
     */
    replaceThemeLink(href: string, onComplete: Function) {
        const id = 'theme-css';
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
            onComplete();
        });
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.configUpdate.next(this.config);
    }

    set setPermissions(permissions: number[]) {
        this.permissions = permissions;
    }

    get getPermissionMapping(): SelectItem[] {
        return this.permissionMapping;
    }
}
