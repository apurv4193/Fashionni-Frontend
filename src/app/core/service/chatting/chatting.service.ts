import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './../local-storage/local-storage.service';

@Injectable()
export class ChattingService {

	constructor(private httpService: HttpService, private _localStorage: LocalStorageService) { }

	getBoutiqueUsers(data) {
		console.log(data.page);
		return this.httpService.post(appApiResources.getBoutiqueUser, data);
	}

	getSuperAdminForBoutique(data) {
		console.log(data.page);
		return this.httpService.post(appApiResources.chatSuperAdminUsers, data);
	}

	adChatUser(data) {
		return this.httpService.post(appApiResources.addChatUser, data);
	}
}
