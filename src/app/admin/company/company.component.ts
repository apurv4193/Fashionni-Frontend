import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { CompanyService } from './../../core/service/company-service/company.service';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';

@Component({
	selector: 'app-company',
	templateUrl: './company.component.html',
	styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
	readNotificationsList = [];
	unReadNotificationList = [];
	companiesList = [];
	isAuthorized = true;
	hideNotificationFlag: any;
	searchFormData = new FormData();
	constructor(
		private router: Router,
		private _company: CompanyService,
		private _message: MessageServiceService,
		private _notificationService: NotificationServiceService,
		private _utilService: UtilService,
		private activeRoute: ActivatedRoute,
		private _local: LocalStorageService) {
		const activeUrlArray = this.activeRoute.snapshot.url;
		if (activeUrlArray.length > 0) {
			if (activeUrlArray[0].path === 'companies') {
				this._company.clearBoutiqueDataForSuperAdminAccess();
				this._message.setSideMenu(true);
			}
		}

		if (this._utilService.isAdmin()) {
			this.router.navigateByUrl('/admin/companies');
			this._message.setSideMenu(true);
		} else {
			this.router.navigateByUrl('/store/boutique-registration');
			this._message.setSideMenu(false);
		}
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'superadmin_company_edit_partial'
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
					this._utilService.showSuccess(res['message']);
					this.readNotificationsList.push(this.unReadNotificationList[index]);
					this.unReadNotificationList.splice(index, 1);
				} else {
					this._utilService.showError(res['message']);
				}
			},
				error => {
					switch (error.status) {
						case 400:
							this._utilService.showError(error.error['message']);
							break;

						default:
							this._utilService.showError('Something went wrong.!');
							break;
					}
				});
	}

	addCompany() {
		this.router.navigateByUrl('admin/add-boutique');
	}
	ngOnInit() {
		this.getAllNotifications();
		this.hideNotificationFlag = this._local.getItem('companyIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}
		if (this._utilService.isAdmin()) {
			this._company.getCompany()
				.subscribe(res => {
					if (res['status'] === '1') {
						this.companiesList = res['data'].map(company => {
							const o = Object.assign({}, company);
							o.id = btoa(company['id']);
							return o;
						});
					}
					console.log(res);
				},
					error => {
						this.isAuthorized = false;
						switch (error.status) {
							case 400:
								this._utilService.showError(error.error['message']);
								break;

							default:
								this._utilService.showError('Something went wrong.!');
								break;
						}
					});
		}
	}

	switchToBoutique(comapnyObj: any) {
		this._local.setItem('store-obj', comapnyObj);
		this._company.setBoutiqueDataForSuperAdminAccess(comapnyObj.id);
		this._message.setSideMenu(false);
		this.router.navigateByUrl('store/boutique-registration');
	}

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		console.log(this.hideNotificationFlag);
		this._local.setItem('companyIsNotification', this.hideNotificationFlag);
	}

	searchValue(data) {
		// data.value
		this.searchFormData.append('search_key', data.value);
		this.searchFormData.append('page', '0');
		this._company.getCompanySearch(this.searchFormData)
			.subscribe(res => {
				console.log(res);
				if (res['status'] === '1') {
					this.companiesList = res['data'].map(company => {
						const o = Object.assign({}, company);
						o.id = btoa(company['id']);
						return o;
					});
				}
				console.log(res);
			},
				error => {
					this.isAuthorized = false;
					switch (error.status) {
						case 400:
							this._utilService.showError(error.error['message']);
							break;

						default:
							this._utilService.showError('Something went wrong.!');
							break;
					}
				});
	}
}
