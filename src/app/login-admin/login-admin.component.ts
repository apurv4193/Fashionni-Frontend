import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appApiResources } from './../app.constants';
import { HttpService } from './../core/service/http-service/http.service';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { LoginService } from './../core/service/login-service/login.service';
import { Router } from '@angular/router';
import { UtilService } from './../core/service/util-service/util.service';

@Component({
	selector: 'app-login-admin',
	templateUrl: './login-admin.component.html',
	styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

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
		private _util: UtilService)
	{
		this.loginForm = this._form.group({
			email: ['fashionni@inexture.in', Validators.compose([Validators.required, Validators.minLength(8)])],
			password: ['123456', Validators.compose([Validators.required, Validators.minLength(6)])],
			user_type: ['admin']
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
				this.loginSuccess = true;
				this._localStorage.setItem('user-token', res['data']['loginToken']['token']);
				res['data']['userDetail']['userType'] = 'admin';
				this._localStorage.setItem('user', res['data']['userDetail']);
				this._message.setUserIsAdmin(<any>this._util.isAdmin());
				this._util.completeLoading();
				this._message.setLoggedIn(true);
				this._util.showSuccess(res['message']);
				this._router.navigateByUrl('admin/companies');
			},
			error => {
				this._util.completeLoading();
				this.isLoadStart = false;
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
