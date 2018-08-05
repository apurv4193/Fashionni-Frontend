import { Component, OnInit } from '@angular/core';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { UtilService } from './../core/service/util-service/util.service';
import { LoginService } from './../core/service/login-service/login.service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	isLoggedIn = false;
	constructor(
		private _message: MessageServiceService,
		private _util: UtilService,
		private _login: LoginService,
		private router: Router){
		this._message.getLoggedIn().subscribe(messageData => {
			this.isLoggedIn = messageData;
		});
	}

	ngOnInit() {
		this.isLoggedIn = this._util.isUserLoggedIn();
	}

	logout() {
		this._login.logout();
	}

	goToHome() {
		if ( this._util.isAdmin() ) {
			this.router.navigateByUrl('/admin/companies');
		} else {
			this.router.navigateByUrl('/store/boutique-registration');
		}
	}

}
