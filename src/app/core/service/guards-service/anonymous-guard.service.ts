import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UtilService } from '../util-service/util.service';

@Injectable()
export class AnonymousGuardService {

    constructor(
    private router: Router,
    private _util: UtilService) 
    {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> 
    {
        if (!this._util.isUserLoggedIn()) 
        {
            return true;
        }

        // do something if not logged in
       if(this._util.isAdmin()) {
            this.router.navigate(['admin/companies']);
        }
        else
        {
            this.router.navigate(['store/boutique-registration']);
        }
        return false;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> 
    {
        return this.canActivate(childRoute, state);
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> 
    {
        if (!this._util.isUserLoggedIn()) {
        return true;
        }
        return false;
    }
}
