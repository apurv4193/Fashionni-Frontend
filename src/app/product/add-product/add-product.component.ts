import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from './../../core/service/company-service/company.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { UtilService } from './../../core/service/util-service/util.service';
import { ProductService } from './../../core/service/product-service/product.service';
import { CategoryService } from './../../core/service/category-service/category.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
declare function unescape(s: string): string;
declare function escape(s: string): string;
@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, AfterViewInit, OnDestroy {
	private sub: any;
	colors = [];
	material = [];
	brands = [];
	allBrands = [];
	productForm: FormGroup;
	inventoryForm: FormGroup;
	FormData = new FormData();
	selectedChar = '=';
	company_id = 0;
	color_ids: String = '';
	material_ids: String = '';
	permission = true;
	productImageSet = [
		'../../../assets/images/plus-default.png',
		'../../../assets/images/plus-default.png',
		'../../../assets/images/plus-default.png',
		'../../../assets/images/plus-default.png',
		'../../../assets/images/plus-default.png',
		'../../../assets/images/plus-default.png'
	];
	selectedMenu: String = '';
	isSaving = false;

	category_images = [];

	brandsOriginalIngoImage = '../../../assets/images/plus-default.png';
	washCareMaterialImage = '../../../assets/images/plus-default.png';
	codeImage = '../../../assets/images/plus-default.png';

	popupArray = {
		category1: false,
		category2: false,
		category3: false,
		category4: false,
		brand: false,
		color: false,
		code: false,
		material: false
	};

	categories = {
		category1: [],
		category2: [],
		category3: [],
		category4: []
	};

	isPriceSectionShown = true;

	displayArray = {
		category1: 'Category I',
		category2: 'Category II',
		category3: 'Category III',
		category4: 'Category IV',
		brand: 'Brand',
		color: 'Colour',
		code: 'Code',
		material: 'Material'
	};

	productFilterObject = {
		category_1_id: '',
		category_2_id: '',
		category_3_id: '',
		category_4_id: ''
	};

	brandFilterAlphaArray = ['=', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
		'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

	inputTextFields = ['is_published', 'id', 'company_id', 'action', 'product_name_en', 'product_name_ch', 'product_name_fr',
		'product_name_ge', 'product_name_it', 'product_name_jp', 'product_name_ru', 'product_name_sp', 'short_description', 'material_detail',
		'code_number', 'category_level1_id', 'category_level2_id', 'category_level3_id', 'category_level4_id', 'product_image',
		'product_retail_price', 'product_discount_rate', 'product_discount_amount', 'product_outlet_price', 'product_vat_rate', 'product_vat',
		'product_outlet_price_exclusive_vat', 'fashionni_fees', 'product_code_barcode', 'product_code_boutique', 'product_code_rfid',
		'product_notice'];

	productImageindex = -1;
	productId = 0;
	productDetails = {};
	page_no = 1;
	is_next_inventory = false;
	invertories = [];
	readNotificationsList = [];
	unReadNotificationList = [];
	productNumberInfo = { product_unique_id: '', company_unique_id: '', last_generated_number: 0 };
	isAdmin = false;
	hideNotificationFlag: any;
	constructor(
		private _message: MessageServiceService,
		private route: ActivatedRoute,
		private _product: ProductService,
		private _fb: FormBuilder,
		public _util: UtilService,
		private _category: CategoryService,
		private _router: Router,
		private _notification: NotificationServiceService,
		private _local: LocalStorageService) {

		this.isAdmin = <any>this._util.isAdmin();

		this.route.params.subscribe(params => {
			if (atob(unescape(params['id'])) > '0') {
				this.getProductDetails(atob(unescape(params['id'])));
				this.productId = Number.parseInt(atob(unescape(params['id'])));
			} else {
				this.getAllColor();
				this.getAllBrands();
				this.getAllMaterial();
				console.log(this._local.getItem('default-rate'));
			}
			this.company_id = +atob(unescape(params['company_id']));
		});

		this.initForm();
		this.getProductInventory();
		this.initFormInventory();
	}

	readNotification(obj, index) {
		const postObj = {
			notification_id: obj['id']
		};

		this._notification.setReadNotification(postObj)
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

	publishProduct(saveFlag) {
		this.saveProduct(saveFlag);
	}

	productFileChange(event, index) {
		this.productImageindex = index;
		const productDataIndex = index + 1;
		const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
		if (window.navigator.userAgent.indexOf('Chrome') === -1) {
			var srcEle = event.explicitOriginalTarget;
		} else {
			var srcEle = event.srcElement;
		}
		// const srcEle = event.srcElement;

		if (srcEle.files && srcEle.files[0]) {
			if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
				this._util.showError('Please upload valid format .jpg, .jpeg, .png, .gif');
			} else {
				this.FormData.append('product_image_' + productDataIndex, srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.productImageSetBase64.bind(this));

				let image_stringify = [];
				if (this.productForm.value['product_image'] !== null) {
					image_stringify = JSON.parse(this.productForm.value['product_image']);
					image_stringify[index] = { position: productDataIndex, image_name: 'product_image_' + productDataIndex };
					this.productForm.controls['product_image'].setValue(JSON.stringify(image_stringify));
				} else {
					image_stringify[index] = { position: productDataIndex, image_name: 'product_image_' + productDataIndex };
					this.productForm.controls['product_image'].setValue(JSON.stringify(image_stringify));
				}

				const t = [];
				for (const x of JSON.parse(this.productForm.value['product_image'])) {
					if (x !== null) {
						t.push(x);
					}
				}
				this.productForm.controls['product_image'].setValue(JSON.stringify(t));
			}
		}
	}

	getProductInventory() {
		if (this.productId > 0) {
			const obj = {
				page_no: this.page_no,
				product_id: this.productId
			};
			this._product.getProductInventory(obj)
				.subscribe(res => {
					this.invertories = res['data'];
					this.is_next_inventory = res['next'];
					this.productNumberInfo['product_unique_id'] = res['product_unique_id'];
					this.productNumberInfo['company_unique_id'] = res['company_unique_id'];
					this.productNumberInfo['last_generated_number'] = res['last_generated_number'];
					for (const x of this.invertories) {
						const control = <FormArray>this.inventoryForm.controls['itemRows'];
						control.push(this.initItemRowsForEdit(x));
					}
				});

			this.page_no++;
		}
	}

	saveProductInventory() {
		const product_obj = JSON.stringify(this.inventoryForm.value.itemRows);
		const obj = {
			'product_id': this.productId,
			'product_inventory': product_obj
		};
		this._product.saveProductInventory(obj)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._util.showSuccess(res['message']);
					this.getProductInventory();
				}
			});
	}

	productImageSetBase64(base64) {
		this.productImageSet[this.productImageindex] = base64;
	}

	productBrandInfoChange(event) {
		const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
		if (window.navigator.userAgent.indexOf('Chrome') === -1) {
			var srcEle = event.explicitOriginalTarget;
		} else {
			var srcEle = event.srcElement;
		}
		// const srcEle = event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
				this._util.showError('Please upload valid format .jpg, .jpeg, .png, .gif');
			} else {
				this.FormData.append('brand_label_with_original_information_image', srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.productBrandInfoImageSetBase64.bind(this));
			}
		}
	}

	productBrandInfoImageSetBase64(base64) {
		this.brandsOriginalIngoImage = base64;
	}

	washCareMaterialImageChange(event) {
		const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
		if (window.navigator.userAgent.indexOf('Chrome') === -1) {
			var srcEle = event.explicitOriginalTarget;
		} else {
			var srcEle = event.srcElement;
		}
		// const srcEle = event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
				this._util.showError('Please upload valid format .jpg, .jpeg, .png, .gif');
			} else {
				this.FormData.append('wash_care_with_material_image', srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.washCareMaterialImageSetBase64.bind(this));
			}
		}
	}

	washCareMaterialImageSetBase64(base64) {
		this.washCareMaterialImage = base64;
	}

	changeCodeImage(event) {
		const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
		if (window.navigator.userAgent.indexOf('Chrome') === -1) {
			var srcEle = event.explicitOriginalTarget;
		} else {
			var srcEle = event.srcElement;
		}
		// const srcEle = event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
				this._util.showError('Please upload valid format .jpg, .jpeg, .png, .gif');
			} else {
				this.FormData.append('code_image', srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.codeImageSetBase64.bind(this));
			}
		}
	}

	codeImageSetBase64(base64) {
		this.codeImage = base64;
	}

	brandFilter(char) {
		this.selectedChar = char;
		this.brands = [];
		if (char === '=') {
			this.brands = this.allBrands;
		} else {
			for (const x in this.allBrands) {
				if (this.allBrands.hasOwnProperty(x)) {
					const index = this.allBrands[x]['brand_name'].charAt(0).toUpperCase();
					if (! /^[A-Z]+$/.test(index)) {
						if (char === '#') {
							this.brands.push(this.allBrands[x]);
						}
					} else {
						if (index === char) {
							this.brands.push(this.allBrands[x]);
						}
					}
				}
			}
		}
	}
	getProductDetails(id) {
		this._product.getProductDetails({ product_id: id })
			.subscribe(res => {
				this.productDetails = res['data'];
				this.setFormValue();
				this.getAllColor();
				this.getAllMaterial();
				this.getAllBrands();

				this.displayArray['category1'] = res['data']['category_level1'] === null ? 'Category 1' :
					res['data']['category_level1']['category_name_en'];

				this.displayArray['category2'] = res['data']['category_level2'] === null ? 'Category 2' :
					res['data']['category_level2']['category_name_en'];

				this.displayArray['category3'] = res['data']['category_level3'] === null ? 'Category 3' :
					res['data']['category_level3']['category_name_en'];

				this.displayArray['category4'] = res['data']['category_level4'] === null ? 'Category 4' :
					res['data']['category_level4']['category_name_en'];
			});
	}

	deleteProduct() {
		const obj = { product_id: this.productId };
		this._product.deleteProduct(obj)
			.subscribe(res => {
				if (res['status'] === '1') {
					this._util.showSuccess(res['message']);
					this._router.navigateByUrl('product/product-list/');
				}
			});
	}

	calculate(type) {
		console.log('calling...');
		const _1 = Number.parseInt(this.productForm.value['product_retail_price']);

		if (_1 <= 0 || _1.toString() === 'NaN') {
			this.productForm.controls['product_retail_price'].setValue('');
		}

		const _2 = Number.parseInt(this.productForm.value['product_discount_rate']);
		let _3 = Number.parseInt(this.productForm.value['product_discount_amount']);
		let _5 = Number.parseInt(this.productForm.value['product_vat_rate']);

		if (type === 'rate') {
			this.productForm.controls['product_discount_amount'].setValue(((_1 * _2) / 100).toFixed(2));
		} else if (type === 'amount') {
			this.productForm.controls['product_discount_rate'].setValue(((100 * _3) / _1).toFixed(2));
		}
		_3 = Number.parseInt(this.productForm.value['product_discount_amount']);
		this.productForm.controls['product_outlet_price'].setValue((_1 + _3).toFixed(2));
		const _4 = this.productForm.value['product_outlet_price'];
		_5 = _5 / 100;
		this.productForm.controls['product_vat'].setValue((_4 / (1 + _5) * _5).toFixed(2));
		this.productForm.controls['product_outlet_price_exclusive_vat'].setValue((_4 / (1 + _5)).toFixed());
		const _7 = this.productForm.value['product_outlet_price_exclusive_vat'];
		this.productForm.controls['fashionni_fees'].setValue((_7 * 0.10).toFixed(2));
	}

	checkAll4Category(saveFlag) {
		if (saveFlag === 1) {
			if (!(this.productForm.value['category_level1_id'] !== 0 &&
				this.productForm.value['category_level2_id'] !== 0 &&
				this.productForm.value['category_level3_id'] !== 0)) {
				this._util.showError('Please choose all 3 categories.');
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}

	saveProduct(saveFlag) {
		if (this.checkAll4Category(saveFlag)) {
			this.productForm.controls['is_published'].setValue(saveFlag);
			if (this.isSaving === false) {
				this.isSaving = true;
				this._util.startLoading();
				for (const i of this.inputTextFields) {
					if (this.productForm.value[i] === undefined || this.productForm.value[i] == null) {
					} else {
						this.FormData.append(i, this.productForm.value[i]);
					}
				}

				this._product.saveProduct(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this._util.showSuccess(res['message']);
							this.getAllNotifications();
							this._util.completeLoading();
							this.isSaving = false;
							this._router.navigateByUrl('/product/product-list/' + btoa('0'));
						} else {
							this._util.showError(res['message']);
						}
					}, error => {
						this._util.completeLoading();
						this.isSaving = false;
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
		}
	}

	setFormValue() {
		for (const i of this.inputTextFields) {
			if (this.productDetails[i] !== undefined) {
				this.productForm.controls[i].setValue(this.productDetails[i]);
			}
		}

		if (this.productDetails['product_vat_rate'] === '') {
			this.productForm.controls['product_vat_rate'].setValue(this._local.getItem('default-rate'));
		}

		for (const i of this.productDetails['product_images']) {
			this.productImageSet[(i['file_position'] - 1)] = i['file_name'];
		}

		if (this.productDetails['wash_care_with_material_image'] !== '') {
			this.washCareMaterialImage = this.productDetails['wash_care_with_material_image'];
		}

		if (this.productDetails['brand_label_with_original_information_image'] !== '') {
			this.brandsOriginalIngoImage = this.productDetails['brand_label_with_original_information_image'];
		}

		if (!this.isAdmin) {
			this.productForm.disable();

			this.productForm.controls['product_retail_price'].enable();
			this.productForm.controls['product_discount_rate'].enable();
			this.productForm.controls['product_discount_amount'].enable();
			this.productForm.controls['product_vat_rate'].enable();

			this.productForm.controls['product_code_barcode'].enable();
			this.productForm.controls['product_code_boutique'].enable();
			this.productForm.controls['product_code_rfid'].enable();

			this.productForm.controls['product_outlet_price'].enable();
			this.productForm.controls['product_vat'].enable();
			this.productForm.controls['product_outlet_price_exclusive_vat'].enable();
			this.productForm.controls['fashionni_fees'].enable();
		}
		this.productForm.controls['id'].enable();
		this.productForm.controls['action'].enable();

		this.productForm.controls['category_level1_id'].enable(this.productDetails['category_level1_id']);
		this.productForm.controls['category_level2_id'].enable(this.productDetails['category_level1_id']);
		this.productForm.controls['category_level3_id'].enable(this.productDetails['category_level1_id']);
		this.productForm.controls['category_level4_id'].enable(this.productDetails['category_level1_id']);

		this.productForm.controls['id'].setValue(this.productDetails['id']);
		this.productForm.controls['action'].setValue(2);
	}

	initFormInventory() {
		this.inventoryForm = this._fb.group({
			itemRows: this._fb.array([])
		});
	}

	initItemRows() {
		this.productNumberInfo['last_generated_number'] = Number.parseInt(this.productNumberInfo['last_generated_number'] + '') + 1;
		const fashionni_id = this.productNumberInfo['company_unique_id'] + this.productNumberInfo['product_unique_id'] + '-'
			+ this.productNumberInfo['last_generated_number'];

		return this._fb.group({
			product_standard: [''],
			product_size: [''],
			product_warehouse: [''],
			id: [0],
			fashionni_id: [fashionni_id],
			product_quantity: [1],
			sold_by: [0],
			whoIsSellerBoutique: [false],
			whoIsSellerSuperAdmin: [false]
		});
	}

	initItemRowsForEdit(obj) {

		let whoIsSellerBoutique = false;
		let whoIsSellerSuperAdmin = false;
		if (obj['sold_by'] === 1) {
			whoIsSellerBoutique = true;
		} else if (obj['sold_by'] === 2) {
			whoIsSellerSuperAdmin = true;
		}

		return this._fb.group({
			product_standard: [obj['product_standard']],
			product_size: [obj['product_size']],
			product_warehouse: [obj['product_warehouse']],
			id: [obj['id']],
			fashionni_id: [obj['fashionni_id']],
			product_quantity: [obj['product_quantity']],
			sold_by: [obj['sold_by']],
			whoIsSellerBoutique: [whoIsSellerBoutique],
			whoIsSellerSuperAdmin: [whoIsSellerSuperAdmin]
		});
	}

	soldByInventory(i, type, event) {
		console.log(type);
		if (type === 1) {
			if (event.target.checked) {
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerSuperAdmin'].setValue(!event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerBoutique'].setValue(event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['product_quantity'].setValue(0);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['sold_by'].setValue(1);
			} else {
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['product_quantity'].setValue(1);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerBoutique'].setValue(event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['sold_by'].setValue(0);
			}
		} else if (type === 2) {
			if (event.target.checked) {
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerBoutique'].setValue(!event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerSuperAdmin'].setValue(event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['product_quantity'].setValue(0);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['sold_by'].setValue(2);
			} else {
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['product_quantity'].setValue(1);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['whoIsSellerSuperAdmin'].setValue(event.target.checked);
				this.inventoryForm.controls['itemRows']['controls'][i]['controls']['sold_by'].setValue(0);
			}
		}

		console.log(this.inventoryForm.value);
	}

	addNewRow() {
		const control = <FormArray>this.inventoryForm.controls['itemRows'];
		control.push(this.initItemRows());
	}

	deleteRow(index: number, id: number) {
		const control = <FormArray>this.inventoryForm.controls['itemRows'];
		control.removeAt(index);

		if (id > 0) {
			this._product.deleteInventory({ id: id })
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
					}
				});
		}
	}

	initForm() {
		this.productForm = this._fb.group({
			action: [1],
			id: [0],
			company_id: [this.company_id],
			brand_id: [],
			is_published: [0],
			product_name_en: [],
			product_name_ch: [],
			product_name_ge: [],
			product_name_fr: [],
			product_name_it: [],
			product_name_sp: [],
			product_name_ru: [],
			product_name_jp: [],
			category_level1_id: [],
			category_level2_id: [],
			category_level3_id: [],
			category_level4_id: [],
			code_number: [],
			product_notice: [],
			product_retail_price: [],
			product_discount_rate: [],
			product_discount_amount: [],
			product_vat_rate: [this._local.getItem('default-rate')],
			product_vat: [],
			product_outlet_price: [],
			product_outlet_price_exclusive_vat: [],
			fashionni_fees: [],
			product_code_barcode: [],
			product_code_boutique: [],
			product_code_rfid: [],
			short_description: [],
			material_detail: [],
			product_image: [],
			brand_label_with_original_information_image: [],
			wash_care_with_material_image: [],
			code_image: []
		});
	}

	chooseCategory(type, index, level, id, formDataKey) {
		if (this.isAdmin) {
			this.productFilterObject['category_' + (level) + '_id'] = id;
			this.productForm.controls[formDataKey].setValue(id);

			let loopIndex = 0;
			for (const i of this.categories[type]) {
				this.categories[type][loopIndex++]['isSelected'] = '';
			}
			this.categories[type][index]['isSelected'] = 'active';
			this.displayArray[type] = this.categories[type][index]['category_name_en'];

			if (type === 'category1') {
				this.categories['category2'] = [];
				this.categories['category3'] = [];
				this.categories['category4'] = [];

				this.displayArray['category2'] = 'Category II';
				this.displayArray['category3'] = 'Category III';
				this.displayArray['category4'] = 'Category IV';

				this.productForm.controls['category_level2_id'].setValue(0);
				this.productForm.controls['category_level3_id'].setValue(0);
				this.productForm.controls['category_level4_id'].setValue(0);
			} else if (type === 'category2') {
				this.categories['category3'] = [];
				this.categories['category4'] = [];
				this.displayArray['category3'] = 'Category III';
				this.displayArray['category4'] = 'Category IV';
				this.productForm.controls['category_level3_id'].setValue(0);
				this.productForm.controls['category_level4_id'].setValue(0);

			} else if (type === 'category3') {
				this.categories['category4'] = [];
				this.displayArray['category4'] = 'Category IV';
				this.productForm.controls['category_level4_id'].setValue(0);
			}

			if (formDataKey === 'category_level1_id') {
				this.productFilterObject['category_' + (level + 1) + '_id'] = 0;
				this.productFilterObject['category_' + (level + 2) + '_id'] = 0;
				this.productFilterObject['category_' + (level + 3) + '_id'] = 0;
			} else if (formDataKey === 'category_level2_id') {
				this.productFilterObject['category_' + (level + 2) + '_id'] = 0;
				this.productFilterObject['category_' + (level + 3) + '_id'] = 0;
			} else if (formDataKey === 'category_level3_id') {
				this.productFilterObject['category_' + (level + 3) + '_id'] = 0;
			}

			this.getCategory(level);
		}
	}

	getCategory(level) {
		if (this.productFilterObject['category_' + (level) + '_id'] !== 0) {
			this._category.getSubcategoryCategory({ id: this.productFilterObject['category_' + (level) + '_id'] })
				.subscribe(res => {
					this.category_images = [];

					if (res['status'] === 1) {
						if (res['data'].hasOwnProperty('category_images')) {
							if (res['data']['category_images'].length > 0) {
								this.category_images = res['data']['category_images'];
								this.category_images[0]['isActive'] = 'active';
							}
							this.categories['category' + (level + 1)] = res['data']['child_categroies'];
						}
					}
				});
		}
	}

	changeImage(index) {
		let ind = 0;
		for (const x of this.category_images) {
			this.category_images[ind]['isActive'] = '';
			ind++;
		}
		this.category_images[index]['isActive'] = 'active';
	}

	chooseBrand(index) {
		if (this.isAdmin) {
			let loopIndex = 0;
			for (const i of this.brands) {
				this.brands[loopIndex++]['isSelected'] = '';
			}
			this.FormData.set('brand_id', this.brands[index]['id']);
		}
		this.brands[index]['isSelected'] = 'active';
		this.displayArray['brand'] = this.brands[index]['brand_name'];
	}


	setSelectedColor() {
		if (this.productDetails['product_colors'] !== undefined) {
			let id_str = '';
			for (const x of this.productDetails['product_colors']) {
				let innerIndex = 0;
				for (const y of this.colors) {
					if (x['color_id'] === y['id']) {
						this.colors[innerIndex]['isSelected'] = 'active';
						id_str += y['id'] + ',';
					}
					innerIndex++;
				}
			}
			id_str = id_str.substr(0, id_str.length - 1);
			this.FormData.set('product_color', id_str);
		}
	}

	setSelectedMaterial() {
		if (this.productDetails['product_materials'] !== undefined) {
			let id_str = '';
			for (const x of this.productDetails['product_materials']) {
				let innerIndex = 0;
				for (const y of this.material) {
					if (x['material_id'] === y['id']) {
						this.material[innerIndex]['isSelected'] = 'active';
						id_str += y['id'] + ',';
					}
					innerIndex++;
				}
			}
			id_str = id_str.substr(0, id_str.length - 1);
			this.FormData.set('product_material', id_str);
		}
	}

	chooseColor(index) {
		if (this.isAdmin) {
			this.colors[index]['isSelected'] = this.colors[index]['isSelected'] === 'active' ? '' : 'active';
			this.color_ids = '';
			for (const i of this.colors) {
				if (i['isSelected'] === 'active') {
					this.color_ids += i['id'] + ',';
				}
			}
			this.FormData.delete('product_color');
			this.color_ids = this.color_ids.substr(0, this.color_ids.length - 1);
			this.FormData.append('product_color', this.color_ids.toString());
		}
	}

	chooseMaterial(index) {
		if (this.isAdmin) {
			this.material[index]['isSelected'] = this.material[index]['isSelected'] === 'active' ? '' : 'active';

			this.material_ids = '';
			for (const i of this.material) {
				if (i['isSelected'] === 'active') {
					this.material_ids += i['id'] + ',';
				}
			}
			this.FormData.delete('product_material');
			this.material_ids = this.material_ids.substr(0, this.material_ids.length - 1);
			this.FormData.append('product_material', this.material_ids.toString());
		}
	}

	ngOnInit() {
		this.hideNotificationFlag = this._local.getItem('productIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		this.route.params.subscribe(params => {
			this._message.setProductSelectedInSideMenu(params);
		});
		this.getMainCategory();
		this.getAllNotifications();

	}

	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
		this._message.getDefaultValue().subscribe(res => {
			console.log(res);
			// this.productForm.controls['product_retail_price'].setValue('asdasd');
			// this.productForm.controls['product_vat_rate'].setValue(res);
		});
		// this.productForm.controls['product_vat_rate'].setValue();

	}

	ngOnDestroy() {
		if (this.sub !== undefined) {
			this.sub.unsubscribe();
		}
	}

	getAllColor() {
		this._product.getAllColors()
			.subscribe(res => {
				if (res['status'] === 1) {
					this.colors = res['data'];
					this.setSelectedColor();
				}
			});
	}

	getAllMaterial() {
		this._product.getAllMaterials()
			.subscribe(res => {
				if (res['status'] === 1) {
					this.material = res['data'];
					this.setSelectedMaterial();
				}
			});
	}

	setSelectedBrand() {
		let index = 0;
		for (const x of this.allBrands) {
			if (x['id'] === this.productDetails['brand_id']) {
				this.chooseBrand(index);
				index++;
				this.FormData.set('brand_id', x['id']);
				break;
			}
			index++;
		}
	}
	getAllBrands() {
		this._product.getAllProductBrands()
			.subscribe(res => {
				if (res['status'] === 1) {
					this.brands = res['data'];
					this.allBrands = this.brands;
					this.setSelectedBrand();
				}
			});
	}

	getMainCategory() {
		this._category.getMainCategory({})
			.subscribe(res => {
				if (res['status'] === 1) {
					this.categories.category1 = res['data'];

					this.showPopup('category1');
					this.showPopup('category2');
					this.showPopup('category3');
					this.showPopup('category4');
					this.selectedMenu = '';
					this.isPriceSectionShown = true;
				}
			});
	}

	showPopup(popupType) {
		this.selectedMenu = popupType;
		if (this.categories[popupType] !== undefined) {
			for (const x of this.categories[popupType]) {
				if (x['category_name_en'] === this.displayArray[popupType]) {
					x['isSelected'] = 'active';
				}
			}
		}

		for (const i in this.popupArray) {
			if (popupType !== i) {
				this.popupArray[i] = false;
			}
		}

		this.popupArray[popupType] = !this.popupArray[popupType];
		this.isPriceSectionShown = !this.popupArray[popupType];

		const category_check = ['category1', 'category2', 'category3', 'category4'];
		const category_id = {
			'category1': 'category_level1_id', 'category2': 'category_level2_id',
			'category3': 'category_level3_id', 'category4': 'category_level4_id'
		};

		if (category_check.indexOf(popupType) > -1) {
			this.productFilterObject['category_' + (category_check.indexOf(popupType) + 1) + '_id'] =
				this.productForm.value[category_id[popupType]];
			this.getCategory(category_check.indexOf(popupType) + 1);
		}
	}

	openAddEditPage(pageName) {
		if (this._util.isAdmin()) {
			if (this.productForm.dirty) {
				const r = confirm('Please make sure your form is saved before leaving');
				if (r === true) {
					this._router.navigateByUrl(pageName);
				}
			} else {
				this._router.navigateByUrl(pageName);
			}
		}
	}

	openAddEditPageForBrand(pageName) {
		if (this._util.isAdmin()) {
			if (this.productForm.dirty) {
				const r = confirm('Please make sure your form is saved before leaving');
				if (r === true) {
					this._router.navigateByUrl(pageName + '/' + btoa(this.company_id + ''));
				}
			} else {
				this._router.navigateByUrl(pageName + '/' + btoa(this.company_id + ''));
			}
		}
	}

	getAllNotifications() {
		if (this.productId > 0) {
			const postObj = {
				notification_page: 'product_details',
				product_id: this.productId
			};

			this._notification.getUnReadNotification(postObj)
				.subscribe(notificationRes => {
					this.unReadNotificationList = notificationRes['data'].map(data => {
						const obj = Object.assign({}, data);
						obj.date_1 = data['created_at'];
						obj.date_2 = data['created_at'];
						return obj;
					});
				});

			this._notification.getReadNotification(postObj)
				.subscribe(notificationRes => {
					this.readNotificationsList = notificationRes['data'].map(data => {
						const obj = Object.assign({}, data);
						obj.date_1 = data['created_at'];
						obj.date_2 = data['created_at'];
						return obj;
					});
				});
		}
	}

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		this._local.setItem('productIsNotification', this.hideNotificationFlag);
	}
}
