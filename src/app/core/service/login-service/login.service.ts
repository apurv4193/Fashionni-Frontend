import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './../local-storage/local-storage.service';
import { MessageServiceService } from './../message-service/message-service.service';
import { Router } from '@angular/router';
import { UtilService } from './../util-service/util.service';
@Injectable()
export class LoginService {

	constructor(
		private httpService: HttpService,
		private _local: LocalStorageService,
		private router: Router,
		private _message: MessageServiceService,
		public _util: UtilService
	) {
	}

	login(data: any): Observable<any> {
		return this.httpService.post(appApiResources.login, data);
	}

	// register(user: any, referralCode: string): Observable<any> {
	// 	let url = `${APIConstant.register}`;
	// 	if (!Utility.isEmpty(referralCode)) {
	// 		url = `${url}/${referralCode}`;
	// 	}

	// 	return this.baseService.post(url, user);
	// }

	/**
	 * Logout user
	 */
	logout() {
		const data = {
			'device_type': '1'
		};

		this.httpService.post(appApiResources.logout, data)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._local.clearStorage();
					this._message.setLoggedIn(false);
					this.redirectToLogin();
					this._util.showSuccess(res['message']);
				} else {
					this._local.clearStorage();
					this._message.setLoggedIn(false);
					this.redirectToLogin();
					this._util.showError(res['message']);
				}
			}, error => {
				this._local.clearStorage();
				this._message.setLoggedIn(false);
				this.redirectToLogin();
			});
	}

	redirectToLogin() {
		this.router.navigateByUrl('/login');
	}
}