import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './../local-storage/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './../login-service/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(public auth: LoginService) {

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (!req.headers.has('Content-Type')) {
			req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('fsni-user-token'))) });
		}

		return next.handle(req).do((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
				return next.handle(req);
				// do stuff with response if you want
			}
		}, (err: any) => {
			if (err instanceof HttpErrorResponse) {
				if (err.status === 401) {
					this.auth.logout();
				}
			}
		});
	}
}
