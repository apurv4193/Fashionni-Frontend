import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';

declare var jquery: any;
declare var $: any;
function nameValidation() {
	return (input: FormControl) => {
		return /[A-Za-z ]$/.test(input.value) ? null : {
			nameValidation: {
				valid: false
			}
		};
	}
}

function emailValidation() {
	// const hasExclamation = input.value !== this.o_password.value;
	return (input: FormControl) => {
		return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.value) ? null : {
			emailValidation: {
				valid: false
			}
		};
	};
}

function numberValidation() {
	return (input: FormControl) => {
		return /^\d+$/.test(input.value) ? null : {
			numberValidation: {
				valid: false
			}
		};
	};
}

@Component({
	selector: 'app-store',
	templateUrl: './store.component.html',
	styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
	public storeForm: FormGroup;
	address: String;
	city: String;
	country: String;
	postalCode: String;
	state: String;
	personEmail: any;
	personImage: any;
	personName: String;
	personPos: any;
	tel: number;
	storeImg: any;
	storeName: String;
	base64Image: any;
	base64ImageContact: any;
	FormData: any;
	company_id: any;
	storeSlug: any;
	positions: any;
	countryMap: String;
	cityMap: String;
	readNotificationsList = [];
	unReadNotificationList = [];
	latMap: any;
	longMap: any;
	pos: any;
	isAuthorized = true;
	isFormOpen = false;
	rights = { edit: false, view: false };
	hideNotificationFlag: any;

	constructor(private _fb: FormBuilder,
		public _store: StoreServiceService,
		public _util: UtilService,
		private _Activatedroute: ActivatedRoute,
		private router: Router,
		private _localStorage: LocalStorageService,
		private _notificationService: NotificationServiceService) {
		this.FormData = new FormData();
		// this.base64Image = '../../assets/images/store-1.png';
		this.positions = [];
		this.storeForm = this._fb.group({
			store_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			short_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			postal_code: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			company_id: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			address: [{ value: '', disabled: !this.isFormOpen }],
			city: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([nameValidation()])],
			state: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([nameValidation()])],
			country: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([nameValidation()])],
			store_lat: [{ value: '', disabled: !this.isFormOpen }],
			store_lng: [{ value: '', disabled: !this.isFormOpen }],
			// store_image: [null],
			store_contact_person_name: [{ value: '', disabled: !this.isFormOpen }],
			store_contact_person_position: [{ value: '', disabled: !this.isFormOpen }],
			store_contact_person_telephone: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([numberValidation()])],
			store_contact_person_email: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([emailValidation()])],
			// store_contact_person_image: [null],
			mon_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			tue_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			wed_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			thu_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			fri_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			sat_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			sun_timing: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])]
		});
	}

	ngOnInit() {
		let id = this._Activatedroute.snapshot.params['id'];
		this.hideNotificationFlag = this._localStorage.getItem('storeIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		const postObj = {
			store_id: atob(id)
		};
		this._store.getStoreDetail(postObj)
			.subscribe(res => {
				if (res['status'] === 1) {
					if (atob(this._localStorage.getItem('is-admin')) === '1') {
						this.rights = { edit: true, view: true };
					} else {
						this.rights = this._util.getPermissionOfPage(res['data'].store_slug);
						if (this.rights && this.rights.view) {
							this.isAuthorized = true;
						} else {
							this.isAuthorized = false;
						}
					}
					this.storeForm.controls['store_lat'].setValue(res['data'].store_lat);
					this.storeForm.controls['store_lng'].setValue(res['data'].store_lng);
					this.storeForm.controls['company_id'].setValue(res['data'].company_id);
					this.storeForm.controls['address'].setValue(res['data'].address);
					this.storeForm.controls['city'].setValue(res['data'].city);
					this.storeForm.controls['state'].setValue(res['data'].state);
					this.storeForm.controls['country'].setValue(res['data'].country);
					this.storeForm.controls['postal_code'].setValue(res['data'].postal_code);
					this.storeForm.controls['store_contact_person_email'].setValue(res['data'].store_contact_person_email);
					this.base64ImageContact = res['data'].store_contact_person_image;
					if (this.base64ImageContact === '') {
						console.log(this.base64ImageContact);
						this.base64ImageContact = '../../assets/images/plus.png';
					}
					this.storeForm.controls['store_contact_person_name'].setValue(res['data'].store_contact_person_name);
					this.storeForm.controls['store_contact_person_position'].setValue(res['data'].store_contact_person_position);
					this.storeForm.controls['store_contact_person_telephone'].setValue(res['data'].store_contact_person_telephone);
					// this.storeForm.controls['store_image'].setValue(res['data'].store_image);
					this.base64Image = res['data'].store_image;
					if (this.base64Image === '') {
						this.base64Image = '../../assets/images/plus.png';
					}
					this.storeSlug = res['data'].store_slug;
					this.storeForm.controls['store_name'].setValue(res['data'].store_name);
					this.storeForm.controls['short_name'].setValue(res['data'].short_name);
					this.storeForm.controls['mon_timing'].setValue(res['data'].opening_time.mon_timing);
					this.storeForm.controls['tue_timing'].setValue(res['data'].opening_time.tue_timing);
					this.storeForm.controls['wed_timing'].setValue(res['data'].opening_time.wed_timing);
					this.storeForm.controls['thu_timing'].setValue(res['data'].opening_time.thu_timing);
					this.storeForm.controls['fri_timing'].setValue(res['data'].opening_time.fri_timing);
					this.storeForm.controls['sat_timing'].setValue(res['data'].opening_time.sat_timing);
					this.storeForm.controls['sun_timing'].setValue(res['data'].opening_time.sun_timing);
					this.cityMap = res['data'].city;
					this.countryMap = res['data'].country;
					this.latMap = res['data'].store_lat;
					this.longMap = res['data'].store_lng;
					this.pos = [this.latMap, this.longMap];
					console.log(this.pos);
				} else {
					this.isAuthorized = false;
				}
			});
		this.router.events.subscribe(event => {
			if (event.constructor.name === 'NavigationStart') {
				console.log('loading...');
				let id = this._Activatedroute.snapshot.params['id'];

				const postObj = {
					store_id: atob(id)
				};
				this._store.getStoreDetail(postObj)
					.subscribe(res => {
						this.storeForm.controls['store_lat'].setValue(res['data'].store_lat);
						this.storeForm.controls['store_lng'].setValue(res['data'].store_lng);
						this.storeForm.controls['company_id'].setValue(res['data'].company_id);
						this.storeForm.controls['address'].setValue(res['data'].address);
						this.storeForm.controls['city'].setValue(res['data'].city);
						this.storeForm.controls['state'].setValue(res['data'].state);
						this.storeForm.controls['country'].setValue(res['data'].country);
						this.storeForm.controls['postal_code'].setValue(res['data'].postal_code);
						this.storeForm.controls['store_contact_person_email'].setValue(res['data'].store_contact_person_email);
						this.base64ImageContact = res['data'].store_contact_person_image;
						if (this.base64ImageContact === '') {
							console.log(this.base64ImageContact);
							this.base64ImageContact = '../../assets/images/plus.png';
						}
						this.storeForm.controls['store_contact_person_name'].setValue(res['data'].store_contact_person_name);
						this.storeForm.controls['store_contact_person_position'].setValue(res['data'].store_contact_person_position);
						this.storeForm.controls['store_contact_person_telephone'].setValue(res['data'].store_contact_person_telephone);
						// this.storeForm.controls['store_image'].setValue(res['data'].store_image);
						this.base64Image = res['data'].store_image;
						if (this.base64Image === '') {
							// this.base64Image = '../../assets/images/plus.png';
						}
						this.storeSlug = res['data'].store_slug;
						this.storeForm.controls['store_name'].setValue(res['data'].store_name);
						this.storeForm.controls['short_name'].setValue(res['data'].short_name);
						this.storeForm.controls['mon_timing'].setValue(res['data'].opening_time.mon_timing);
						this.storeForm.controls['tue_timing'].setValue(res['data'].opening_time.tue_timing);
						this.storeForm.controls['wed_timing'].setValue(res['data'].opening_time.wed_timing);
						this.storeForm.controls['thu_timing'].setValue(res['data'].opening_time.thu_timing);
						this.storeForm.controls['fri_timing'].setValue(res['data'].opening_time.fri_timing);
						this.storeForm.controls['sat_timing'].setValue(res['data'].opening_time.sat_timing);
						this.storeForm.controls['sun_timing'].setValue(res['data'].opening_time.sun_timing);
						this.cityMap = res['data'].city;
						this.countryMap = res['data'].country;
						this.latMap = res['data'].store_lat;
						this.longMap = res['data'].store_lng;
						this.pos = [this.latMap, this.longMap];
						console.log(this.pos);
						// console.log(pos);
					});
			}
		});
	}

	handleChange() {
		if (this.isFormOpen) {
			this.storeForm.get('sun_timing').enable();
			this.storeForm.get('sat_timing').enable();
			this.storeForm.get('fri_timing').enable();
			this.storeForm.get('thu_timing').enable();
			this.storeForm.get('wed_timing').enable();
			this.storeForm.get('tue_timing').enable();
			this.storeForm.get('mon_timing').enable();
			this.storeForm.get('store_contact_person_email').enable();
			this.storeForm.get('store_contact_person_telephone').enable();
			this.storeForm.get('store_contact_person_position').enable();
			this.storeForm.get('store_contact_person_name').enable();
			this.storeForm.get('store_lng').enable();
			this.storeForm.get('store_lat').enable();
			this.storeForm.get('state').enable();
			this.storeForm.get('city').enable();
			this.storeForm.get('address').enable();
			this.storeForm.get('short_name').enable();
			this.storeForm.get('postal_code').enable();
			this.storeForm.get('store_name').enable();
			this.storeForm.get('company_id').enable();
			this.storeForm.get('country').enable();
		}
		else {
			this.storeForm.get('sun_timing').disable();
			this.storeForm.get('sat_timing').disable();
			this.storeForm.get('fri_timing').disable();
			this.storeForm.get('thu_timing').disable();
			this.storeForm.get('wed_timing').disable();
			this.storeForm.get('tue_timing').disable();
			this.storeForm.get('mon_timing').disable();
			this.storeForm.get('store_contact_person_email').disable();
			this.storeForm.get('store_contact_person_telephone').disable();
			this.storeForm.get('store_contact_person_position').disable();
			this.storeForm.get('store_contact_person_name').disable();
			this.storeForm.get('store_lng').disable();
			this.storeForm.get('store_lat').disable();
			this.storeForm.get('state').disable();
			this.storeForm.get('city').disable();
			this.storeForm.get('address').disable();
			this.storeForm.get('short_name').disable();
			this.storeForm.get('postal_code').disable();
			this.storeForm.get('store_name').disable();
			this.storeForm.get('company_id').disable();
			this.storeForm.get('country').disable();
		}
	}

	save(form: NgForm) {
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			(<any>Object).values(this.storeForm.controls).forEach(control => {
				if (control.markAsTouched) {
					control.markAsTouched();
				}
			});

			if (this.storeForm.valid) {
				form.value.opening_time = { 'store_id': '', 'mon_timing': '', 'tue_timing': '', 'wed_timing': '', 'thu_timing': '', 'fri_timing': '', 'sat_timing': '', 'sun_timing': '' };
				let id = this._Activatedroute.snapshot.params['id'];
				form.value.opening_time['store_id'] = atob(id);
				form.value.store_id = atob(id);
				form.value.store_slug = this.storeSlug;
				for (let i in this.storeForm.value) {
					if (i === 'mon_timing' || i === 'tue_timing' || i === 'wed_timing' || i === 'thu_timing' || i === 'fri_timing' || i === 'sat_timing' || i === 'sun_timing') {
						form.value.opening_time[i] = this.storeForm.value[i];
					}
				}
				form.value.opening_time = JSON.stringify(form.value.opening_time);
				this._store.saveStoreDetail(form.value)
					.subscribe(res => {
						console.log(res);
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === 1) {
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
			} else {
				this._util.showError('Please fill all the required fields');
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

	addressCallback($event) {
		console.log($event);
		this.storeForm.controls['city'].setValue('');
		this.storeForm.controls['state'].setValue('');
		this.storeForm.controls['country'].setValue('');
		this.storeForm.controls['postal_code'].setValue('');
		this.storeForm.controls['postal_code'].setValue('');
		this.storeForm.controls['postal_code'].setValue('');

		this.storeForm.controls['store_lng'].setValue($event.geometry.location.lng());
		this.storeForm.controls['store_lat'].setValue($event.geometry.location.lat());

		this.latMap = $event.geometry.location.lat();
		this.longMap = $event.geometry.location.lng();
		this.pos = [this.latMap, this.longMap];

		for (let i = 0; i < $event.address_components.length; i++) {
			if ($event.address_components[i].types[0] === 'administrative_area_level_2') {
				this.storeForm.controls['city'].setValue($event.address_components[i].long_name);
				this.cityMap = $event.address_components[i].long_name;
			}
			if ($event.address_components[i].types[0] === 'administrative_area_level_1') {
				this.storeForm.controls['state'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'country') {
				this.storeForm.controls['country'].setValue($event.address_components[i].long_name);
				this.countryMap = $event.address_components[i].long_name;
			}
			if ($event.address_components[i].types[0] === 'postal_code') {
				this.storeForm.controls['postal_code'].setValue($event.address_components[i].long_name);
			}
		}
	}

	storeImageSet($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			let id = atob(this._Activatedroute.snapshot.params['id']);
			this.storeForm.controls['store_image'] = srcEle.files[0];
			this.FormData.append('store_image', srcEle.files[0]);
			this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));

			this.FormData.append('type_image', srcEle.files[0]);
			this.FormData.append('type', 'store');
			this.FormData.append('type_id', id);
			this.FormData.append('action', '2');
			this.FormData.append('store_slug', this.storeSlug);

			this._store.changeStoreLogo(this.FormData)
				.subscribe(res => {
					if (res['status'] === '1') {
						this._util.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
						this._util.showSuccess(res['message']);
					} else {
						this._util.showSuccess(res['message']);
					}
				});
		}
	}

	base64ArrayInit(base64) {
		this.base64Image = base64;
	}

	storeImageSetContact($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			this.storeForm.controls['store_contact_person_image'] = srcEle.files[0];
			this.FormData.append('store_contact_person_image', srcEle.files[0]);
			this._util.readProductURL(srcEle.files[0], this.base64Contact.bind(this));

			let id = atob(this._Activatedroute.snapshot.params['id']);
			this.storeForm.controls['store_image'] = srcEle.files[0];
			this.FormData.append('store_image', srcEle.files[0]);
			this._util.readProductURL(srcEle.files[0], this.base64Contact.bind(this));

			this.FormData.append('type_image', srcEle.files[0]);
			this.FormData.append('type', 'store_contact');
			this.FormData.append('type_id', id);
			this.FormData.append('action', '2');
			this.FormData.append('store_slug', this.storeSlug);

			this._store.changeStoreLogo(this.FormData)
				.subscribe(res => {
					if (res['status'] === '1') {
						this._util.readProductURL(srcEle.files[0], this.base64Contact.bind(this));
						this._util.showSuccess(res['message']);
					} else {
						this._util.showSuccess(res['message']);
					}
				});
		}
	}

	base64Contact(base64) {
		this.base64ImageContact = base64;
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'admin_store_edit'
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
		this._localStorage.setItem('storeIsNotification', this.hideNotificationFlag);
	}
}
