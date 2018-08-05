import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageServiceService } from './core/service/message-service/message-service.service';
import { UtilService } from './core/service/util-service/util.service';
import { ToastsManager } from 'ng2-toastr';
import { LocalStorageService } from './core/service/local-storage/local-storage.service';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'app';
	isLoggedIn = false;
	isAdmin = false;
	sidebar = { isBoutique: false, isProduct: false, isMessage: false };

	constructor(
		translate: TranslateService,
		private _message: MessageServiceService,
		private _util: UtilService,
		vRef: ViewContainerRef,
		public toastr: ToastsManager,
		private _localStorage: LocalStorageService,
		private af: AngularFireAuth) {
		this.toastr.setRootViewContainerRef(vRef);
		translate.setDefaultLang('en');
		translate.use('en');
		this._message.getLoggedIn().subscribe(messageData => {
			this.isLoggedIn = messageData;
			this.setSidebar();
		});

		this._message.getSideMenu().subscribe(messageData => {
			this.isAdmin = messageData;
			this.setSidebar();
		});

		this.anonymousLogin();
	}

	anonymousLogin() {

		this.af.auth.signInAnonymously()
		.then(() => {});

		// return this.af.anonymousLogin .auth.login({
		// 	provider: AuthProviders.Anonymous,
		// 	method: AuthMethods.Anonymous,
		// })
		// 	.then(() => console.log('successful login'))
		// 	.catch(error => console.log(error));
	}

	setSidebar() {
		this.isAdmin = <any>this._util.isAdmin();

		const companyId = this._localStorage.getItem('store-company-id');
		if (companyId != null) {
			this.isAdmin = false;
		}

		this.sidebar = { isBoutique: false, isProduct: false, isMessage: false };
		if (window.location['pathname'].indexOf('/product') > -1) {
			this.sidebar.isProduct = true;
		} else if (window.location['pathname'].indexOf('/admin') > -1) {
			this.sidebar.isBoutique = true;
		} else if (window.location['pathname'].indexOf('/store') > -1) {
			this.sidebar.isBoutique = true;
		} else if (window.location['pathname'].indexOf('/messages') > -1) {
			this.sidebar.isMessage = true;
		}

	}

	ngOnInit(): void {
		this.isLoggedIn = this._util.isUserLoggedIn();
		this.setSidebar();
	}
}
