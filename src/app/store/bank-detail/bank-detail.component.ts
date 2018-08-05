import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { CompanyService } from './../../core/service/company-service/company.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-bank-detail',
	templateUrl: './bank-detail.component.html',
	styleUrls: ['./bank-detail.component.css']
})
export class BankDetailComponent implements OnInit {

	company_id: string;
	bankDetail = [];
	public bankForm: FormGroup;
	FormData: any;
	index: any;
	base64Array: Array<{}> = [];
	readNotificationsList = [];
	unReadNotificationList = [];
	isAuthorized = true;
	isFormOpen = false;
	rights = { edit: false, view: false };
	permission = false;
	imageArray = [];
	hideNotificationFlag: any;
	constructor(
		private _fb: FormBuilder,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		private _company: CompanyService,
		private utilService: UtilService,
		private _notificationService: NotificationServiceService) {
		this.base64Array = [];
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
		this.FormData = new FormData();
		this.bankForm = this._fb.group({
			addresses: this._fb.array([])
		});
		this.imageArray.push('../../assets/images/store-1.png');
		this.addAddress();
	}

	addAddress(isAddDefault?) {
		if (this.index === undefined) {
			this.index = 0;
		} else {
			this.index += 1;
		}

		// this.imageArray[this.index] = '../../assets/images/store-1.png';
		if (isAddDefault) {
			this.imageArray[this.index] = '../../assets/images/store-1.png';
		}
		// if (this.index === 0) {
		// // this.imageArray[this.index] = '../../assets/images/store-1.png';
		// }
		const control = <FormArray>this.bankForm.controls['addresses'];
		const addrCtrl = this.initAddress();
		control.push(addrCtrl);
	}

	ngOnInit() {
		this.hideNotificationFlag = this._localStorage.getItem('bankIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		this.loadBankInit();
	}

	loadBankInit() {
		if (atob(this._localStorage.getItem('is-default')) === '1') {
			this.permission = true;
		}

		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this.utilService.getPermissionOfPage('boutique-bank');
			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		}

		const postObj = {
			company_id: this.company_id
		};

		this.utilService.startLoading();
		this._store.getCompanyBankDetail(postObj)
			.subscribe(res => {
				console.log(res);
				this.utilService.completeLoading();
				this.bankDetail = res['data'];
				this.setFormData();
			});

		this.getAllNotifications();
	}

	initAddress() {
		return this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			comapny_address: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			bank_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			bank_address: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			iban_account_no: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			swift_bic: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			company_id: [this.company_id],
			action: [1],
			bank_image: ['image_' + (this.index + 1)],
			id: [0]
		});
	}

	removeElement(index: number) {
		const control = <FormArray>this.bankForm.controls['addresses'];
		control.removeAt(index);
		this.bankDetail.splice(index, 1);
		this.index--;
	}

	removeAddress(i: number) {
		const postObj = {
			bank_id: this.bankForm.controls['addresses']['controls'][i].controls['id'].value
		};
		if (postObj['bank_id'] > 0) {
			this._store.deleteCompanyBankDetail(postObj)
				.subscribe(res => {
					if (res['status'] === '1') {
						this.utilService.showSuccess(res['message']);
						this.removeElement(i);
					} else {
						this.utilService.showError(res['message']);
					}
				});
		} else {
			this.removeElement(i);
		}
	}

	setFormData() {
		console.log(this.bankDetail.length);
		// if (this.bankDetail.length === 0) {
		// 	this.imageArray[0] = '../../assets/images/store-1.png';
		// }
		this.imageArray = [];
		if (this.bankDetail.length !== 0) {
			for (let i = 0; i < this.bankDetail.length; i++) {
				if (i !== 0) {
					this.addAddress();
				}
				this.bankForm.controls['addresses']['controls'][i].patchValue({
					company_name: this.bankDetail[i]['company_name'],
					comapny_address: this.bankDetail[i]['company_address'],
					bank_name: this.bankDetail[i]['bank_name'],
					bank_address: this.bankDetail[i]['bank_address'],
					iban_account_no: this.bankDetail[i]['IBAN_account_no'],
					swift_bic: this.bankDetail[i]['SWIFT_BIC'],
					company_id: this.company_id,
					action: 2,
					bank_image: this.bankDetail[i]['bank_image'],
					id: this.bankDetail[i]['id']
				});
				this.imageArray.push(this.bankDetail[i]['bank_image'] === '' ? '../../assets/images/store-1.png' : this.bankDetail[i]['bank_image']);
				// base64Array
				console.log(this.imageArray);
				console.log(this.bankDetail[i]['bank_image']);
			}
		} else {
			this.imageArray.push('../../assets/images/store-1.png');
		}
	}

	handleChange() {
		if (this.isFormOpen) {
			this.bankForm.get('addresses').enable();
		} else {
			// console.log(this.bankForm.get('addresses'));
			// this.bankForm.get('addresses').disable();
		}
	}

	companyAddressCallbackClone($event, j) {
		console.log($event);
		this.bankForm.controls['addresses']['controls'][j].controls['comapny_address'].setValue($event['formatted_address']);
	}

	bankAddressCallbackClone($event, j) {
		this.bankForm.controls['addresses']['controls'][j].controls['bank_address'].setValue($event['formatted_address']);
	}

	save(form: NgForm) {
		console.log(form);
	}

	toggleClass() {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			if (this.bankForm.valid) {
				this.utilService.startLoading();
				this.bankForm.value['addresses'] = JSON.stringify(this.bankForm.value['addresses']);
				this.FormData.append('bank', this.bankForm.value['addresses']);
				this.FormData.append('company_id', atob(this._localStorage.getItem('store-company-id')));
				this._store.saveCompanyBankDetail(this.FormData)
					.subscribe(res => {
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === '1') {
							this.getAllNotifications();
							this.utilService.showSuccess(res['message']);
							this.loadBankInit();
							this.index = 0;
							this.bankForm.setControl('addresses', this._fb.array([]));
							this.addAddress(0);
							// this.base64Array = [];
							this.utilService.completeLoading();
						} else {
							this.utilService.showError(res['message']);
						}
					},
						error => {
							this.isFormOpen = false;
							this.handleChange();
							switch (error.status) {
								case 400:
									this.utilService.showError(error.error['message']);
									break;
								default:
									this.utilService.showError('Something went wrong.!');
									break;
							}
						});
			} else {
				this.utilService.showError('Please fill all the required fields');
			}
		}
	}

	printToCart(printSectionId: string) {
		let popupWinindow;
		let innerContents = document.getElementById(printSectionId).innerHTML;
		popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../assets/css/style-print.css"/></head><body onload="window.print()">'
			+ innerContents +
			'</html>');
		popupWinindow.document.close();
	}

	storeImageSet($event, i) {
		this.utilService.startLoading();
		this.index = i;
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			console.log(this.bankDetail[i]);
			if (this.bankDetail[i] === undefined) {
				console.log('undefined');
				this.FormData.append('image_' + (i + 1), srcEle.files[0]);
				console.log(this.FormData);
				console.log(this.FormData.get('image_' + (i + 1)));
				this.bankForm.controls['addresses']['controls'][i].controls['bank_image'] = 'image_' + (i + 1);
				console.log(this.bankForm.controls['addresses']['controls'][i].controls['bank_image']);
				console.log(JSON.stringify(this.bankForm.value['addresses']));
				console.log(i + 1);
				this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
				this.utilService.completeLoading();
			} else {

				this.FormData.append('type_image', srcEle.files[0]);
				this.FormData.append('type', 'bank');
				this.FormData.append('type_id', this.bankDetail[i]['id']);
				this.FormData.append('action', '2');

				this._company.changeCompanyLogo(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
							this.utilService.showSuccess(res['message']);
							this.utilService.completeLoading();
						} else {
							this.utilService.showSuccess(res['message']);
							this.utilService.completeLoading();
						}
					});
			}
		}
	}

	base64ArrayInit(base64) {
		this.imageArray[this.index] = base64;
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'bank_edit_partial'
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
				if (res['status'] == 1) {
					this.utilService.showSuccess(res['message']);
					this.readNotificationsList.push(this.unReadNotificationList[index]);
					this.unReadNotificationList.splice(index, 1);
				}
				else {
					this.utilService.showError(res['message']);
				}
			},
				error => {
					switch (error.status) {
						case 400:
							this.utilService.showError(error.error['message']);
							break;

						default:
							this.utilService.showError('Something went wrong.!');
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
		this._localStorage.setItem('bankIsNotification', this.hideNotificationFlag);
	}

}
