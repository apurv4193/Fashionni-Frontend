import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { ProductService } from './../../core/service/product-service/product.service';
import { CategoryService } from './../../core/service/category-service/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { Location } from '@angular/common';

declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-product-brand',
	templateUrl: './product-brand.component.html',
	styleUrls: ['./product-brand.component.css']
})
export class ProductBrandComponent implements OnInit, AfterViewInit, OnDestroy {

	saveBrandForm: FormGroup;
	editBrandForm: FormGroup;
	company_id = 0;
	totalBrands = 0;
	isFormOpen: any = false;
	SaveFormData = new FormData();
	EditFormData = new FormData();
	brandImage: String = '../../../assets/images/plus-default.png';
	editBrandName: String;
	editBrandImage: String;
	brandId: number;
	readNotificationsList = [];
	unReadNotificationList = [];
	editFlag: any = false;
	masterBrandArray = {
		a: [],
		b: [],
		c: [],
		d: [],
		e: [],
		f: [],
		g: [],
		h: [],
		i: [],
		j: [],
		k: [],
		l: [],
		m: [],
		n: [],
		o: [],
		p: [],
		q: [],
		r: [],
		s: [],
		t: [],
		u: [],
		v: [],
		w: [],
		x: [],
		y: [],
		z: [],
		other: []
	};
	hideNotificationFlag: any;
	allBrands: any;

	sortArray = ['=', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '#'];

	allBrandsRes: any;
	sortBrand = '=';
	boutiqueBrands: any;

	constructor(
		private router: Router,
		private _message: MessageServiceService,
		private _product: ProductService,
		private _category: CategoryService,
		private route: ActivatedRoute,
		private _fb: FormBuilder,
		public _util: UtilService,
		private _notificationService: NotificationServiceService,
		private _local: LocalStorageService,
		private _location: Location) {
		this.saveBrandForm = this._fb.group({
			brandName: [{ value: '', disabled: !this.isFormOpen }],
		});
		this.editBrandForm = this._fb.group({
			brandName: [{ value: '', disabled: !this.isFormOpen }],
		});
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			setTimeout(() => {
				this.company_id = +atob(params['id']);
				this._message.setProductSideMenuBoutiqueClicked(this.company_id);
				this.getBoutiqueBrands();
			});
		});

		this.hideNotificationFlag = this._local.getItem('brandIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}

		this.getAllProductBrands();
		this.getAllNotifications();
	}
	saveBrand(form: NgForm) {
		this.SaveFormData.append('brand_name', form.value.brandName);
		this._product.saveBrand(this.SaveFormData)
			.subscribe(res => {
				if (res['status'] === 1) {
					this.getAllProductBrands();
					this._util.showSuccess(res['message']);
				} else {
					this._util.showError(res['message']);
				}
			});
	}

	formOpen(isFormOpen) {
		$('.lock-icon').toggleClass('submit-text');
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			this._location.back();
			this.isFormOpen = false;
			this.handleChange();
		}
	}

	handleChange() {
		if (this.isFormOpen) {
			this.saveBrandForm.get('brandName').enable();
			// this.editBrandForm.get('brandName').enable();
		} else {
			this.saveBrandForm.get('brandName').disable();
			this.editBrandForm.get('brandName').disable();
		}
	}

	fileChange(event) {
		if (this.isFormOpen) {
			const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
			if (window.navigator.userAgent.indexOf('Chrome') === -1) {
				var srcEle = event.explicitOriginalTarget;
			} else {
				var srcEle = event.srcElement;
			}
			// const srcEle = event.srcElement;
			if (srcEle.files && srcEle.files[0]) {
				if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
					this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {
					this.SaveFormData.append('brand_image', srcEle.files[0]);
					this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
				}
			}
		}
	}

	base64ArrayInit(base64) {
		this.brandImage = base64;
	}

	fileChangeEdit(event) {
		if (this.isFormOpen) {
			const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
			if (window.navigator.userAgent.indexOf('Chrome') === -1) {
				var srcEle = event.explicitOriginalTarget;
			} else {
				var srcEle = event.srcElement;
			}
			// const srcEle = event.srcElement;
			if (srcEle.files && srcEle.files[0]) {
				if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
					this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {
					this.EditFormData.append('brand_image', srcEle.files[0]);
					this._util.readProductURL(srcEle.files[0], this.base64ArrayInitEdit.bind(this));
				}
			}
		}
	}

	base64ArrayInitEdit(base64) {
		this.editBrandImage = base64;
	}


	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}

	ngOnDestroy() {
	}

	/**
	 * Get All brands list and sorting A-Z
	 */
	getAllProductBrands() {
		this.masterBrandArray = {
			a: [],
			b: [],
			c: [],
			d: [],
			e: [],
			f: [],
			g: [],
			h: [],
			i: [],
			j: [],
			k: [],
			l: [],
			m: [],
			n: [],
			o: [],
			p: [],
			q: [],
			r: [],
			s: [],
			t: [],
			u: [],
			v: [],
			w: [],
			x: [],
			y: [],
			z: [],
			other: []
		};
		this._product.getAllProductBrands()
			.subscribe(brandRes => {
				this.totalBrands = brandRes['data'].length;
				this.allBrandsRes = brandRes;
				for (let item in brandRes['data']) {
					brandRes['data'][item]['isSelected'] = false;
					let index = brandRes['data'][item]['brand_name'].charAt(0).toLowerCase();
					if (! /^[a-z]+$/.test(index)) {
						this.masterBrandArray['other'].push(brandRes['data'][item]);
					} else {
						this.masterBrandArray[index].push(brandRes['data'][item]);
					}
				}
				this.allBrands = this.masterBrandArray;
			});
	}

	/**
	 * Get Boutique wise brand list
	 */
	getBoutiqueBrands() {
		// alert('asd');
		this._product.getBoutiqueBrands(this.company_id)
			.subscribe(brandRes => {
				for (let x in brandRes['data']) {
					brandRes['data'][x].isSelected = false;
				}
				this.boutiqueBrands = brandRes['data'];
			});
	}

	editBrands(brandKey: number, index: number) {
		if (this.isFormOpen) {
			this.editFlag = true;
			this.editBrandForm.get('brandName').enable();
			for (let x in this.masterBrandArray) {
				for (let item of this.masterBrandArray[x]) {
					item.isSelected = false;
				}
			}

			this.masterBrandArray[brandKey][index].isSelected = true;
			this._product.getBrandForEdit(this.masterBrandArray[brandKey][index].id)
				.subscribe(res => {
					this.brandId = res['data'].id;
					this.editBrandForm.controls['brandName'].setValue(res['data'].brand_name);
					this.editBrandImage = res['data'].brand_image;
				});
		}
	}

	searchBrandByBoutique(item: any) {
		if (this.isFormOpen) {
			this.allBrands = {};
			for (let x in this.boutiqueBrands) {
				this.boutiqueBrands[x].isSelected = false;
			}
			item.isSelected = true;
			let index = item.brand_name.charAt(0).toLowerCase();
			this.sortBrand = index;
			if (! /^[a-z]+$/.test(index)) {
				this.allBrands['other'] = this.masterBrandArray['other'];
			} else {
				this.allBrands[index] = this.masterBrandArray[index];
			}
		}
	}

	sortBrandByAlpha(item: string) {
		if (this.isFormOpen) {
			this.sortBrand = item;
			this.allBrands = {};
			if (item === '=') {
				this.allBrands = this.masterBrandArray;
			} else {
				if (! /^[a-z]+$/.test(item)) {
					this.allBrands['other'] = this.masterBrandArray['other'];
				} else {
					this.allBrands[item] = this.masterBrandArray[item];
				}
			}
			for (let x in this.boutiqueBrands) {
				this.boutiqueBrands[x].isSelected = false;
			}
		}
	}

	searchBrand() {
		const q = this.saveBrandForm.value['brandName'];
		if (q !== '') {
			for (const x in this.allBrands) {
				for (const y of this.allBrands[x]) {
					if (y['brand_name'].indexOf(q) > -1) {
						y['isSelected'] = true;
						//this.allBrands[y].isSelected = true;
					} else {
						y['isSelected'] = false;
					}
				}
				//this.boutiqueBrands[x].isSelected = false;
			}
		} else {
			for (const x in this.allBrands) {
				for (const y of this.allBrands[x]) {
					y['isSelected'] = false;
				}
			}
		}
	}

	updateBrand(id) {
		const data = {
			id: id
		};
		if (id) {
			//  this.EditFormData.append('brand_image', );
			this.EditFormData.append('_method', 'put');
			this.EditFormData.append('id', id);
			this.EditFormData.append('brand_name', this.editBrandForm.value.brandName);

			this._product.UpdateBrandById(data, this.EditFormData)
				.subscribe(res => {
					if (res['status'] === 1) {
						this.getBoutiqueBrands();
						this.getAllProductBrands();
						this._util.showSuccess(res['message']);
					} else {
						this._util.showError(res['message']);
					}
				});
		}
		// this.isFormOpen = true;
		// this.editFlag = true;
		// this.editBrandForm.get('brandName').disable();
	}

	deleteImage(id) {
		this.EditFormData.append('id', id);
		this._product.deleteBrandImage(this.EditFormData)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._util.showSuccess(res['message']);
				} else {
					this._util.showError(res['message']);
				}
			});
	}

	deleteBrand(brandId) {
		if (brandId) {
			if (this.isFormOpen) {
				this._product.deleteBrand(brandId)
					.subscribe(res => {
						if (res['status'] === 1) {
							this.getBoutiqueBrands();
							this.getAllProductBrands();
							this.editBrandImage = '';
							this.editBrandForm.controls['brandName'].setValue('');
							this._util.showSuccess(res['message']);
						} else {
							this._util.showError(res['message']);
						}
					});
			}
		}
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'brand_details'
		};

		this._notificationService.getUnReadNotification(postObj)
			.subscribe(notificationRes => {
				this.unReadNotificationList = notificationRes['data'].map(data => {
					const obj = Object.assign({}, data);
					obj.date_1 = data['created_at'];
					obj.date_2 = data['created_at'];
					return obj;
				});
			});

		this._notificationService.getReadNotification(postObj)
			.subscribe(notificationRes => {
				this.readNotificationsList = notificationRes['data'].map(data => {
					const obj = Object.assign({}, data);
					obj.date_1 = data['created_at'];
					obj.date_2 = data['created_at'];
					return obj;
				});
			});
	}
	readNotification(obj, index) {
		const postObj = {
			notification_id: obj['id']
		};

		this._notificationService.setReadNotification(postObj)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._util.showSuccess(res['message']);
					this.readNotificationsList.push(this.unReadNotificationList[index]);
					this.unReadNotificationList.splice(index, 1);
				} else {
					this._util.showError(res['message']);
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

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		console.log(this.hideNotificationFlag);
		this._local.setItem('brandIsNotification', this.hideNotificationFlag);
	}
}
