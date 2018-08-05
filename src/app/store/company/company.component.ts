import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { CompanyService } from './../../core/service/company-service/company.service';

declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-company',
	templateUrl: './company.component.html',
	styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

	company_id: string;
	public companyForm: FormGroup;
	companyProfileDetail = [];
	comapny_image = '../../assets/images/plus-default.png';
	contact_person_image = '../../assets/images/plus-default.png';
	FormData: any;
	readNotificationsList = [];
	unReadNotificationList = [];
	isAuthorized = true;
	isFormOpen = false;
	rights = { edit: false, view: false };
	permission = false;
	hideNotificationFlag: any;
	constructor(
		private _fb: FormBuilder,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		public utilService: UtilService,
		private _notificationService: NotificationServiceService,
		public _companyService: CompanyService) {
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
		this.FormData = new FormData();

		this.companyForm = this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			address: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			postal_code: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			city: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			state: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			country: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			company_email: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			website: [{ value: '', disabled: !this.isFormOpen }],
			facebook: [{ value: '', disabled: !this.isFormOpen }],
			twitter: [{ value: '', disabled: !this.isFormOpen }],
			whatsapp: [{ value: '', disabled: !this.isFormOpen }],
			instagram: [{ value: '', disabled: !this.isFormOpen }],
			wechat: [{ value: '', disabled: !this.isFormOpen }],
			pinterest: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_position: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_gender: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_first_name: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_last_name: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_telefon: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_fax: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_mo_no: [{ value: '', disabled: !this.isFormOpen }],
			contact_person_email: [{ value: '', disabled: !this.isFormOpen }]
		});
	}

	businessImageBase64(base64) {
		this.comapny_image = base64;
	}

	contactImageBase64(bacse64) {
		this.contact_person_image = bacse64;
	}

	imageSet($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.company_id !== '0') {
				this.FormData.append('type_image', srcEle.files[0]);
				this.FormData.append('type', 'company');
				this.FormData.append('type_id', this.company_id);
				this.FormData.append('action', '2');

				this._companyService.changeCompanyLogo(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this.utilService.readProductURL(srcEle.files[0], this.businessImageBase64.bind(this));
							this.utilService.showSuccess(res['message']);
						} else {
							this.utilService.showSuccess(res['message']);
						}
					});
			} else {
				this.utilService.readProductURL(srcEle.files[0], this.businessImageBase64.bind(this));
			}
		}
	}

	contactImageSet($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.company_id !== '0') {
				this.FormData.append('type_image', srcEle.files[0]);
				this.FormData.append('type', 'company_contact');
				this.FormData.append('type_id', this.company_id);
				this.FormData.append('action', '2');

				this._companyService.changeCompanyLogo(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this.utilService.readProductURL(srcEle.files[0], this.contactImageBase64.bind(this));
							this.utilService.showSuccess(res['message']);
						} else {
							this.utilService.showSuccess(res['message']);
						}
					});
			} else {
				this.utilService.readProductURL(srcEle.files[0], this.contactImageBase64.bind(this));
			}
		}
	}

	ngOnInit() {
		this.hideNotificationFlag = this._localStorage.getItem('companyIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}

		if (atob(this._localStorage.getItem('is-default')) === '1') {
			this.permission = true;
		}
		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this.utilService.getPermissionOfPage('boutique-company');
			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		}
		const postObj = {
			company_id: this.company_id
		};

		this._store.getCompanyProfileDetail(postObj)
			.subscribe(res => {
				console.log(res);
				this.companyProfileDetail = res['data'];
				this.setFormData();
			});

		this.getAllNotifications();
	}

	setFormData() {
		this.comapny_image = this.companyProfileDetail['company_image'];
		if (this.comapny_image == "") {
			this.comapny_image = '../../assets/images/plus-default.png';
		}
		this.contact_person_image = this.companyProfileDetail['contact_person_image'];
		this.companyForm.patchValue(
			{
				company_name: this.companyProfileDetail['company_name'],
				address: this.companyProfileDetail['address'],
				postal_code: this.companyProfileDetail['postal_code'],
				city: this.companyProfileDetail['city'],
				state: this.companyProfileDetail['state'],
				country: this.companyProfileDetail['country'],
				company_email: this.companyProfileDetail['company_email'],
				contact_person_email: this.companyProfileDetail['contact_person_email'],
				contact_person_fax: this.companyProfileDetail['contact_person_fax'],
				contact_person_first_name: this.companyProfileDetail['contact_person_first_name'],
				contact_person_gender: this.companyProfileDetail['contact_person_gender'],
				contact_person_last_name: this.companyProfileDetail['contact_person_last_name'],
				contact_person_mo_no: this.companyProfileDetail['contact_person_mo_no'],
				contact_person_position: this.companyProfileDetail['contact_person_position'],
				contact_person_telefon: this.companyProfileDetail['contact_person_telefon'],
				facebook: this.companyProfileDetail['facebook'],
				instagram: this.companyProfileDetail['instagram'],
				pinterest: this.companyProfileDetail['pinterest'],
				twitter: this.companyProfileDetail['twitter'],
				website: this.companyProfileDetail['website'],
				wechat: this.companyProfileDetail['wechat'],
				whatsapp: this.companyProfileDetail['whatsapp']
			}
		);
	}

	handleChange() {
		if (this.isFormOpen) {
			this.companyForm.get('company_name').enable();
			this.companyForm.get('address').enable();
			this.companyForm.get('postal_code').enable();
			this.companyForm.get('city').enable();
			this.companyForm.get('state').enable();
			this.companyForm.get('country').enable();
			this.companyForm.get('company_email').enable();
			this.companyForm.get('contact_person_email').enable();
			this.companyForm.get('contact_person_fax').enable();
			this.companyForm.get('contact_person_first_name').enable();
			this.companyForm.get('contact_person_gender').enable();
			this.companyForm.get('contact_person_last_name').enable();
			this.companyForm.get('contact_person_mo_no').enable();
			this.companyForm.get('contact_person_position').enable();
			this.companyForm.get('contact_person_telefon').enable();
			this.companyForm.get('facebook').enable();
			this.companyForm.get('instagram').enable();
			this.companyForm.get('pinterest').enable();
			this.companyForm.get('twitter').enable();
			this.companyForm.get('website').enable();
			this.companyForm.get('wechat').enable();
			this.companyForm.get('whatsapp').enable();
		}
		else {
			this.companyForm.get('company_name').disable();
			this.companyForm.get('address').disable();
			this.companyForm.get('postal_code').disable();
			this.companyForm.get('city').disable();
			this.companyForm.get('state').disable();
			this.companyForm.get('country').disable();
			this.companyForm.get('company_email').disable();
			this.companyForm.get('contact_person_email').disable();
			this.companyForm.get('contact_person_fax').disable();
			this.companyForm.get('contact_person_first_name').disable();
			this.companyForm.get('contact_person_gender').disable();
			this.companyForm.get('contact_person_last_name').disable();
			this.companyForm.get('contact_person_mo_no').disable();
			this.companyForm.get('contact_person_position').disable();
			this.companyForm.get('contact_person_telefon').disable();
			this.companyForm.get('facebook').disable();
			this.companyForm.get('instagram').disable();
			this.companyForm.get('pinterest').disable();
			this.companyForm.get('twitter').disable();
			this.companyForm.get('website').disable();
			this.companyForm.get('wechat').disable();
			this.companyForm.get('whatsapp').disable();
		}
	}

	toggleClass() {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			(<any>Object).values(this.companyForm.controls).forEach(control => {
				control.markAsTouched();
			});

			if (this.companyForm.valid) {
				this.FormData.append('company_id', this.company_id);

				for (let i in this.companyForm.value) {
					this.FormData.append(i, this.companyForm.value[i]);
				}

				this._store.saveCompanyProfileDetail(this.FormData)
					.subscribe(res => {
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] == 1) {
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
			} else {
				this.utilService.showError('Please fill all the required fields');
			}
		}
	}

	companyAddressCallbackClone($event) {
		this.companyForm.controls['state'].setValue('');
		this.companyForm.controls['city'].setValue('');
		this.companyForm.controls['country'].setValue('');
		this.companyForm.controls['postal_code'].setValue('');

		for (let i = 0; i < $event.address_components.length; i++) {
			if ($event.address_components[i].types[0] == 'administrative_area_level_2') {
				this.companyForm.controls['city'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] == 'administrative_area_level_1') {
				this.companyForm.controls['state'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] == 'country') {
				this.companyForm.controls['country'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] == 'postal_code') {
				this.companyForm.controls['postal_code'].setValue($event.address_components[i].long_name);
			}
		}
		this.companyForm.controls.address.setValue($event['formatted_address']);
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'admin_company_edit_full'
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

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		console.log(this.hideNotificationFlag);
		this._localStorage.setItem('companyIsNotification', this.hideNotificationFlag);
	}
}
