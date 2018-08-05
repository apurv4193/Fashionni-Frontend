import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyService } from './../../core/service/company-service/company.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';

declare var jquery: any;
declare var $: any;


function emailValidation() {
	// const hasExclamation = input.value !== this.o_password.value;
	return (input: FormControl) => {
		return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(input.value) ? null : {
			emailValidation: {
				valid: false
			}
		};
	}
}

function nameValidation() {
	return (input: FormControl) => {
		return /[A-Za-z]$/.test(input.value) ? null : {
			nameValidation: {
				valid: false
			}
		};
	}
}

function lengthValidation() {
	return (input: FormControl) => {
		return /^[\s\S]{8,}$/.test(input.value) ? null : {
			lengthValidation: {
				valid: false
			}
		}
	}
}
@Component({
	selector: 'app-add-boutique',
	templateUrl: './add-boutique.component.html',
	styleUrls: ['./add-boutique.component.css']
})
export class AddBoutiqueComponent implements OnInit {
	htmlContent: any;
	public myForm: FormGroup;
	public adressForm: FormGroup;
	imagePath: any;
	index: any;
	base64Array: Array<{}> = [];
	FormData: any;
	formIndex: any;
	updateCompanyId = 0;
	companiesDetail = [];
	editFormFlag: boolean;
	isFormOpen = false;

	constructor(
		private router: Router,
		private _company: CompanyService,
		private _fb: FormBuilder,
		public _utilService: UtilService,
		private route: ActivatedRoute,
		private refrence: ChangeDetectorRef,
		public _store: StoreServiceService,
		public _message: MessageServiceService) {
		this.imagePath = '../../assets/images/plus-default.png';

		this.FormData = new FormData();
		this.myForm = this._fb.group({
			company_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			postal_code: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			city: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, nameValidation()])],
			state: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, nameValidation()])],
			country: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, nameValidation()])],
			email: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, emailValidation()])],
			password: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, lengthValidation()])],
			company_unique_id: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			company_image: [{ value: '', disabled: !this.isFormOpen }],
			store: this._fb.array([]),
			action: [1],
			address: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			id: [0]
		});
		this.editFormFlag = false;
		this.addAddress(0);
	}

	removePasswordValidation() {
		console.log('removePassword');
		this.myForm.get('password').clearValidators();
		this.myForm.get('password').updateValueAndValidity();
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.formIndex = 0;
			this.base64Array[this.formIndex] = '../../assets/images/plus-default.png';
			this.myForm.setControl('store', this._fb.array([]));
			this.addAddress(0);
			this.updateCompanyId = parseInt(atob(params['id']));
			if (this.updateCompanyId !== 0) {
				this._company.getCompanyDetails({ company_id: this.updateCompanyId })
					.subscribe(res => {
						this.removePasswordValidation();
						this.myForm.controls.id.setValue(this.updateCompanyId);
						this.myForm.controls.action.setValue(2);
						console.log(res);
						this.companiesDetail = res['data'];

						this.setFormData();
					});
			}
		});
		console.log(window.navigator.geolocation);
	}

	initAddress() {
		return this._fb.group({
			store_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			short_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			postal_code: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			city: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			state: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			country: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			address: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			store_image: ['store_image_' + (this.myForm.controls['store']['length'] + 1)],
			store_lat: [{ value: '', disabled: !this.isFormOpen }],
			store_lng: [{ value: '', disabled: !this.isFormOpen }],
			action: [1],
			id: [0]
		});
	}

	setFormData() {
		this.editFormFlag = true;
		this.imagePath = this.companiesDetail['company_image'];
		if (this.imagePath === '') {
			this.imagePath = '../../assets/images/plus-default.png';
		}
		this.myForm.patchValue(
			{
				company_name: this.companiesDetail['company_name'],
				address: this.companiesDetail['address'],
				postal_code: this.companiesDetail['postal_code'],
				city: this.companiesDetail['city'],
				state: this.companiesDetail['state'],
				country: this.companiesDetail['country'],
				email: this.companiesDetail['company_email'],
				company_unique_id: this.companiesDetail['company_unique_id']
			}
		);

		for (let i = 0; i < this.companiesDetail['store'].length; i++) {

			if (this.companiesDetail['store'][i]['store_image'] === '') {
				this.companiesDetail['store'][i]['store_image'] = '../../assets/images/plus-default.png';
			}
			this.base64Array[i] = this.companiesDetail['store'][i]['store_image'];

			if (i !== 0) {
				this.addAddress(i);
			}
			this.myForm.controls['store']['controls'][i].patchValue({
				store_name: this.companiesDetail['store'][i]['store_name'],
				short_name: this.companiesDetail['store'][i]['short_name'],
				address: this.companiesDetail['store'][i]['address'],
				postal_code: this.companiesDetail['store'][i]['postal_code'],
				city: this.companiesDetail['store'][i]['city'],
				state: this.companiesDetail['store'][i]['state'],
				country: this.companiesDetail['store'][i]['country'],
				action: 2,
				id: this.companiesDetail['store'][i]['id'],
			});
		}
	}


	handleChange() {
		if (this.isFormOpen) {
			this.myForm.get('company_name').enable();
			this.myForm.get('postal_code').enable();
			this.myForm.get('city').enable();
			this.myForm.get('state').enable();
			this.myForm.get('country').enable();
			this.myForm.get('email').enable();
			this.myForm.get('password').enable();
			this.myForm.get('company_unique_id').enable();
			this.myForm.get('company_image').enable();
			this.myForm.get('address').enable();
			this.myForm.get('store').enable();
		}
		else {
			// this.myForm.get('company_name').disable();
			// this.myForm.get('postal_code').disable();
			// this.myForm.get('city').disable();
			// this.myForm.get('state').disable();
			// this.myForm.get('country').disable();
			// this.myForm.get('email').disable();
			// this.myForm.get('password').disable();
			// this.myForm.get('company_unique_id').disable();
			// this.myForm.get('company_image').disable();
			// this.myForm.get('address').disable();
			// this.myForm.get('store').disable();
		}
	}


	businessImageBase64(base64) {
		this.imagePath = base64;
	}

	imageSet($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.updateCompanyId !== 0) {
				this.FormData.append('type_image', srcEle.files[0]);
				this.FormData.append('type', 'company');
				this.FormData.append('type_id', this.updateCompanyId);
				this.FormData.append('action', '2');

				this._company.changeCompanyLogo(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this._utilService.readProductURL(srcEle.files[0], this.businessImageBase64.bind(this));
							this._utilService.showSuccess(res['message']);
						} else {
							this._utilService.showSuccess(res['message']);
						}
					});
			} else {
				console.log(srcEle.files[0]);
				this.FormData.append('company_image', srcEle.files[0]);
				this._utilService.readProductURL(srcEle.files[0], this.businessImageBase64.bind(this));
			}
		}
	}

	storeImageSet($event, i) {
		this.index = i;
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.updateCompanyId !== 0) {
				if (this.companiesDetail['store'].length > 0 && (i + 1) <= this.companiesDetail['store'].length) {
					this.myForm.controls['store']['controls'][i].controls['storeimage'] = srcEle.files[0].name;
					this.FormData.append('type_image', srcEle.files[0]);
					this.FormData.append('type', 'store');
					this.FormData.append('type_id', this.companiesDetail['store'][i]['id']);
					this.FormData.append('action', 2);
					this.FormData.append('store_slug', this.companiesDetail['store'][i]['store_slug']);
					this._company.changeCompanyLogo(this.FormData)
						.subscribe(res => {
							if (res['status'] === '1') {
								this._utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
								this._utilService.showSuccess(res['message']);
							} else {
								this._utilService.showSuccess(res['message']);
							}
						});
				} else {
					this.myForm.controls['store']['controls'][i].controls['storeimage'] = srcEle.files[0].name;
					this.FormData.append('store_image_' + i, srcEle.files[0]);
					this._utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
				}
			} else {
				this.myForm.controls['store']['controls'][i].controls['storeimage'] = srcEle.files[0].name;
				this.FormData.append('store_image_' + i, srcEle.files[0]);
				this._utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
			}
		}
	}

	base64ArrayInit(base64) {
		this.base64Array[this.index] = base64;
	}

	addAddress(i) {
		this.formIndex = this.formIndex + 1;
		this.base64Array[this.formIndex] = '../../assets/images/plus-default.png';
		const control = <FormArray>this.myForm.controls['store'];
		const addrCtrl = this.initAddress();
		control.push(addrCtrl);
	}

	removeAddress(i: number) {
		const postObj = {
			store_id: this.myForm.controls['store']['controls'][i].controls['id'].value
		};
		const control = <FormArray>this.myForm.controls['store'];
		if (postObj['store_id'] > 0) {
			this._company.deleteCompanyStoreDetail(postObj)
				.subscribe(res => {
					if (res['status'] === 1) {
						this._utilService.showSuccess(res['message']);
						control.removeAt(i);
					} else {
						this._utilService.showError(res['message']);
					}
				});
		} else {
			control.removeAt(i);
		}
	}

	save() {

		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			(<any>Object).values(this.myForm.controls).forEach(control => {
				control.markAsTouched();
			});

			for (let j = 0; j < this.myForm.controls['store']['controls'].length; j++) {
				(<any>Object).values(this.myForm.controls['store']['controls'][j].controls).forEach(control => {
					if (control.markAsTouched) {
						control.markAsTouched();
					}
				});
			}
			console.log('notvalid');
			if (this.myForm.valid) {
				console.log('valid');
				this.FormData.append('store', JSON.stringify(this.myForm.value['store']));

				if (this.updateCompanyId > 0) {
					this.FormData.append('id', this.updateCompanyId);
				}

				for (const i in this.myForm.value) {
					if (i !== 'company_image' && i !== 'store') {
						this.FormData.append(i, this.myForm.value[i]);
					}
				}

				if (this.FormData.get(['password']) === 'null') {
					this.FormData.delete('password');
				}

				this._company.addCompany(this.FormData)
					.subscribe(res => {
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === '1') {
							this._utilService.showSuccess(res['message']);

							if (this._utilService.isAdmin()) {
								this._company.getCompany()
									.subscribe(resCompany => {
										if (resCompany['status'] === '1') {

											const companiesList = resCompany['data'].map(company => {
												const o = Object.assign({}, company);
												o.id = btoa(company['id']);
												return o;
											});
											this._message.setSuperAdminCompanyList(companiesList);
										}
										console.log(res);
									});
								this.router.navigateByUrl('/admin/companies');
							}
						} else {
							this._utilService.showError(res['message']);
						}
					},
						error => {
							this.isFormOpen = false;
							this.handleChange();
							switch (error.status) {
								case 400:
									this._utilService.showError(error.error['message']);
									break;

								default:
									this._utilService.showError('Something went wrong.!');
									break;
							}
						});
			} else {
				this._utilService.showError('Please fill all the required fields');
			}
		}

		// this.myForm.controls['companynameCom'].markAsTouched();
		// this.myForm.controls['postalcodeCom'].markAsTouched();
		// this.myForm.controls['cityCom'].markAsTouched();
		// this.myForm.controls['stateCom'].markAsTouched();
		// this.myForm.controls['countryCom'].markAsTouched();
		// this.myForm.controls['useridCom'].markAsTouched();
		// this.myForm.controls['passwordCom'].markAsTouched();
		// console.log(this.myForm.value);

		// for (let i = 0; i < this.myForm.value.addresses.length; i++) {
		// console.log(this.myForm.value.addresses)
		// }
	}

	printToCart(printSectionId: string) {
		let popupWinindow;
		let innerContents = document.getElementById(printSectionId).innerHTML;
		popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../assets/css/style.css"/></head><body onload="window.print()">'
			+ innerContents +
			'</html>');
		popupWinindow.document.close();
	}

	addressCallback($event) {
		console.log($event);
		this.myForm.controls['city'].setValue('');
		this.myForm.controls['state'].setValue('');
		this.myForm.controls['country'].setValue('');
		this.myForm.controls['postal_code'].setValue('');

		for (let i = 0; i < $event.address_components.length; i++) {
			if ($event.address_components[i].types[0] === 'administrative_area_level_2') {
				this.myForm.controls['city'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'administrative_area_level_1') {
				this.myForm.controls['state'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'country') {
				this.myForm.controls['country'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'postal_code') {
				this.myForm.controls['postal_code'].setValue($event.address_components[i].long_name);
			}
		}
		this.myForm.controls.address.setValue($event['formatted_address']);
	}

	addressCallbackClone($event, j) {
		console.log($event);
		this.myForm.controls['store']['controls'][j].controls['city'].setValue('');
		this.myForm.controls['store']['controls'][j].controls['country'].setValue('');
		this.myForm.controls['store']['controls'][j].controls['state'].setValue('');
		this.myForm.controls['store']['controls'][j].controls['postal_code'].setValue('');

		this.myForm.controls['store']['controls'][j].controls['store_lng'].setValue($event.geometry.location.lng());
		this.myForm.controls['store']['controls'][j].controls['store_lat'].setValue($event.geometry.location.lat());
		for (let i = 0; i < $event.address_components.length; i++) {
			if ($event.address_components[i].types[0] === 'administrative_area_level_2') {
				this.myForm.controls['store']['controls'][j].controls['city'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'administrative_area_level_1') {
				this.myForm.controls['store']['controls'][j].controls['state'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'country') {
				this.myForm.controls['store']['controls'][j].controls['country'].setValue($event.address_components[i].long_name);
			}
			if ($event.address_components[i].types[0] === 'postal_code') {
				this.myForm.controls['store']['controls'][j].controls['postal_code'].setValue($event.address_components[i].long_name);
			}
		}

		this.myForm.controls['store']['controls'][j].controls['address'].setValue($event['formatted_address']);
	}

	deleteImage(filePath) {
		if (this.isFormOpen) {
			if (this.editFormFlag) {
				const l = filePath.split('/');
				const fileName = l[l.length - 1];
				this.FormData.append('type_image', fileName);
				this.FormData.append('type', 'company');
				this.FormData.append('action', '3');
				this.FormData.append('type_id', this.updateCompanyId);

				// this.FormData.append('doc_name', fileName);
				this._store['changeStoreLogo'](this.FormData)
					.subscribe(updateRes => {
						if (updateRes['status'] === '1') {
							this._utilService.showSuccess(updateRes['message']);
							this.imagePath = '../../assets/images/plus-default.png';
						}
					});
			} else {
				this.imagePath = '../../assets/images/plus-default.png';
			}
		}
	}

	deleteStoreImage(filePath, i) {
		if (this.isFormOpen) {
			if (this.editFormFlag) {
				if (this.updateCompanyId !== 0) {
					const l = filePath.split('/');
					const fileName = l[l.length - 1];
					this.FormData.append('type_image', fileName);
					this.FormData.append('type', 'store');
					this.FormData.append('action', '3');
					this.FormData.append('store_slug', this.companiesDetail['store'][i]['store_slug']);
					this.FormData.append('type_id', this.companiesDetail['store'][i]['id']);
					console.log(this.FormData);
					// this.FormData.append('doc_name', fileName);
					this._store['changeStoreLogo'](this.FormData)
						.subscribe(updateRes => {
							if (updateRes['status'] === '1') {
								this._utilService.showSuccess(updateRes['message']);
								this.base64Array[i] = '../../assets/images/plus-default.png';
							}
						});
				} else {
					this.base64Array[i] = '../../assets/images/plus-default.png';
				}
			} else {
				this.base64Array[i] = '../../assets/images/plus-default.png';
			}
		}
	}
}
