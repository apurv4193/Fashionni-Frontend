import { Component, OnInit } from '@angular/core';
import { CompanyService } from './../core/service/company-service/company.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
import { StoreServiceService } from './../core/service/store-service/store-service.service';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
@Component({
	selector: 'app-sidebar-boutique',
	templateUrl: './sidebar-boutique.component.html',
	styleUrls: ['./sidebar-boutique.component.css']
})
export class SidebarBoutiqueComponent implements OnInit {
	companiesList = [];
	company_id: string;
	companyStoreList = [];
	userPermission = [];
	height = 0;
	constructor(
		private _company: CompanyService,
		private router: Router,
		private _localStorage: LocalStorageService,
		private _store: StoreServiceService,
		private _message: MessageServiceService
		// public _storeFunCall: StoreComponent
	) {
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
		this._message.getUserPermission().subscribe(messageData => {
			this.userPermission = messageData;
		});
	}

	ngOnInit() {
		this.height = window.innerHeight;
		const postObj = {
			company_id: this.company_id
		};
		this._store.getCompanyStoreList(postObj)
			.subscribe(res => {
				console.log(res);
				this.companyStoreList = res['data'].map(company => {
					const o = Object.assign({}, company);
					o.id = btoa(company['id']);
					return o;
				});
			});

		this._store.getCompanyUserPermissionDetail()
			.subscribe(res => {
				console.log(res);
				this.userPermission = res['data']['permission'];
				this._localStorage.setItem('user-permission', res['data']['permission']);
				this._message.setUserPermission(res['data']['permission']);
			});
	}

	openCompanyDetail() {
		if (atob(this._localStorage.getItem('is-admin')) === '1') {
			this._company.clearBoutiqueDataForSuperAdminAccess();
			this._message.setSideMenu(true);
			this.router.navigateByUrl('/admin/companies');
		} else {
			this.userPermission.filter(item => {
				if (item.pageName === 'boutique') {
					if (item.view === 1) {
						const isAdmin = atob(this._localStorage.getItem('is-default'));
						if (isAdmin === '1') {
							this.router.navigateByUrl('/admin/add-boutique/' + btoa(this.company_id));
						}
					}
				}
			});
		}
	}

	showMenuWithPermission(page_name) {
		if (atob(this._localStorage.getItem('is-default')) === '1') {
			return true;
		} else {
			const userPermission = this._localStorage.getItem('user-permission');
			if (userPermission !== null) {
				for (let i = 0; i < userPermission.length; i++) {
					if (userPermission[i]['pageName'] === page_name) {
						if (userPermission[i]['view'] === 1) {
							return true;
						} else {
							return false;
						}
					}
				}
			}
		}
	}
}
