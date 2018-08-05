import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';

@Injectable()
export class CategoryService {

	constructor(private httpService: HttpService) {

	}

	getAllCategoryByFilter(data: any) {
		return this.httpService.post(appApiResources.getAllCategoryByFilter, data);
	}

	getMainCategory(data: any) {
		return this.httpService.post(appApiResources.getMainCategory, data);
	}

	getSubcategoryCategory(data: any) {
		return this.httpService.post(appApiResources.getSubCategory, data);
	}

	getCategoryDetails(data) {
		return this.httpService.post(appApiResources.getCategoryDataById, data);
	}

	saveCategory(data) {
		return this.httpService.post(appApiResources.saveCategory, data);
	}

	uploadSingleImage(data) {
		return this.httpService.post(appApiResources.singleImageUpload, data);
	}

	deleteSingleImage(data) {
		return this.httpService.post(appApiResources.deleteSingleImage, data);
	}

	deleteCategoryData(data) {
		return this.httpService.post(appApiResources.deleteCategoryById, data);
	}
}
