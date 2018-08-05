import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
declare var jquery: any;
declare var $: any;
function nameValidation() {
	return (input: FormControl) => {
		return /[A-Za-z]$/.test(input.value) ? null : {
			nameValidation: {
				valid: false
			}
		};
	}
}
@Component({
	selector: 'app-customs',
	templateUrl: './customs.component.html',
	styleUrls: ['./customs.component.css']
})
export class CustomsComponent implements OnInit {

	public customForm: FormGroup;
	company_id: any;
	customDetail: any;
	isCompanyNameError: boolean;
	isEORIError: boolean;
	currentDocIndex = 0;
	name: any;
	hideNotificationFlag: any;
	documents: Array<{}> = [
		{ company_custom_doc_url: '../../assets/images/plus.png' },
		{ company_custom_doc_url: '../../assets/images/plus.png' },
		{ company_custom_doc_url: '../../assets/images/plus.png' },
		{ company_custom_doc_url: '../../assets/images/plus.png' }
	];
	FormData = new FormData();
	readNotificationsList = [];
	unReadNotificationList = [];
	isAuthorized = true;
	isFormOpen = false;
	rights = { edit: false, view: false };
	permission = false;

	constructor(private _fb: FormBuilder,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		private _util: UtilService,
		private _notificationService: NotificationServiceService) {
		this.customForm = this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			country: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([nameValidation()])],
			country_code: [{ value: '', disabled: !this.isFormOpen }],
			main_custom_office: [{ value: '', disabled: !this.isFormOpen }],
			EORI: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
		});
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
	}

	ngOnInit() {
		this.hideNotificationFlag = this._localStorage.getItem('customsIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		if (atob(this._localStorage.getItem('is-default')) === '1') {
			this.permission = true;
		}
		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this._util.getPermissionOfPage('boutique-customs');
			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		}
		const postObj = {
			company_id: this.company_id
		}
		this._store.getCustomsDetail(postObj)
			.subscribe(res => {

				this.customDetail = res['data'];
				this.setFormData();

				if (this.customDetail['company_customs_documents'].length > 0) {
					for (let i = 0; i < this.customDetail['company_customs_documents'].length; i++) {
						let obj = this.customDetail['company_customs_documents'][i];
						console.log(this.customDetail['company_customs_documents']);
						this.documents[i] = obj;
						let fileName = '';
						if (obj['company_doc_file_name'].indexOf('pdf') > -1) {
							fileName = 'pdf';
						} else {
							fileName = 'img';
						}
						if (this.customDetail['company_customs_documents'][i].company_custom_doc_url === '') {
							this.customDetail['company_customs_documents'][i].company_custom_doc_url = '../../assets/images/plus.png';
						}
						this.documents[i]['fileType'] = fileName;
						console.log(this.documents);
					}
				}
			});
		this.getAllNotifications();
	}

	setFormData() {
		this.customForm.controls.company_name.setValue(this.customDetail['company_name']);
		this.customForm.controls.country.setValue(this.customDetail['country']);
		this.customForm.controls.country_code.setValue(this.customDetail['country_code']);
		this.customForm.controls.main_custom_office.setValue(this.customDetail['main_custom_office']);
		this.customForm.controls.EORI.setValue(this.customDetail['EORI']);
	}

	handleChange() {
		if (this.isFormOpen) {
			this.customForm.get('company_name').enable();
			this.customForm.get('country').enable();
			this.customForm.get('country_code').enable();
			this.customForm.get('main_custom_office').enable();
			this.customForm.get('EORI').enable();
		}
		else {
			this.customForm.get('company_name').disable();
			this.customForm.get('country').disable();
			this.customForm.get('country_code').disable();
			this.customForm.get('main_custom_office').disable();
			this.customForm.get('EORI').disable();
		}
	}
	save(form: NgForm) {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			if (this.customForm.controls['company_name'].hasError('required')) {
				this.isCompanyNameError = true;
			} else {
				this.isCompanyNameError = false;
			}
			if (this.customForm.controls['EORI'].hasError('required')) {
				this.isEORIError = true;
			} else {
				this.isEORIError = false;
			}
			if (this.customForm.valid) {
				this._store.saveCustoms(this.customForm.value)
					.subscribe(res => {
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === 1) {
							this.getAllNotifications();
							this._util.showSuccess(res['message']);
						} else {
							this._util.showError(res['message']);
						}
					},
						error => {
							this.isFormOpen = false;
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

	fileChange(event, index) {
		this.currentDocIndex = index;
		console.log(this.currentDocIndex);
		const _validFileExtensions = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
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

				let action = '1';
				let fileName = '';
				if (this.documents[this.currentDocIndex]['company_custom_doc_url'] !== '../../assets/images/plus.png') {
					action = '2';
					const l = this.documents[this.currentDocIndex]['company_custom_doc_url'].split('/');
					fileName = l[l.length - 1];
				}
				this.name = srcEle.files[0].name;
				this.FormData.append('type', 'custom');
				this.FormData.append('action', action);
				this.FormData.append('company_id', this.company_id);
				this.FormData.append('type_document', srcEle.files[0]);
				this.FormData.append('doc_name', fileName);

				this._store['updateDocuments'](this.FormData)
					.subscribe(updateRes => {
						if (updateRes['status'] === '1') {
							this.documents[this.currentDocIndex]['imageName'] = updateRes['company_doc_file_name'];
							this._util.showSuccess(updateRes['message']);
							this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
							this.ngOnInit();
						}
					});
			}
		}
	}

	base64ArrayInit(base64) {
		// if (base64.indexOf('pdf') > -1) {
		// 	this.documents[this.currentDocIndex]['company_custom_doc_url'] =
		// 		'http://icons.iconarchive.com/icons/iynque/flat-ios7-style-documents/512/pdf-icon.png';
		// } else {
		// 	this.documents[this.currentDocIndex]['company_custom_doc_url'] = base64;
		// }
		if (this.name.indexOf('pdf') === -1) {
			// this.documents[this.currentDocIndex]['company_custom_doc_url'] = base64;
		} else {
			// this.documents[this.currentDocIndex]['company_custom_doc_url'] = '../../assets/images/pdf-icon.png';
		}
		this.ngOnInit();
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'company_customs_edit_partial'
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


	addressCallback($event) {
		this.customForm.controls['main_custom_office'].setValue($event.formatted_address);
	}

	deleteImage(filePath, i) {
		// console.log(i);
		const l = filePath.split('/');
		const fileName = l[l.length - 1];
		this.FormData.append('type', 'custom');
		this.FormData.append('action', '3');
		this.FormData.append('company_id', this.company_id);
		this.FormData.append('doc_name', fileName);

		this._store['updateDocuments'](this.FormData)
			.subscribe(updateRes => {
				if (updateRes['status'] === '1') {
					this._util.showSuccess(updateRes['message']);
					this.documents[i]['fileType'] = 'any';
					this.documents[i]['company_custom_doc_url'] = '../../assets/images/plus.png';
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
		this._localStorage.setItem('customsIsNotification', this.hideNotificationFlag);
	}

}
