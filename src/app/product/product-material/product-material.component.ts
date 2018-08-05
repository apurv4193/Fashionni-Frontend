import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { ProductService } from './../../core/service/product-service/product.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { Location } from '@angular/common';
@Component({
	selector: 'app-product-material',
	templateUrl: './product-material.component.html',
	styleUrls: ['./product-material.component.css']
})
export class ProductMaterialComponent implements OnInit, AfterViewInit {
	isFormOpen = false;
	materialForm: FormGroup;
	materialFormEdit: FormGroup;
	colorImage: String = '../../../assets/images/plus-small.png';
	materialImageEdit: String = '';
	allMaterial = [];
	FormData = new FormData();
	FormDataEdit = new FormData();
	isEditFormOpen = false;
	pageId: any = 1;
	textFieldsArray = [
		'material_name_en',
		'material_name_ch',
		'material_name_ge',
		'material_name_fr',
		'material_name_it',
		'material_name_sp',
		'material_name_ru',
		'material_name_jp',
		'material_image'
	];
	lengthAllData: any;
	allData: any;
	newLenght: any;
	readNotificationsList = [];
	unReadNotificationList = [];
	hideNotificationFlag: any;
	editFormFlag: any = false;
	deleteFlag: any;
	@ViewChild('matList') matListRef: ElementRef;
	constructor(private _message: MessageServiceService,
		private _fb: FormBuilder,
		private _product: ProductService,
		private _util: UtilService,
		private _notificationService: NotificationServiceService,
		private _local: LocalStorageService,
		public _location: Location) {

		this.materialForm = this._fb.group({
			material_name_en: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_ch: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_ge: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_fr: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_it: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_sp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_ru: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_name_jp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			material_image: [{ value: '', disabled: !this.isFormOpen }]
		});

		this.materialFormEdit = this._fb.group({
			material_name_en: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_ch: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_ge: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_fr: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_it: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_sp: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_ru: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_name_jp: [{ value: '', disabled: !this.isEditFormOpen }, Validators.compose([Validators.required])],
			material_image: [{ value: '', disabled: !this.isEditFormOpen }],
			id: [{ value: '', disabled: !this.isEditFormOpen }]
		});
	}

	onWindowScroll() {
		const pos = (this.matListRef.nativeElement.scrollTop || document.body.scrollTop) + this.matListRef.nativeElement.offsetHeight;
		const max = this.matListRef.nativeElement.scrollHeight;

		if (pos === max) {
			if (this.pageId !== 1) {
				this._product.getMaterials(this.pageId)
					.subscribe(updateRes => {
						if (updateRes['data']) {
							this.lengthAllData = this.allMaterial.length;
							for (let i = 0; i < updateRes['data'].length; i++) {
								console.log(updateRes['data'][i]);
								this.allMaterial.push(updateRes['data'][i]);
							}
							this.newLenght = this.allMaterial.length;
							if (this.lengthAllData < this.newLenght) {
								this.pageId = this.pageId + 1;
							}
						}
					});
			}
		}
	}

	materialSave() {
		if (this.materialForm.valid) {
			for (const i of this.textFieldsArray) {
				if (i !== 'material_image') {
					this.FormData.append(i, this.materialForm.value[i]);
				}
			}

			this._product.saveMaterials(this.FormData)
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
						this.materialForm.reset();
						this.getMaterial();
						this.getAllNotifications();
						this.FormData = new FormData();
						this.colorImage = '../../../assets/images/plus-small.png';
					} else {
						this._util.showError(res['message']);
					}
				}, error => {
					switch (error.status) {
						case 400:
							this._util.showError(error.error['message']);
							break;

						default:
							this._util.showError('Something went wrong.!');
							break;
					}
					this.FormData = new FormData();
				});
		} else {
			for (const data of this.textFieldsArray) {
				this.materialForm.controls[data].markAsTouched();
			}
		}
	}
	ngOnInit() {

		this.hideNotificationFlag = this._local.getItem('materialIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		this.getMaterial();
		this.getAllNotifications();
	}
	deleteImage() {
		console.log('delete');
		if (this.isEditFormOpen) {
			this._product.deleteMaterialImage({ id: this.materialFormEdit.value['id'] })
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
						this.materialImageEdit = '';
					}
				});
		}
	}
	updateMaterial() {
		if (this.materialFormEdit.valid) {
			for (const i of this.textFieldsArray) {
				if (i !== 'material_image') {
					if (this.materialFormEdit.value[i] === null) {
						this.materialFormEdit.value[i] = '';
					}
					this.FormDataEdit.append(i, this.materialFormEdit.value[i]);
				}
			}
			this.FormDataEdit.append('_method', 'PUT');
			this.FormDataEdit.append('id', this.materialFormEdit.value['id']);

			this._product.updateMaterials(this.FormDataEdit, this.materialFormEdit.value['id'])
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
						// this.materialFormEdit.reset();
						this.getMaterial();
						this.FormDataEdit = new FormData();
						this.handleChangeForEdit();
						// this.materialImageEdit = '';
						this.isEditFormOpen = true;
						// this.isFormOpen = false;
						for (const i of this.textFieldsArray) {
							this.materialFormEdit.get(i).disable();
						}
					} else {
						// this.isFormOpen = true;
						this.editFormFlag = true;
						this._util.showError(res['message']);
					}
				}, error => {
					switch (error.status) {
						case 400:
							this._util.showError(error.error['message']);
							break;

						default:
							this._util.showError('Something went wrong.!');
							break;
					}
				});
			this.editFormFlag = true;
		} else {
			for (const data of this.textFieldsArray) {
				this.materialFormEdit.controls[data].markAsTouched();
			}
		}
	}

	chooseForEdit(obj, index) {
		for (const data of this.textFieldsArray) {
			this.materialFormEdit.controls[data].markAsTouched();
			this.materialForm.controls[data].markAsUntouched();
		}
		this.deleteFlag = true;
		// this.isEditFormOpen = true;
		console.log(this.isEditFormOpen);
		if (this.isEditFormOpen) {
			for (const i in this.allMaterial) {
				if (this.allMaterial[i].hasOwnProperty) {
					this.allMaterial[i]['isSelected'] = false;
				}
			}
			this.editFormFlag = true;
			for (const i of this.textFieldsArray) {
				this.materialFormEdit.get(i).enable();
			}
			this.allMaterial[index]['isSelected'] = true;

			for (const i of this.textFieldsArray) {
				this.materialFormEdit.controls[i].setValue(obj[i]);
			}
			this.materialFormEdit.controls['id'].setValue(obj['id']);
			this.handleChangeForEdit();
			this.materialImageEdit = obj['material_image'];
			console.log(this.materialFormEdit.value);
		}
	}

	fileChange(event) {
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
				this.FormData.append('material_image', srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
			}
		}
	}
	fileChangeEdit(event) {
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
				this.FormDataEdit.append('material_image', srcEle.files[0]);
				this._util.readProductURL(srcEle.files[0], this.base64ArrayInitEdit.bind(this));
			}
		}
	}

	base64ArrayInitEdit(base64) {
		this.materialImageEdit = base64;
	}

	base64ArrayInit(base64) {
		this.colorImage = base64;
	}

	getMaterial() {
		this.pageId = 1;
		this._product.getMaterials(this.pageId)
			.subscribe(res => {
				if (res['status'] === 1) {
					console.log(res);
					this.allMaterial = res['data'];
					this.pageId = 2;
				}
			});
	}
	formOpen() {
		this.isFormOpen = !this.isFormOpen;
		this.isEditFormOpen = !this.isEditFormOpen;
		this.materialForm.markAsUntouched();
		this.materialFormEdit.markAsUntouched();
		this.handleChange();
		if (this.isFormOpen === false) {
			this._location.back();
		}
	}

	handleChange() {
		if (this.isFormOpen) {
			for (const i of this.textFieldsArray) {
				this.materialForm.get(i).enable();
			}
			for (const i of this.textFieldsArray) {
				// this.materialFormEdit.get(i).enable();
			}
		} else {
			for (const i of this.textFieldsArray) {
				this.materialForm.get(i).disable();
			}
			for (const i of this.textFieldsArray) {
				this.materialFormEdit.get(i).disable();
			}
		}
	}

	handleChangeForEdit() {
		if (this.isEditFormOpen) {
			for (const i of this.textFieldsArray) {
				this.materialFormEdit.get(i).enable();
			}
			this.materialFormEdit.get('id').enable();
		} else {
			for (const i of this.textFieldsArray) {
				this.materialFormEdit.get(i).disable();
			}
			this.materialFormEdit.get('id').disable();
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}


	getAllNotifications() {
		const postObj = {
			notification_page: 'material_details'
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
		this._local.setItem('materialIsNotification', this.hideNotificationFlag);
	}

	deleteMaterial() {
		// asdasd
		for (const i of this.textFieldsArray) {
			this.materialFormEdit.get(i).disable();
		}

		for (const i of this.textFieldsArray) {
			this.materialFormEdit.controls[i].setValue('');
		}
		
		this.materialImageEdit = '';
		if (this.materialFormEdit.value['id']) {
			this._product.deleteMaterialById(this.materialFormEdit.value['id'])
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
						this.getMaterial();
						this.deleteFlag = false;
					}
				}, error => {
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
