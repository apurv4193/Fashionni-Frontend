import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
declare var jquery: any;
declare var $: any;
@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
}) 
export class UserComponent implements OnInit {

	company_id: string;
	userDetail = [];
	readNotificationsList = [];
	unReadNotificationList = [];
	rights = {edit: false, view: false};
	permission = false;
	isAuthorized = true;
	hideNotificationFlag: any;
	constructor(
		private router: Router,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		public utilService: UtilService,
		private _notificationService: NotificationServiceService) {
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
	}

	ngOnInit() {
		this.hideNotificationFlag = this._localStorage.getItem('userIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		if ( atob(this._localStorage.getItem('is-default')) === '1')
		{
			this.permission = true;
		}
		
		if ( atob(this._localStorage.getItem('is-admin')) === '1' ) {
			this.rights = {edit : true, view: true};
		} else
		{
			this.rights = this.utilService.getPermissionOfPage('boutique-user');
			if ( this.rights && this.rights.view) {
				this.isAuthorized = true;
			} else {
				this.isAuthorized = false;
			}
		} 
		const postObj = {
			company_id: this.company_id
		};
		this._store.getCompanyUserList(postObj)
			.subscribe(res => {
				console.log(res);
				this.userDetail = res['data'].map(user => {
					const o = Object.assign({}, user);
					o.id = btoa(user['id']);
					return o;
				});
			});

		this.getAllNotifications();
	}

	toggleClass() {
		$('.lock-icon').toggleClass('submit-text');
	}

	addUser() {
		this.router.navigateByUrl('store/userdetail/' + btoa('0'));
	}

	edituser(id) {
		this.router.navigateByUrl('store/userdetail/' + id);
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'company_user_edit'
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
		this._localStorage.setItem('userIsNotification', this.hideNotificationFlag);
	}

}
