import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { CompanyService } from './../../core/service/company-service/company.service';
declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

	company_id: string;
	user_id: number;
	public userForm: FormGroup;
	companyAllPermission = [];
	companyRolePermission = [];
	permission = true;
	user_role = 'admin';
	user_image = '../../assets/images/plus.png';
	FormData: any;
	userDetail = [];
	role_id = 0;
	isAuthorized = true;
	isFormOpen = false;
	rights = { edit: false, view: false };
	isCustom = false;
	butDisabled: boolean = false;
	constructor(
		private _fb: FormBuilder,
		private router: Router,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		private route: ActivatedRoute,
		public utilService: UtilService,
		private _company: CompanyService) {
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
		this.FormData = new FormData();

		this.userForm = this._fb.group({
			name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			user_name: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			password: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, Validators.minLength(8)])],
			position: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			role_id: [{ value: '', disabled: !this.isFormOpen }],
			user_unique_id: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			email: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required, Validators.email])],
			user_role: [this.user_role],
			user_image: [null],
			custom_user_role: [{ value: '', disabled: !this.isFormOpen }],
			action: [1],
			id: [0],
			company_id: [this.company_id]
		});

		setTimeout(() => {
			this.userForm.get('user_role').disable();
		}, 10);
	}

	removePasswordValidation() {
		this.userForm.get('password').clearValidators();
		this.userForm.get('password').updateValueAndValidity();
	}

	ngOnInit() {
		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this.rights = { edit: true, view: true };
		} else {
			this.rights = this.utilService.getPermissionOfPage('boutique-user');
			if (this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		}

		const postObj = {
			company_id: this.company_id
		};
		this._store.getCompanyAllPermission(postObj)
			.subscribe(res => {
				this.companyAllPermission = res['data'];
				if (this.user_id === 0) {
					this.onChange();
				}
			});

		this.route.params.subscribe(params => {
			this.user_id = parseInt(atob(params['id']));
			if (this.user_id !== 0) {
				this._store.getCompanUserDetails({ company_id: this.company_id, user_id: this.user_id })
					.subscribe(res => {
						this.removePasswordValidation();
						console.log(res);
						this.userDetail = res['data'];
						this.setFormData();
					});
			}
		});
	}


	setFormData() {
		this.userForm.patchValue({
			email: this.userDetail['email'],
			position: this.userDetail['position'],
			user_name: this.userDetail['user_name'],
			user_unique_id: this.userDetail['user_unique_id'],
			name: this.userDetail['name'],
			custom_user_role: this.userDetail['custom_user_role'],
			user_role: this.userDetail['role'].toLowerCase(),
			role_id: this.userDetail['role_id'],
			action: 2,
			id: this.userDetail['user_id']
		});

		this.role_id = this.userDetail['role_id'];
		this.companyRolePermission = this.userDetail['permission'];
		console.log(this.companyRolePermission);
		this.user_image = this.userDetail['user_image'];
		// console.log(this.userForm.controls.user_role.value);
		if (this.userForm.controls.user_role.value === 'custom') {
			// if (this.isFormOpen) {
				this.permission = false;
				this.isCustom = true;
			// }
		}
	}

	handleChange() {
		this.onChange();
		if (this.isFormOpen) {
			this.userForm.get('email').enable();
			this.userForm.get('position').enable();
			this.userForm.get('user_name').enable();
			this.userForm.get('user_unique_id').enable();
			this.userForm.get('custom_user_role').enable();
			this.userForm.get('user_role').enable();
			this.userForm.get('name').enable();
			this.userForm.get('password').enable();
			this.userForm.get('role_id').enable();
		} else {
			this.userForm.get('email').disable();
			this.userForm.get('position').disable();
			this.userForm.get('user_name').disable();
			this.userForm.get('user_unique_id').disable();
			this.userForm.get('custom_user_role').disable();
			this.userForm.get('user_role').disable();
			this.userForm.get('name').disable();
			this.userForm.get('password').enable();
			this.userForm.get('role_id').enable();
		}
	}

	onChange(event?) {

		this.userForm['controls']['custom_user_role'].setValue('');

		if (this.userForm.controls.user_role.value === 'custom') {
			if (this.isFormOpen) {
				this.permission = false;
				this.isCustom = true;
				setTimeout(() => {
					this.userForm.get('custom_user_role').enable();
				}, 10);
			}
		} else {
			if (this.isFormOpen) {
				this.permission = true;
				this.isCustom = false;

				setTimeout(() => {
					this.userForm.get('custom_user_role').disable();
				}, 10);
			}
		}
		this.role_id = this.companyAllPermission[this.userForm.controls.user_role.value]['id'];
		this.companyRolePermission = this.companyAllPermission[this.userForm.controls.user_role.value]['permissions'];
	}

	storeImageSet($event) {
		const srcEle = $event.srcElement;
		if (srcEle.files && srcEle.files[0]) {
			if (this.user_id !== 0) {
				this.FormData.append('type_image', srcEle.files[0]);
				this.FormData.append('type', 'user');
				this.FormData.append('type_id', this.user_id);
				this.FormData.append('action', '2');

				this._company.changeCompanyLogo(this.FormData)
					.subscribe(res => {
						if (res['status'] === '1') {
							this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
							this.utilService.showSuccess(res['message']);
						} else {
							this.utilService.showSuccess(res['message']);
						}
					});
			} else {
				this.userForm.controls['user_image'].setValue(srcEle.files[0]);
				this.utilService.readProductURL(srcEle.files[0], this.base64ArrayInit.bind(this));
			}
		}
	}
	base64ArrayInit(base64) {
		this.user_image = base64;
	}

	toggleClass() {

		if (this.userForm.get('user_role').value !== 'other') {
			setTimeout(() => {
				this.userForm.get('custom_user_role').disable();
			}, 10);
		}

		if (this.isFormOpen === false) {
			this.isFormOpen = true;
			this.handleChange();
		} else {
			console.log(this.companyRolePermission['id']);

			const user_permission = [];

			for (const x of Object.keys(this.companyRolePermission)) {
				user_permission.push({
					edit: this.companyRolePermission[x]['edit'] === 1 ? 1 : this.companyRolePermission[x]['edit'] === true ? 1 : 0,
					view: this.companyRolePermission[x]['view'] === 1 ? 1 : this.companyRolePermission[x]['view'] === true ? 1 : 0,
					id: this.companyRolePermission[x]['id']
				});
			}

			this.userForm.controls['role_id'].setValue(this.role_id);
			this.FormData.append('user_permission', JSON.stringify(user_permission));
			if (this.userForm.valid) {
				for (const i of Object.keys(this.userForm.value)) {
					this.FormData.append(i, this.userForm.value[i]);
				}

				if (this.FormData.get(['action']) === '2') {
					this.FormData.delete('user_image');
				}


				if (this.FormData.get(['password']) === 'null') {
					this.FormData.delete('password');
				}

				this._store.saveCompanyUserDetail(this.FormData)
					.subscribe(res => {
						console.log(res);
						this.isFormOpen = false;
						this.handleChange();
						if (res['status'] === '1') {
							this.utilService.showSuccess(res['message']);
							this.router.navigateByUrl('/store/user');
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
}
