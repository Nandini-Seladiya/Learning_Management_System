import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AppUi } from 'src/app/services/app-ui/app-ui.service';
import { HttpService } from 'src/app/services/http/http.service';

export function AuthGuard(route: ActivatedRouteSnapshot): Observable<true | Promise<boolean>> {
  return checkUserAccess(route);
}

/**
 * this will control the routes
 * @param {ActivatedRouteSnapshot} route 
 * @returns {Observable<true | Promise<boolean>>}
 */

function checkUserAccess(route: ActivatedRouteSnapshot): Observable<true | Promise<boolean>> {
  const appUI = inject(AppUi);
  const router = inject(Router);
  const _httpService = inject(HttpService);

  return _httpService.getUserPermissions().pipe(
    map((permisions: number[]) => {
      for (var i in appUI.getPermissionMapping) {
        var newRoute = `/dashboard/${route['routeConfig']!['path']}`;
        if (newRoute == appUI.getPermissionMapping[i].label) {
          if (permisions.includes(appUI.getPermissionMapping[i].value)) {
            console.log('granted');
            return true;
          }
        }
      }
      return router.navigate(['/auth/access-denied']);
    })
  )
}

export function checkForToken(route: ActivatedRouteSnapshot): boolean  {
  const router = inject(Router);
  if(localStorage.getItem('token')) {
    return false;
  }
  else return true;
}