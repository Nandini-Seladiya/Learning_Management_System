import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UnauthorizedAccessComponent } from './modules/auth/unauthorized-access/unauthorized-access.component';

const routes: Routes = [
    { path: '', loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule) },
    { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', component: UnauthorizedAccessComponent },
    { path: '**', redirectTo: '/notfound' }
]

const routeConfigs: ExtraOptions = { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }

@NgModule({
    imports: [RouterModule.forRoot(routes, routeConfigs)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
