import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { DomSanitizer } from '@angular/platform-browser';


declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-tax-detail',
	templateUrl: './tax-detail.component.html',
	styleUrls: ['./tax-detail.component.css']
})
export class TaxDetailComponent implements OnInit {

	currentDocIndex = 0;
	company_id: string;
	textDetail = [];
	public taxForm: FormGroup;
	eutinError: boolean;
	companyNameError: boolean;
	documents: Array<{}> = [
		{ company_tax_doc_url: '../../assets/images/plus.png' },
		{ company_tax_doc_url: '../../assets/images/plus.png' },
		{ company_tax_doc_url: '../../assets/images/plus.png' },
		{ company_tax_doc_url: '../../assets/images/plus.png' }
	];
	FormData = new FormData();
	readNotificationsList = [];
	unReadNotificationList = [];
	isFormOpen = false;
	isAuthorized = true;
	rights = { edit: false, view: false };
	permission = false;
	name: any;
	hideNotificationFlag: any;
	
	constructor(
		private _fb: FormBuilder,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		public utilService: UtilService,
		private _notificationService: NotificationServiceService,
		private _sanitizer: DomSanitizer) {
		this.taxForm = this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			EUTIN: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			default_vat_rate: [{ value: '', disabled: !this.isFormOpen }],
			LTA: [{ value: '', disabled: !this.isFormOpen }],
			company_tax_documents: []
		});
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
	}

	ngOnInit() {
		this.hideNotificationFlag = this._localStorage.getItem('taxIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		if (atob(this._localStorage.getItem('is-default')) === '1') {
			this.permission = true;
		}
		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this.utilService.getPermissionOfPage('boutique-tax');
			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		}
		const postObj = {
			company_id: this.company_id
		}
		this._store.getCompanyTaxDetail(postObj)
			.subscribe(res => {
				if (res['status'] === 1) {
					this.textDetail = res['data'];

					if (this.textDetail['company_tax_documents'].length > 0) {
						for (let i = 0; i < this.textDetail['company_tax_documents'].length; i++) {

							let obj = this.textDetail['company_tax_documents'][i];
							this.documents[i] = obj;
							let fileName = '';
							if (obj['company_tax_doc_name'].indexOf('pdf') > -1) {
								fileName = 'pdf';
							} else {
								fileName = 'img';
							}
							if (this.textDetail['company_tax_documents'][i].company_tax_doc_url === '') {
								this.textDetail['company_tax_documents'][i].company_tax_doc_url = '../../assets/images/plus.png';
							}
							this.documents[i]['fileType'] = fileName;
						}
					}
					this.setFormData();
				} else {
					//this.isAuthorized = false;
					this.utilService.showError(res['message']);
				}
			});

		this.getAllNotifications();
	}

	setFormData() {
		this.taxForm.controls.company_name.setValue(this.textDetail['company_name']);
		this.taxForm.controls.EUTIN.setValue(this.textDetail['EUTIN']);
		this.taxForm.controls.LTA.setValue(this.textDetail['LTA']);
		this.taxForm.controls.default_vat_rate.setValue(this.textDetail['default_vat_rate']);
	}

	handleChange() {
		if (this.isFormOpen) {
			this.taxForm.get('company_name').enable();
			this.taxForm.get('EUTIN').enable();
			this.taxForm.get('LTA').enable();
			this.taxForm.get('default_vat_rate').enable();
		}
		else {
			this.taxForm.get('company_name').disable();
			this.taxForm.get('EUTIN').disable();
			this.taxForm.get('LTA').disable();
			this.taxForm.get('default_vat_rate').disable();
		}
	}

	save(form: NgForm) {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			if (this.taxForm.controls['company_name'].hasError('required')) {
				this.companyNameError = true;
			} else {
				this.companyNameError = false;
			}
			if (this.taxForm.controls['EUTIN'].hasError('required')) {
				this.eutinError = true;
			} else {
				this.eutinError = false;
			}
			if (this.taxForm.valid) {
				this._store.saveCompanyTextDetail(this.taxForm.value)
					.subscribe(taxRes => {
						this.isFormOpen = false;
						this.handleChange();
						if (taxRes['status'] === 1) {
							this.getAllNotifications();
							this.utilService.showSuccess(taxRes['message']);
						} else {
							this.utilService.showError(taxRes['message']);
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
			}
		}
	}
	toggleClass() {
		if (this.taxForm.valid) {
			$('.lock-icon').toggleClass('submit-text');

			this._store.saveCompanyTextDetail(this.taxForm.value)
				.subscribe(taxRes => {
					if (taxRes['status'] === 1) {
						this.utilService.showSuccess(taxRes['message']);
					} else {
						this.utilService.showError(taxRes['message']);
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
		} else {
			this.utilService.showError('Please fill all the required fields');
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
		if (this.isFormOpen) {
			this.currentDocIndex = index;
			const _validFileExtensions = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
			if (window.navigator.userAgent.indexOf('Chrome') === -1) {
				var srcEle = event.explicitOriginalTarget;
			} else {
				var srcEle = event.srcElement;
			}
			// const srcEle = event.srcElement;
			if (srcEle.files && srcEle.files[0]) {
				if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
					this.utilService.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {

					let action = '1';
					let fileName = '';
					if (this.documents[this.currentDocIndex]['company_tax_doc_url'] !== '../../assets/images/plus.png') {
						action = '2';
						const l = this.documents[this.currentDocIndex]['company_tax_doc_url'].split('/');
						fileName = l[l.length - 1];
					}
					this.name = srcEle.files[0].name;
					this.FormData.append('type', 'tax');
					this.FormData.append('action', action);
					this.FormData.append('company_id', this.company_id);
					this.FormData.append('type_document', srcEle.files[0]);
					this.FormData.append('doc_name', fileName);

					this._store['updateDocuments'](this.FormData)
						.subscribe(updateRes => {
							if (updateRes['status'] === '1') {
								this.documents[this.currentDocIndex]['imageName'] = updateRes['company_doc_file_name'];
								this.utilService.showSuccess(updateRes['message']);
								// this.ngOnInit();
								this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
							}
						});
				}
			}
		}
	}

	base64ArrayInit(base64) {
		if (this.name.indexOf('pdf') === -1) {
			// this.documents[this.currentDocIndex]['company_tax_doc_url'] = base64;
		} else {
			// this.documents[this.currentDocIndex]['company_tax_doc_url'] = '../../assets/images/pdf-icon.png';
		}
		this.ngOnInit();
		// if (this.name.indexOf('pdf') === -1) {
		// 	console.log('if');
		// 	this.documents[this.currentDocIndex]['company_tax_doc_url'] = base64;
		// } else {
		// 	console.log('else');
		// 	this.documents[this.currentDocIndex]['company_tax_doc_url'] = '../../assets/images/pdf-icon.png';
		// }
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'company_tax_edit_partial'
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
					this.utilService.showSuccess(res['message']);
					this.readNotificationsList.push(this.unReadNotificationList[index]);
					this.unReadNotificationList.splice(index, 1);
				} else {
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

	deleteImage(filePath, i) {
		const l = filePath.split('/');
		const fileName = l[l.length - 1];
		this.FormData.append('type', 'tax');
		this.FormData.append('action', '3');
		this.FormData.append('company_id', this.company_id);
		this.FormData.append('doc_name', fileName);

		this._store['updateDocuments'](this.FormData)
			.subscribe(updateRes => {
				if (updateRes['status'] === '1') {
					this.utilService.showSuccess(updateRes['message']);
					this.documents[i]['fileType'] = 'any';
					this.documents[i]['company_tax_doc_url'] = '../../assets/images/plus.png';
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
		this._localStorage.setItem('taxIsNotification', this.hideNotificationFlag);
	}
}
