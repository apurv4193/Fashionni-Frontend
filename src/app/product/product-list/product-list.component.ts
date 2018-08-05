import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { ProductService } from './../../core/service/product-service/product.service';
import { CategoryService } from './../../core/service/category-service/category.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';


declare function unescape(s: string): string;
declare function escape(s: string): string;
@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {

	companyIdCoded = '';
	productFilterObject = {
		company_id: '',
		category_1_id: '',
		category_2_id: '',
		category_3_id: '',
		brand_id: '',
		search_text: '',
		page_no: 1,
		date: ''
	};

	categoryFilterObject = {
		category: 0
	};
	categories = {
		category1: [],
		category2: [],
		category3: []
	};
	boutiqueObject = {};
	allProducts = [];
	isAdmin = <any>this._util.isAdmin();
	constructor(
		private router: Router,
		private _message: MessageServiceService,
		private _product: ProductService,
		private _category: CategoryService,
		private route: ActivatedRoute,
		public _util: UtilService,
		private _local: LocalStorageService
	) {
		this._message.getBrandForSideMenu()
		.subscribe( res => {
			this.productFilterObject['brand_id'] = res['id'];
			if (!this.isAdmin) {
				this.resetFilter();
			}
		});
	}

	brands = [];

	categoryFilter(level) {
		if (level > 0) {
			if (this.productFilterObject['category_' + (level - 1) + '_id'] !== '') {
				this._category.getSubcategoryCategory({ id: this.productFilterObject['category_' + (level - 1) + '_id'] })
					.subscribe(res => {
						if (res['status'] === 1) {
							this.categories['category' + level] = res['data']['child_categroies'];
							this.resetFilter();
						}
					});
			} else {
				this.categories['category2'] = [];
				this.categories['category2'] = [];

				this.productFilterObject['category_1_id'] = '';
				this.productFilterObject['category_2_id'] = '';
				this.productFilterObject['category_3_id'] = '';

				this.resetFilter();
			}
		} else {
			this.resetFilter();
		}
	}
	getBrand() {
		this._product.getAllProductBrands()
			.subscribe(res => {
				if (res['status'] === 1) {
					this.brands = res['data'];
				} else {
					console.log('no record found');
				}
			},
			error => {
				switch (error.status) {
					case 400:
						this._util.showError(error.error['message']);
						break;

					default:
						this._util.showError('Something went wrong.!');
						break;
				}
			});
	}
	ngOnInit() {
		this.isAdmin = <any>this._util.isAdmin();
		this.getBrand();
		this.getMainCategory();

		this.route.params.subscribe(params => {
			if (atob(params['id']) === '0') {
				this.clear();
			} else {
				this.productFilterObject['company_id'] = atob(params['id']);
				this.companyIdCoded = params['id'];
				this.resetFilter();
			}
			setTimeout(() => {
				this._message.setProductSideMenuBoutiqueClicked(+atob(params['id']));
			});
		});
	}

	clear() {
		this.productFilterObject = {
			company_id: '',
			category_1_id: '',
			category_2_id: '',
			category_3_id: '',
			brand_id: '',
			search_text: '',
			page_no: 1,
			date: ''
		};

		this.resetFilter();
	}

	resetFilter() {
		if (!this._util.isAdmin()) {
			this.productFilterObject['company_id'] = this._util.getCompanyId();
		}

		this.getAllProductByFilter();
	}

	redirect(id, company_id) {
		const url = encodeURI(`product/add-product/${escape(company_id)}/${escape(id)}`);
		this.router.navigateByUrl(url);
	}

	getAllProductByFilter() {
		console.log(this.productFilterObject['company_id']);
		this._product.getAllProductByFilter(this.productFilterObject)
			.subscribe(res => {
				console.log(res);
				this._local.setItem('default-rate', res['default_vat_rate']);

				if (res['status'] === '1') {
					if (res['data'].length > 0) {
						for (const i in res['data']) {
							if (i) {
								if (res['data'][i].hasOwnProperty) {
									res['data'][i]['images'] = [false, false, false, false, false];
									for (const j in res['data'][i]['product_images']) {
										if (j) {
											if (res['data'][i]['product_images'].hasOwnProperty) {
												res['data'][i]['images'][res['data'][i]['product_images'][j]['file_position']] = true;
											}
											res['data'][i]['bannerImage'] = this.isImageUploaded(res['data'][i]['product_images']);
										}
									}
									res['data'][i]['bannerImage'] = this.isImageUploaded(res['data'][i]['product_images']);
									res['data'][i]['id'] = btoa(res['data'][i]['id']);
									res['data'][i]['company_id'] = btoa(res['data'][i]['company_id']);
									console.log(res['data'][i].default_vat_rate);
									this._message.setDefaultValue(res['data'][i].default_vat_rate);
								}
								this.allProducts = res['data'];
							}
						}
					} else {
						this.allProducts = [];
					}
				} else {
					this.router.navigateByUrl('');
				}
			});
	}

	isImageUploaded(imageObject) {
		if (imageObject.length === 0) {
			return '';
		} else {
			for (const img of imageObject) {
				return img['file_name'];
			}
		}
	}

	getMainCategory() {
		this._category.getMainCategory({})
			.subscribe(res => {
				if (res['status'] === 1) {
					this.categories.category1 = res['data'];
				}
			});
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}
}
