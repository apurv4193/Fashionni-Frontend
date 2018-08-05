import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserService {

	constructor(private httpService: HttpService) {
	}

	getUser(): Observable<any> {
		return this.httpService.get(appApiResources.getUserProfile);
	}

	changePassword(password: string): Observable<any> {
		return this.httpService.post(appApiResources.changePassword, password);
	}
}