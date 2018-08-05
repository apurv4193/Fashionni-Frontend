import { Injectable } from '@angular/core';
import { HttpService } from './../http-service/http.service';
import { appApiResources } from './../../../app.constants';

@Injectable()
export class ProductService {

	constructor(private httpService: HttpService) { }

	getAllProductByFilter(data: any) {
		return this.httpService.post(appApiResources.getAllProductByFilter, data);
	}

	getMaterials(id) {
		const url =  appApiResources.materials.replace('{id}', id);
		return this.httpService.get(url);
	}

	saveMaterials(data: any) {
		return this.httpService.post(appApiResources.saveUpdateMaterials, data);
	}

	updateMaterials(data: any, id: number) {
		return this.httpService.post(appApiResources.saveUpdateMaterials + '/' + id, data);
	}

	deleteMaterialImage(data: any) {
		return this.httpService.post(appApiResources.deleteMmaterialImage, data);
	}

	getAllProductBrands() {
		return this.httpService.get(appApiResources.getAllProductBrand);
	}

	getBoutiqueBrands(id: number) {
		return this.httpService.get(appApiResources.getBoutiqueBrands + '/' + id);
	}
	getAllColors() {
		return this.httpService.get(appApiResources.getAllColors);
	}

	getAllMaterials() {
		return this.httpService.get(appApiResources.getAllMaterials);
	}

	saveBrand(data) {
		return this.httpService.post(appApiResources.saveBrand, data);
	}

	getBrandForEdit(id) {
		const url = appApiResources.getBrandId.replace('{id}', id);
		return this.httpService.get(url);
	}

	UpdateBrandById(idObj, allData) {
		const url = appApiResources.getBrandId.replace('{id}', idObj.id);
		return this.httpService.post(url, allData);
	}

	deleteBrandImage (data) {
		return this.httpService.post(appApiResources.deleteBrandImageById, data);
	}

	deleteBrand (data) {
		const url = appApiResources.deleteBrandById.replace('{id}', data);
		return this.httpService.delete(url);
	}

	saveProduct(data) {
		return this.httpService.post(appApiResources.saveProduct, data);
	}

	getProductDetails(data: any) {
		return this.httpService.post(appApiResources.getProductDetails, data);
	}

	getProductInventory(data: any) {
		return this.httpService.post(appApiResources.getProductInventory, data);
	}

	saveProductInventory(data: any) {
		return this.httpService.post(appApiResources.saveProductInventory, data);
	}

	deleteProduct(data: any) {
		return this.httpService.post(appApiResources.deleteProduct, data);
	}

	deleteInventory(data: any) {
		return this.httpService.post(appApiResources.deleteInventory, data);
	}

	deleteMaterialById(data) {
		const url = appApiResources.deleteMaterial.replace('{id}', data);
		return this.httpService.delete(url);
	}
}
