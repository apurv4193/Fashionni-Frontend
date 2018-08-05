import { Component, OnInit, AfterViewInit, HostListener, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { CompanyService } from './../../core/service/company-service/company.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { Location } from '@angular/common';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-product-colour',
	templateUrl: './product-colour.component.html',
	styleUrls: ['./product-colour.component.css']
})
export class ProductColourComponent implements OnInit, AfterViewInit {
	colorForm: FormGroup;
	isFormOpen = false;
	colorImage: String = '../../../assets/images/plus-small.png';
	FormData = new FormData();
	FormDataEdit = new FormData();
	validationFlagData: boolean;
	validationFlagEmpty: boolean;
	allColorData: any;
	colorFormEdit: any;
	editImage: String = '';
	editId: any;
	lengthAllData: any;
	pageId: any = 1;
	newLenght: any;
	colorVar = [
		'color_name_en',
		'color_name_ch',
		'color_name_ge',
		'color_name_fr',
		'color_name_it',
		'color_name_sp',
		'color_name_ru',
		'color_name_jp'
	];
	allData = [];
	readNotificationsList = [];
	unReadNotificationList = [];
	hideNotificationFlag: any;
	editButtonFlag: any = false;
	deleteFlag: any;
	@ViewChild('colorList') colorListRef: ElementRef;
	constructor(private _message: MessageServiceService,
		public _company: CompanyService,
		private _fb: FormBuilder,
		public _util: UtilService,
		private _notificationService: NotificationServiceService,
		private _local: LocalStorageService,
		public _location: Location
	) {
		this.colorForm = this._fb.group({
			color_name_en: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ch: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ge: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_fr: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_it: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_sp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ru: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_jp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_image: [{ value: '', disabled: !this.isFormOpen }]
		});

		this.colorFormEdit = this._fb.group({
			color_name_en: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ch: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ge: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_fr: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_it: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_sp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_ru: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_name_jp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			color_image: [{ value: '', disabled: !this.isFormOpen }]
		});

		this.getAllColor();
	}

	ngOnInit() {
		this.getAllNotifications();
		this.hideNotificationFlag = this._local.getItem('colorIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
	}

	onWindowScroll() {

		const pos = (this.colorListRef.nativeElement.scrollTop || document.body.scrollTop) + this.colorListRef.nativeElement.offsetHeight;
		const max = this.colorListRef.nativeElement.scrollHeight;
		// console.log(this.colorListRef.nativeElement.offsetHeight);
		// console.log(this.colorListRef.nativeElement.scrollHeight);
		if (pos === max) {
			console.log(this.pageId);
			if (this.pageId !== 1) {
				this._company.getColorDetail(this.pageId)
					.subscribe(updateRes => {
						if (updateRes['data']) {
							this.lengthAllData = this.allData.length;
							console.log(this.lengthAllData);
							for (let i = 0; i < updateRes['data'].length; i++) {
								console.log(updateRes['data'][i]);
								this.allData.push(updateRes['data'][i]);
							}
							this.newLenght = this.allData.length;
							if (this.lengthAllData < this.newLenght) {
								this.pageId = this.pageId + 1;
							}
						}
					});
			}
		}
	}

	formOpen(isFormOpen) {
		$('.lock-icon').toggleClass('submit-text');
		this.colorForm.markAsUntouched();
		this.colorFormEdit.markAsUntouched();
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
			for (const data of this.colorVar) {
				this.colorForm.get(data).enable();
				// this.colorFormEdit.get(data).enable();
			}
		} else {
			for (const data of this.colorVar) {
				this.colorForm.get(data).disable();
				this.colorFormEdit.get(data).disable();
			}
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

			if (srcEle.files && srcEle.files[0]) {
				if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
					this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {
					this.FormData.append('color_image', srcEle.files[0]);
					this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
				}
			}
			// }
		}
	}

	base64ArrayInit(base64) {
		this.colorImage = base64;
	}

	fileEditChange(event) {
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
					this.FormDataEdit.append('color_image', srcEle.files[0]);
					this._util.readProductURL(srcEle.files[0], this.base64EditArrayInit.bind(this));
				}
			}
		}
	}

	base64EditArrayInit(base64) {
		this.editImage = base64;
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}

	base64Image(base64) {
		this.colorImage = base64;
	}

	colorSave(form: NgForm) {
		// asdasd
		if (this.colorForm.valid) {
			for (const data in form.value) {
				if (data !== 'color_image') {
					if (form.value[data] === '') {
						this.validationFlagEmpty = false;
					} else {
						this.validationFlagData = true;
					}
				}
			}

			if (this.validationFlagData === true) {
				this.validationFlagData = false;
				this.FormData.append('color_name_en', form.value.color_name_en);
				this.FormData.append('color_name_ch', form.value.color_name_ch);
				this.FormData.append('color_name_ge', form.value.color_name_ge);
				this.FormData.append('color_name_fr', form.value.color_name_fr);
				this.FormData.append('color_name_it', form.value.color_name_it);
				this.FormData.append('color_name_sp', form.value.color_name_sp);
				this.FormData.append('color_name_ru', form.value.color_name_ru);
				this.FormData.append('color_name_jp', form.value.color_name_jp);
				this._company['saveColors'](this.FormData)
					.subscribe(res => {
						// this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === 1) {
							this._util.showSuccess(res['message']);
							// this.colorForm.controls['color_name_ch'].setValue('');
							// this.colorForm.controls['color_name_en'].setValue('');
							// this.colorForm.controls['color_name_fr'].setValue('');
							// this.colorForm.controls['color_name_ge'].setValue('');
							// this.colorForm.controls['color_name_it'].setValue('');
							// this.colorForm.controls['color_name_jp'].setValue('');
							// this.colorForm.controls['color_name_ru'].setValue('');
							// this.colorForm.controls['color_name_sp'].setValue('');
							// this.colorImage = '../../../assets/images/plus-small.png';
							this.getAllColor();
							this.getAllNotifications();
							this.pageId = this.pageId - 1;
						} else {
							this._util.showError(res['message']);
						}
					},
						error => {
							// this.isFormOpen = false;
							this.handleChange();
							switch (error.status) {
								case 400:
									this._util.showError(error.error['message']);
									break;

								default:
									this._util.showError('Something went wrong.!');
									break;
							}
						});
			} else {
				this._util.showError('Please insert at least one color language');
			}
		} else {
			for (const data of this.colorVar) {
				this.colorForm.controls[data].markAsTouched();
			}
			// this.colorForm.controls['color_name_en'].touched;
		}
		for (const data of this.colorVar) {
			this.colorForm.controls[data].markAsUntouched();
		}
	}

	editColor(editId) {
		// colorFormEdit
		if (this.colorFormEdit.valid) {
			const postObj = {
				id: editId,
				'_method': 'put'
			};
			for (const data of this.colorVar) {
				if (this.colorFormEdit.value[data] === null) {
					this.colorFormEdit.value[data] = '';
				}
				this.FormDataEdit.append(data, this.colorFormEdit.value[data]);
			}
			this.FormDataEdit.append('_method', 'put');
			this.FormDataEdit.append('id', editId);
			this._company.editCompanyColorDetail(postObj, this.FormDataEdit)
				.subscribe(updateRes => {
					if (updateRes['status'] === 1) {
						this._util.showSuccess(updateRes['message']);
						// for (const data of this.colorVar) {
						// 	this.colorFormEdit.controls[data].setValue('');
						// }
						// for (const data of this.colorVar) {
						// this.colorForm.controls[data].disable();
						// 	this.colorFormEdit.controls[data].disable();
						// }
						// this.editImage = '';
						// this.isFormOpen = false;
						this.editButtonFlag = false;
						this.getAllColor();
					} else {
						this._util.showError(updateRes['message']);
						// this.editImage = '';
						// this.isFormOpen = true;
						this.editButtonFlag = true;
					}
					// for (const data of this.colorVar) {
					// 	this.colorFormEdit.controls[data].setValue('');
					// }
					// for (const data of this.colorVar) {
					// 	this.colorForm.controls[data].disable();
					// 	this.colorFormEdit.controls[data].disable();
					// }
					// this.editImage = '';
					// this.isFormOpen = false;
					// this.editButtonFlag = false;
					// this.getAllColor();
				});
		} else {
			for (const data of this.colorVar) {
				this.colorFormEdit.controls[data].markAsTouched();
			}
		}
	}

	getAllColor() {
		this.pageId = 1;
		this._company.getColorDetail(0)
			.subscribe(updateRes => {
				if (updateRes['data']) {
					this.allData = updateRes['data'];
					this.pageId = 2;
				}
			});

		// this.onWindowScroll()
	}

	getColorById(id, index) {
		this.deleteFlag = true;
		if (this.isFormOpen) {
			this.editButtonFlag = true;
			for (const i in this.allData) {
				if (this.allData[i]) {
					this.allData[i]['isSelected'] = false;
				}
			}
			this.allData[index]['isSelected'] = true;
		}

		if (this.isFormOpen) {

			for (const data of this.colorVar) {
				this.colorFormEdit.get(data).enable();
			}
			for (const data of this.allData) {
				if (data.id === id) {
					this.editImage = data.color_image;
					this.editId = data.id;
					this.colorFormEdit.controls['color_name_en'].setValue(data.color_name_en);
					this.colorFormEdit.controls['color_name_ch'].setValue(data.color_name_ch);
					this.colorFormEdit.controls['color_name_fr'].setValue(data.color_name_fr);
					this.colorFormEdit.controls['color_name_ge'].setValue(data.color_name_ge);
					this.colorFormEdit.controls['color_name_it'].setValue(data.color_name_it);
					this.colorFormEdit.controls['color_name_jp'].setValue(data.color_name_jp);
					this.colorFormEdit.controls['color_name_ru'].setValue(data.color_name_ru);
					this.colorFormEdit.controls['color_name_sp'].setValue(data.color_name_sp);
				}
			}
		}
	}

	deleteImage(id) {
		if (this.isFormOpen) {
			this.FormData.append('id', id);
			this._company.deleteColorImageById(this.FormData)
				.subscribe(res => {
					if (res['status'] === 1) {
						this.editImage = '';
						this._util.showSuccess(res['message']);
						this.FormData.append('color_image', '');
						this.FormDataEdit.append('color_image', '');
						this.getAllColor();
					} else {
						// this._util.showError(res['message']);
					}
				});
		}
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'color_details'
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

	deleteColor(id) {
		if (id) {
			if (this.isFormOpen) {
				this._company.deleteColorById(id)
					.subscribe(res => {
						if (res['status'] === 1) {
							this._util.showSuccess(res['message']);
							this.colorFormEdit.controls['color_name_ch'].setValue('');
							this.colorFormEdit.controls['color_name_en'].setValue('');
							this.colorFormEdit.controls['color_name_fr'].setValue('');
							this.colorFormEdit.controls['color_name_ge'].setValue('');
							this.colorFormEdit.controls['color_name_it'].setValue('');
							this.colorFormEdit.controls['color_name_jp'].setValue('');
							this.colorFormEdit.controls['color_name_ru'].setValue('');
							this.colorFormEdit.controls['color_name_sp'].setValue('');
							this.editImage = '';
							this.deleteFlag = false;
							for (const data of this.colorVar) {
								this.colorFormEdit.get(data).disable();
							}

							this.getAllColor();

						} else {
							this._util.showError(res['message']);
						}
					});
			}
		}
	}

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		console.log(this.hideNotificationFlag);
		this._local.setItem('colorIsNotification', this.hideNotificationFlag);
	}
}