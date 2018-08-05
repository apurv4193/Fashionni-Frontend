import { Injectable } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ToastsManager } from 'ng2-toastr';
@Injectable()
export class UtilService {

	constructor(
		private slimLoadingBarService: SlimLoadingBarService,
		private _localStorage: LocalStorageService,
		public toastr: ToastsManager) {
	}

	startLoading() {
		this.slimLoadingBarService.start(() => {
			console.log('Loading complete');
		});
	}

	getPermissionOfPage(page_name) {
		const userPermission = this._localStorage.getItem('user-permission');
		console.log(userPermission);
		if ( userPermission !== null) {
			for ( let i = 0; i < userPermission.length; i++) {
				if (userPermission[i]['pageName'] === page_name ) {
					return userPermission[i];
				}
			}
		}
	}

	getCompanyParam() {
		return this._localStorage.getItem('user')['name'];
	}

	getCompanyId() {
		const isAdmin = atob(this._localStorage.getItem('is-admin'));
		if ( isAdmin === '1') {
			return atob(this._localStorage.getItem('store-company-id'));
		} else {
			return this._localStorage.getItem('company')['company_id'];
		}
	}

	getCompanyHeaderForStore() {
		const isAdmin = atob(this._localStorage.getItem('is-admin'));
		if ( isAdmin === '1') {
			return this._localStorage.getItem('store-obj')['company_unique_id'] + ' - ' + this._localStorage.getItem('store-obj')['company_name'];
		} else {
			return this._localStorage.getItem('company')['company_unique_id'] + ' - ' + this._localStorage.getItem('company')['company_name'];
		}
	}

	stopLoading() {
		this.slimLoadingBarService.stop();
	}

	completeLoading() {
		this.slimLoadingBarService.complete();
	}

	getFormData(data) {
		console.log(data.compName);
	}
	/**
	 * Check user token exist on local storage or not
	 */
	isUserLoggedIn(): boolean {
		const userToken = this._localStorage.getItem('user-token');
		return (userToken) ? true : false;
	}

	/**
	 * Show sucess message on toast
	 * @param message
	 */
	showSuccess(message: string) {
		this.toastr.success(message, 'Success!');
	}

	/**
	 * Show error message on toast
	 * @param message
	 */
	showError(message: string) {
		this.toastr.error(message, 'Oops!');
	}

	isAdmin() {
		const user = this._localStorage.getItem('user');
		return user === null ? '' : user['userType'] === 'admin' ? true : false;
	}

	readProductURL(input: any, callback) {
		if (input) {
			const reader = new FileReader();
			reader.onload = function (e) {
				callback(e['target']['result']);
			};
			reader.readAsDataURL(input);
		}
	}
}
