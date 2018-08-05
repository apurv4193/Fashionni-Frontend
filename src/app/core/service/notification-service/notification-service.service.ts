import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { LocalStorageService } from './../local-storage/local-storage.service';

@Injectable()
export class NotificationServiceService {

	constructor(
		private httpService: HttpService,
		private _localStorage: LocalStorageService) {

	}

	getReadNotification(postData) {

		if ( this._localStorage.getItem('store-company-id') != null ) {
			postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		}

		return this.httpService.post(appApiResources.getReadNotification, postData);
	}

	getUnReadNotification(postData) {
		if ( this._localStorage.getItem('store-company-id') != null ) {
			postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		}
		return this.httpService.post(appApiResources.getUnReadNotification, postData);
	}

	setReadNotification(postData) {
		return this.httpService.post(appApiResources.setReadNotification, postData);
	}

}
