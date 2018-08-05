import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from './../local-storage/local-storage.service';

@Injectable()

export class CompanyService {

	constructor(private httpService: HttpService, private _localStorage: LocalStorageService) {
	}

	getCompany() {
		return this.httpService.post(appApiResources.getCompany, {});
	}

	addCompany(postData) {
		return this.httpService.post(appApiResources.addCompany, postData);
	}

	getCompanyDetails(postData) {
		return this.httpService.post(appApiResources.getCompanyDetails, postData);
	}

	deleteCompanyStoreDetail(postData) {
		return this.httpService.post(appApiResources.deleteCompanyStoreDetail, postData);
	}

	changeCompanyLogo(postData) {
		return this.httpService.post(appApiResources.changeCompanyLogo, postData);
	}

	setBoutiqueDataForSuperAdminAccess(company_id: number) {
		this._localStorage.setItem('store-company-id', company_id);
		this._localStorage.setItem('is-default', btoa('1'));
		this._localStorage.setItem('is-admin', btoa('1'));
	}

	clearBoutiqueDataForSuperAdminAccess() {
		this._localStorage.removeItem('store-company-id');
		this._localStorage.removeItem('is-default');
		this._localStorage.removeItem('is-admin');
	}

	saveColors(postData) {
		return this.httpService.post(appApiResources.saveColor, postData);
	}

	editCompanyColorDetail(colorData, data) {
		const url = appApiResources.editColor.replace('{id}', colorData.id);
		return this.httpService.post(url, data);
	}

	getColorDetail(id) {
		const url = appApiResources.getColor.replace('{id}', id);
		return this.httpService.get(url);
	}

	getCompanyColorDetailById(colorData) {
		const url = appApiResources.editColor.replace('{id}', colorData.color_id);
		return this.httpService.get(url);
	}

	deleteColorImageById(data) {
		return this.httpService.post(appApiResources.deleteColorImage, data);
	}

	deleteColorById(data) {
		const url = appApiResources.deleteColorById.replace('{id}', data);
		return this.httpService.delete(url);
	}

	getCompanySearch (data) {
		return this.httpService.post(appApiResources.getCompanySearch, data);
	}
}
