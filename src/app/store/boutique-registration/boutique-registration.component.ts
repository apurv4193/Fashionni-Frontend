import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { UtilService } from './../../core/service/util-service/util.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';

declare var jquery: any;
declare var $: any;
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as frLocale from 'date-fns/locale/fr';


@Component({
	selector: 'app-boutique-registration',
	templateUrl: './boutique-registration.component.html',
	styleUrls: ['./boutique-registration.component.css']
})
export class BoutiqueRegistrationComponent implements OnInit {

	isAuthorized = true;
	permission = false;
	date: Date;
	options: DatepickerOptions = {
		locale: enLocale,
		displayFormat: 'YYYY[-]MM[-]DD'
	};
	isFormOpen = false;
	public regForm: FormGroup;
	registerNumberError: boolean;
	companyError: boolean;
	registerDateError: boolean;
	legalPersonError: boolean;
	company_id: string;
	companyDetails: Array<{}> = [];
	documents: Array<{}> = [
		{ company_doc_url: '../../assets/images/plus.png' },
		{ company_doc_url: '../../assets/images/plus.png' },
		{ company_doc_url: '../../assets/images/plus.png' },
		{ company_doc_url: '../../assets/images/plus.png' }
	];
	FormData: any;
	currentDocIndex = 0;
	readNotificationsList = [];
	unReadNotificationList = [];
	rights = { edit: false, view: false };
	showCloseFlag: any;
	name: any;
	company_doc_file_name: any;
	hideNotificationFlag: any;
	constructor(
		private _fb: FormBuilder,
		public utilService: UtilService,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		private _util: UtilService,
		private _notificationService: NotificationServiceService,
		private _message: MessageServiceService) {
		this.FormData = new FormData();
		this.initForm();
		this.company_id = atob(this._localStorage.getItem('store-company-id'));

		this.regForm.controls.register_date.setValue(this.formatDate(new Date(Date.now())));

		this._message.getUserPermission().subscribe(messageData => {

			if (atob(this._localStorage.getItem('is-admin')) === '1') {
				this.rights = { edit: true, view: true };
				this.isAuthorized = true;
			} else {
				this.rights = this._util.getPermissionOfPage('boutique-reg');
				if (this.rights && this.rights['view']) {
					this.isAuthorized = true;
				} else {
					this.isAuthorized = false;
				}
			}
		});
	}

	formatDate(date) {
		var d = new Date(date);
		var month = '' + (d.getMonth() + 1);
		var day = '' + d.getDate();
		var year = d.getFullYear();

		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}

		return [year, month, day].join('-');
	}

	initForm() {
		this.regForm = this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			court_name: [{ value: '', disabled: !this.isFormOpen }],
			general_manager: [{ value: '', disabled: !this.isFormOpen }],
			legal_person: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			register_date: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			register_number: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])]
		});
	}
	setFormData() {
		this.regForm.controls.company_name.setValue(this.companyDetails['company_name']);
		this.regForm.controls.court_name.setValue(this.companyDetails['court_name']);
		this.regForm.controls.general_manager.setValue(this.companyDetails['general_manager']);
		if (this.companyDetails['register_date']) {
			this.regForm.controls.register_date.setValue(this.companyDetails['register_date']);
		}
		this.regForm.controls.register_number.setValue(this.companyDetails['register_number']);
		this.regForm.controls.legal_person.setValue(this.companyDetails['legal_person']);
	}

	ngOnInit() {

		this.hideNotificationFlag = this._localStorage.getItem('boutiqueRegIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}

		if (atob(this._localStorage.getItem('is-default')) === '1') {
			this.permission = true;
		}

		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.isAuthorized = true;
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this._util.getPermissionOfPage('boutique-reg');
			console.log(this.rights);

			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}

			// if ( atob(this._localStorage.getItem('is-default')) === '1') {
			// 	this.permission = true;
			// } else {

			// }
		}

		const postObj = {
			company_id: this.company_id
		};
		this.getCompanyDetail();
	}

	getCompanyDetail() {
		const postObj = {
			company_id: this.company_id
		};

		this._store.getBoutiqueRegistration(postObj)
			.subscribe(res => {
				console.log(res);
				if (res['status'] === 1) {
					this.companyDetails = res['data'];
					if (res['data'].company_documents.length > 0) {
						// register_date
						if (res['data'].register_date !== '') {
							this.regForm.controls.register_date.setValue(new Date(Date.now()));
						}
						if (this.companyDetails['company_documents'].length > 0) {
							for (let i = 0; i < this.companyDetails['company_documents'].length; i++) {
								let obj = this.companyDetails['company_documents'][i];
								this.documents[i] = obj;
								let fileName = '';
								if (obj['company_doc_name'].indexOf('pdf') > -1) {
									fileName = 'pdf';
								} else {
									fileName = 'img';
								}
								if (this.companyDetails['company_documents'][i].company_doc_url === '') {
									this.companyDetails['company_documents'][i].company_doc_url = '../../assets/images/plus.png';
								}
								this.documents[i]['fileType'] = fileName;
							}
						}
					}
					this.setFormData();
				} else {
					this.utilService.showError(res['message']);
				}
			});
		this.getAllNotifications();
	}

	toggleClass() {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
		} else {
			if (this.regForm.valid) {
				$('.lock-icon').toggleClass('submit-text');

				console.log(this.regForm.value['register_date'].indexOf('T'));
				if (this.regForm.value['register_date'].indexOf('T') > -1) {
					this.regForm.value['register_date'] = this.regForm.value['register_date'].split('T')[0];
				}

				this._store.saveCompanyRegisterDetails(this.regForm.value)
					.subscribe(res => {
						this.isFormOpen = false;
						this.getAllNotifications();
						if (res['status'] === 1) {
							this.utilService.showSuccess(res['message']);
						} else {
							this.utilService.showError(res['message']);
						}
					},
						error => {
							this.isFormOpen = false;
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

	handleChange() {
		if (this.isFormOpen) {
			this.regForm.get('company_name').enable();
			this.regForm.get('court_name').enable();
			this.regForm.get('general_manager').enable();
			this.regForm.get('legal_person').enable();
			this.regForm.get('register_date').enable();
			this.regForm.get('register_number').enable();
		} else {
			this.regForm.get('company_name').disable();
			this.regForm.get('court_name').disable();
			this.regForm.get('general_manager').disable();
			this.regForm.get('legal_person').disable();
			this.regForm.get('register_date').disable();
			this.regForm.get('register_number').disable();
		}
	}

	save(form: NgForm) {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			if (this.regForm.controls['register_number'].hasError('required')) {
				this.registerNumberError = true;
			} else {
				this.registerNumberError = false;
			}
			if (this.regForm.controls['company_name'].hasError('required')) {
				this.companyError = true;
			} else {
				this.companyError = false;
			}
			if (this.regForm.controls['register_date'].hasError('required')) {
				this.registerDateError = true;
			} else {
				this.registerDateError = false;
			}
			if (this.regForm.controls['legal_person'].hasError('required')) {
				this.legalPersonError = true;
			} else {
				this.legalPersonError = false;
			}
			if (this.regForm.valid) {

				console.log(this.regForm.value['register_date']);

				const d = new Date(this.regForm.value['register_date']);
				let curr_date = d.getDate() + '';
				let curr_month = (d.getMonth() + 1) + '';
				const curr_year = d.getFullYear();

				if (curr_date.length === 1) {
					curr_date = '0' + curr_date;
				}
				if (curr_month.length === 1) {
					curr_month = '0' + curr_month;
				}
				const regi_date = curr_year + '-' + curr_month + '-' + curr_date;

				this.regForm.value['register_date'] = regi_date;

				this.regForm.controls['register_date'].setValue(regi_date);

				this._store.saveCompanyRegisterDetails(this.regForm.value)
					.subscribe(res => {
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === 1) {
							this.getAllNotifications();
							this.utilService.showSuccess(res['message']);
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
				// this.utilService.getFormData(form.value);
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

	/**
	* Uplaod document of boutique
	* @param event
	* @param index
	*/
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
					this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {
					let action = 1;
					let fileName = '';
					if (this.documents[this.currentDocIndex]['company_doc_url'] !== '../../assets/images/plus.png') {
						action = 2;
						const l = this.documents[this.currentDocIndex]['company_doc_url'].split('/');
						fileName = l[l.length - 1];
					}
					console.log(action);
					this.documents[index]['fileType'] = fileName;
					this.name = srcEle.files[0].name;
					this.FormData.append('type', 'company');
					this.FormData.append('action', action);
					this.FormData.append('company_id', this.company_id);
					this.FormData.append('type_document', srcEle.files[0]);
					this.FormData.append('doc_name', fileName);
					console.log(this.FormData);
					this._store['updateDocuments'](this.FormData)
						.subscribe(updateRes => {
							if (updateRes['status'] === '1') {
								this.documents[this.currentDocIndex]['imageName'] = updateRes['company_doc_file_name'];
								// this.getCompanyDetail();
								this._util.showSuccess(updateRes['message']);
								this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
							}
						});
				}
			}
		}
	}


	base64ArrayInit(base64) {
		// if (base64.indexOf('pdf') > -1) {
		// 	this.documents[this.currentDocIndex]['company_doc_url'] =
		// 		'http://icons.iconarchive.com/icons/iynque/flat-ios7-style-documents/512/pdf-icon.png';
		// } else {
		// 	this.documents[this.currentDocIndex]['company_doc_url'] = base64;
		// }
		if (this.name.indexOf('pdf') === -1) {
			// this.documents[this.currentDocIndex]['company_doc_url'] = base64;
		} else {
			// this.documents[this.currentDocIndex]['company_doc_url'] = '../../assets/images/pdf-icon.png';
		}
		this.getCompanyDetail();
	}

	getAllNotifications() {

		const postObj = {
			notification_page: 'company_register_edit_partial'
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

	deleteImage(filePath, i) {
		this._util.startLoading();
		console.log(filePath);
		const l = filePath.split('/');
		const fileName = l[l.length - 1];
		// console.log(this.company_doc_file_name);
		console.log(fileName);
		this.FormData.append('type', 'company');
		this.FormData.append('action', 3);
		this.FormData.append('company_id', this.company_id);
		this.FormData.append('doc_name', fileName);

		this._store['updateDocuments'](this.FormData)
			.subscribe(updateRes => {
				this._util.completeLoading();
				if (updateRes['status'] === '1') {
					this._util.showSuccess(updateRes['message']);
					this.documents[i]['fileType'] = 'any';
					this.documents[i]['company_doc_url'] = '../../assets/images/plus.png';
					this.getCompanyDetail();
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
		this._localStorage.setItem('boutiqueRegIsNotification', this.hideNotificationFlag);
	}
}
