import { Component, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { filter, Observable, Subscription } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
// import { TranslateService } from '@ngx-translate/core';
@Component({
    templateUrl: './dashboard.component.html',
})
// @Input('dataOfLang') langData =''
export class DashboardComponent implements OnInit, OnDestroy {

    overlayMenuOpenSubscription: Subscription;


    // Prime NG's any
    menuOutsideClickListener: any;
    profileMenuOutsideClickListener: any;


    private _routerEvent: Subscription;
    public items: MenuItem[] = [{ routerLink: '/dashboard/home', icon: 'pi pi-home' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];

    @ViewChild(SidenavComponent) sidenav!: SidenavComponent;

    @ViewChild(HeaderComponent) header!: HeaderComponent;

    public currentLanguage: string = 'en';

    constructor(
        public appUI: AppUi,
        public renderer: Renderer2,
        public router: Router,
        public translate: TranslateService
    ) {

        translate.addLangs(['en', 'nl', 'fre', 'spanish', 'gujarati', 'germen']);
        translate.setDefaultLang(this.currentLanguage);

        this.overlayMenuOpenSubscription = this.appUI.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.sidenav.el.nativeElement.isSameNode(event.target) || this.sidenav.el.nativeElement.contains(event.target)
                        || this.header.menuButton.nativeElement.isSameNode(event.target) || this.header.menuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.profileMenuOutsideClickListener) {
                this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.header.menu.nativeElement.isSameNode(event.target) || this.header.menu.nativeElement.contains(event.target)
                        || this.header.topbarMenuButton.nativeElement.isSameNode(event.target) || this.header.topbarMenuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideProfileMenu();
                    }
                });
            }

            if (this.appUI.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this._routerEvent = this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
            this._updateBreadCrum(e.url)
            this.hideMenu();
            this.hideProfileMenu();
        });
    }
    ngOnInit(): void {
        if (!localStorage.getItem('token')) this.router.navigate(['/auth/access-denied']);
        if (!localStorage.getItem('isLoggedIn')) this.router.navigate(['/auth/login']);
    }

    /**
     * Updating bread crums according to the path url
     * @param {string} url 
     */
    private _updateBreadCrum(url: string) {
        this.items = [{ routerLink: '/dashboard/home', icon: 'pi pi-home' }];
        switch (url) {
            case ('/dashboard/home'):
                this.items.push({
                    label: 'Home',
                    routerLink: url
                })
                break;
            case ('/dashboard/my-programs'):
                this.items.push({
                    label: 'My Programs',
                    routerLink: url
                })
                break;
            case ('/dashboard/my-grades'):
                this.items.push({
                    label: 'My Grades',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/my-grades\/*/)?.input:
                this.items.push({
                    label: 'My Grades',
                    routerLink: '/dashboard/my-grades'
                });
                this.items.push({
                    label: url.split('/').pop(),
                    routerLink: url
                });
                break;
            case ('/dashboard/program-publication'):
                this.items.push({
                    label: 'Program Publication',
                    routerLink: url
                })
                break;
            case ('/dashboard/program-activation'):
                this.items.push({
                    label: 'Program Activation',
                    routerLink: url
                })
                break;
            case ('/dashboard/talent-evaluation'):
                this.items.push({
                    label: 'Talent Evaluation',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/talent-evaluation\/*/)?.input:
                this.items.push({
                    label: 'Talent Evaluation',
                    routerLink: '/dashboard/talent-evaluation'
                });
                this.items.push({
                    label: url.split('/').pop(),
                    routerLink: url
                });
                break;
            case ('/dashboard/all-talents'):
                this.items.push({
                    label: 'All Talents',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/all-talents\/view\/*/)?.input:
                this.items.push({
                    label: 'All Talent',
                    routerLink: '/dashboard/all-talents'
                });
                this.items.push({
                    label: 'View Profile',
                    routerLink: url
                });
                break;
            case url.match(/dashboard\/all-talents\/edit\/*/)?.input:
                this.items.push({
                    label: 'All Talent',
                    routerLink: '/dashboard/all-talents'
                });
                this.items.push({
                    label: 'Edit Profile',
                    routerLink: url
                });
                break;
            case ('/dashboard/all-trainers'):
                this.items.push({
                    label: 'All Trainers',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/all-trainers\/view\/*/)?.input:
                this.items.push({
                    label: 'All Trainers',
                    routerLink: '/dashboard/all-trainers'
                });
                this.items.push({
                    label: 'View Profile',
                    routerLink: url
                });
                break;
            case url.match(/dashboard\/all-trainers\/edit\/*/)?.input:
                this.items.push({
                    label: 'All Trainers',
                    routerLink: '/dashboard/all-trainers'
                });
                this.items.push({
                    label: 'Edit Profile',
                    routerLink: url
                });
                break;
            case ('/dashboard/all-programs'):
                this.items.push({
                    label: 'All Programs',
                    routerLink: url
                })
                break;
            case ('/dashboard/all-trainers/add-trainer'):
                this.items.push({
                    label: 'All Trainers',
                    routerLink: '/dashboard/all-trainers'
                });
                this.items.push({
                    label: 'Add New Trainer',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/all-programs\/edit\/*/)?.input:
                this.items.push({
                    label: 'All Programs',
                    routerLink: '/dashboard/all-programs'
                });
                this.items.push({
                    label: 'Edit Profile',
                    routerLink: url
                });
                break;
            case ('/dashboard/all-programs/add-program'):
                this.items.push({
                    label: 'All Programs',
                    routerLink: '/dashboard/all-programs'
                });
                this.items.push({
                    label: 'Add New Program',
                    routerLink: url
                })
                break;
            case ('/dashboard/enrollment-approvals'):
                this.items.push({
                    label: 'Enrollment Approval',
                    routerLink: url
                })
                break;
            case ('/dashboard/talent-approvals'):
                this.items.push({
                    label: 'Talent Approval',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/enrollment-approvals\/view\/*/)?.input:
                this.items.push({
                    label: 'Enrollment Approval',
                    routerLink: '/dashboard/enrollment-approvals'
                });
                this.items.push({
                    label: 'View Profile',
                    routerLink: url
                });
                break;
            case url.match(/dashboard\/talent-approvals\/view\/*/)?.input:
                this.items.push({
                    label: 'Talent Approval',
                    routerLink: '/dashboard/talent-approvals'
                });
                this.items.push({
                    label: 'View Profile',
                    routerLink: url
                });
                break;
            case ('/dashboard/settings'):
                this.items.push({
                    label: 'Settings',
                    routerLink: url
                })
                break;
            case ('/dashboard/role-management'):
                this.items.push({
                    label: 'Role Management',
                    routerLink: url
                })
                break;
            case ('/dashboard/user-management'):
                this.items.push({
                    label: 'User Management',
                    routerLink: url
                })
                break;
            case ('/dashboard/profile'):
                this.items.push({
                    label: 'Profile',
                    routerLink: url
                })
                break;
            case ('/dashboard/profile/edit-trainer'):
                this.items.push({
                    label: 'Profile',
                    routerLink: url
                });
                this.items.push({
                    label: 'Edit Profile',
                    routerLink: url
                })
                break;
            case ('/dashboard/profile/edit-talent'):
                this.items.push({
                    label: 'Profile',
                    routerLink: url
                });
                this.items.push({
                    label: 'Edit Profile',
                    routerLink: url
                })
                break;
            case ('/dashboard/history'):
                this.items.push({
                    label: 'Program History',
                    routerLink: url
                })
                break;
            case url.match(/dashboard\/history\/*/)?.input:
                this.items.push({
                    label: 'Talents',
                    routerLink: '/dashboard/history'
                });
                this.items.push({
                    label: url.split('/').pop(),
                    routerLink: url
                });
                break;
            default:

                break;
        }
    }

    hideMenu() {
        this.appUI.state.overlayMenuActive = false;
        this.appUI.state.staticMenuMobileActive = false;
        this.appUI.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.appUI.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.appUI.config.colorScheme === 'light',
            'layout-theme-dark': this.appUI.config.colorScheme === 'dark',
            'layout-overlay': this.appUI.config.menuMode === 'overlay',
            'layout-static': this.appUI.config.menuMode === 'static',
            'layout-static-inactive': this.appUI.state.staticMenuDesktopInactive && this.appUI.config.menuMode === 'static',
            'layout-overlay-active': this.appUI.state.overlayMenuActive,
            'layout-mobile-active': this.appUI.state.staticMenuMobileActive,
            'p-input-filled': this.appUI.config.inputStyle === 'filled',
            'p-ripple-disabled': !this.appUI.config.ripple
        }
    }
    switchLang(e: string) {
        this.currentLanguage = e;
        this.translate.use(e);
    }

    ngOnDestroy() {

        if (this._routerEvent) {
            this._routerEvent.unsubscribe();
        }

        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }

    }
}
