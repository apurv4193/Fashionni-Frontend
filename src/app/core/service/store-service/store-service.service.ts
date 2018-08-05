import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { LocalStorageService } from './../local-storage/local-storage.service';

@Injectable()
export class StoreServiceService {

	constructor(private httpService: HttpService, private _localStorage: LocalStorageService) { }

	getBoutiqueRegistration(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.boutiqueRegistration, postData);
	}

	getCompanyTaxDetail(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.getTextDetail, postData);
	}

	saveCompanyTextDetail(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.saveTextDetail, postData);
	}

	saveCompanyRegisterDetails(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.saveCompanyRegisterDetails, postData);
	}

	saveCustoms(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.saveCustoms, postData);
	}

	getCustomsDetail(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.getCustoms, postData);
	}
	updateDocuments(postData) {
		return this.httpService.post(appApiResources.updateDocuments, postData);
	}

	getCompanyBankDetail(postData) {
		postData['company_id'] = atob(this._localStorage.getItem('store-company-id'));
		return this.httpService.post(appApiResources.getBankDetail, postData);
	}

	saveCompanyBankDetail(postData) {
		return this.httpService.post(appApiResources.saveBankDetail, postData);
	}

	deleteCompanyBankDetail(postData) {
		return this.httpService.post(appApiResources.deleteBankDetail, postData);
	}

	getCompanyUserList(postData) {
		return this.httpService.post(appApiResources.getCompanyUserList, postData);
	}

	getCompanyProfileDetail(postData) {
		return this.httpService.post(appApiResources.getCompanyProfile, postData);
	}

	saveCompanyProfileDetail(postData) {
		return this.httpService.post(appApiResources.saveCompanyProfile, postData);
	}

	getCompanyStoreList(postData) {
		return this.httpService.post(appApiResources.getCompanyStoreList, postData);
	}

	getStoreDetail(postData) {
		return this.httpService.post(appApiResources.getStoreList, postData);
	}

	saveStoreDetail(postData) {
		return this.httpService.post(appApiResources.saveStoreList, postData);
	}

	getCompanyAllPermission(postData) {
		return this.httpService.post(appApiResources.getCompanyAllPermissionWithRole, postData);
	}

	saveCompanyUserDetail(postData) {
		return this.httpService.post(appApiResources.saveCompanyUserDetail, postData);
	}

	getCompanUserDetails(postData) {
		return this.httpService.post(appApiResources.getCompanyUserDetail, postData);
	}

	getCompanyUserPermissionDetail() {
		const userData = this._localStorage.getItem('user');
		const postData = {
			company_id: atob(this._localStorage.getItem('store-company-id')),
			user_id: userData['id']
		};

		return this.httpService.post(appApiResources.getUserPermission, postData);
	}

	changeStoreLogo(postData) {
		return this.httpService.post(appApiResources.changeStoreLogo, postData);
	}
}
