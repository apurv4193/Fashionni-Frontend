import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appApiResources } from './../app.constants';
import { HttpService } from './../core/service/http-service/http.service';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { LoginService } from './../core/service/login-service/login.service';
import { Router } from '@angular/router';
import { UtilService } from './../core/service/util-service/util.service';
import { StoreServiceService } from './../core/service/store-service/store-service.service';
@Component({
	selector: 'app-store-admin',
	templateUrl: './store-admin.component.html',
	styleUrls: ['./store-admin.component.css']
})
export class StoreAdminComponent implements OnInit {

	isLoadStart = false;
	loginForm: FormGroup;
	loginSuccess = false;
	constructor(
		private _form: FormBuilder,
		private _http: HttpService,
		private _localStorage: LocalStorageService,
		private _message: MessageServiceService,
		private _login: LoginService,
		private _router: Router,
		private _util: UtilService,
		private _store: StoreServiceService) {
		this.loginForm = this._form.group({
			email: ['adidas@gmail.com', Validators.compose([Validators.required, Validators.minLength(8)])],
			password: ['123456', Validators.compose([Validators.required, Validators.minLength(6)])],
			user_type: ['store']
		});
	}

	ngOnInit() {
	}

	loginSubmit(): void {
		if (this.loginForm.valid) {
			this.isLoadStart = true;
			this._util.startLoading();
			this._login.login(this.loginForm.value)
			.subscribe(res => {
				console.log(res);
				this._localStorage.setItem('user-token', res['data']['loginToken']['token']);
				if (res['data']['company_id'] !== '' || res['data']['company_id'] !== null) {
					if (res['data']['company_id'] > 0) {
						this._localStorage.setItem('store-company-id', btoa(res['data']['company_id']));
					}
				}

				if (res['data']['is_default'] !== '' || res['data']['is_default'] !== null) {
					if (res['data']['is_default'] == 1) {
						this._localStorage.setItem('is-default', btoa(res['data']['is_default']));
					}
				}
				this.loginSuccess = true;
				res['data']['userDetail']['userType'] = 'store';
				this._localStorage.setItem('user', res['data']['userDetail']);
				this._message.setUserIsAdmin(<any>this._util.isAdmin());
				this._util.completeLoading();
				this._message.setLoggedIn(true);
				this._util.showSuccess(res['message']);
				this._router.navigateByUrl('store/boutique-registration');
				const comapny_obj = {
					company_id : res['data']['company_id'],
					company_name : res['data']['company_name'],
					company_unique_id: res['data']['company_unique_id']
				};
				this._localStorage.setItem('company', comapny_obj);
			},
			error => {
				this.isLoadStart = false;
				this._util.completeLoading();
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
