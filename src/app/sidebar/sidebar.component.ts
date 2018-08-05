import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { CompanyService } from './../core/service/company-service/company.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	companiesList = [];
	company_id: string;
	height = 0;
	constructor(
		public translate: TranslateService,
		private _message: MessageServiceService,
		private _company: CompanyService,
		private router: Router,
		private _localStorage: LocalStorageService) {
		this.company_id = atob(this._localStorage.getItem('store-company-id'));
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang('en');

		// the lang to use, if the lang isn't available, it will use the current loader to get them
		translate.use('en');

		/**
		 * Get company list
		 */
		this._message.getSuperAdminCompanyList().subscribe(companyRes => {
			this.companiesList = companyRes;
		});
	}

	ngOnInit() {
		this.height = window.innerHeight;
		console.log(this.height);
		setTimeout(() => {
			// this.translate.getTranslation('en').subscribe(res => {
			//   console.log(res);
			// });

			// this.translate.get('Title').subscribe(result => {
			//   console.log(result);
			// });
			// this.translate.get
			// this.translate.get(['Title', 'en']).subscribe(result => {
			// console.log(JSON.stringify(result));
			// });

			console.log(this.translate.instant('en'));
			// // this.translate.use('fr');
			// alert(this.translate.currentLang);;
		}, 500);

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
			});
	}
}
