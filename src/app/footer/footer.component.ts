import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { UtilService } from './../core/service/util-service/util.service';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})


export class FooterComponent implements OnInit {

	allLengData: any;
	changeLan: any;
	isLoggedIn = false;
	isAdmin = false;
	routerLinks = {
		boutique: '/admin/companies',
		product: '/product/product-list/' + btoa('0'),
		messages: '/messages/messages'
	};
	isProduct = false;
	isBoutique = false;
	isMessage = false;
	constructor(
		public translate: TranslateService,
		private _message: MessageServiceService,
		private _util: UtilService,
		private router: Router,
		private _local: LocalStorageService) {
		this.allLengData = [
			{ name: 'English', slug: 'en' },
			{ name: 'Chinese', slug: 'md' },
			{ name: 'French', slug: 'fr' },
			{ name: 'German', slug: 'gr' },
			{ name: 'Italian', slug: 'it' },
			{ name: 'Spanish', slug: 'sp' },
		]
		this._message.getLoggedIn().subscribe(messageData => {
			this.isLoggedIn = messageData;
		});
		this._message.getUserIsAdmin().subscribe(messageData => {
			this.isAdmin = messageData;
		});

		this.router.events.subscribe(val => {
			this.setFooterLinkActive();
		});
	}

	ngOnInit() {
		if (this._local.getItem('lang') != null || this._local.getItem('lang') !== undefined) {
			this._local.setItem('lang', this._local.getItem('lang'));
			this.translate.use(this._local.getItem('lang'));
			// console.log(this._local.getItem('lang'));
		} else {
			this._local.setItem('lang', 'en');
			this.translate.use('en');
		}
		this.isLoggedIn = this._util.isUserLoggedIn();
		this.isAdmin = <any>this._util.isAdmin();

		if (!this.isAdmin) {
			this.routerLinks = {
				boutique: '/store/boutique-registration',
				product: '/product/product-list/' + btoa('0'),
				messages: '/messages/messages'
			};
		}
	}

	setFooterLinkActive() {
		if (window.location['pathname'].indexOf('/product') > -1) {
			this.isProduct = true;
			this.isBoutique = false;
			this.isMessage = false;
		} else if (window.location['pathname'].indexOf('/store') > -1) {
			this.isBoutique = true;
			this.isProduct = false;
			this.isMessage = false;
		} else if (window.location['pathname'].indexOf('/admin') > -1) {
			this.isBoutique = true;
			this.isProduct = false;
			this.isMessage = false;
		} else if (window.location['pathname'].indexOf('/messages') > -1) {
			this.isBoutique = false;
			this.isProduct = false;
			this.isMessage = true;
		}
	}

	langSelect(langData) {
		const className = '.' + langData;
		this.changeLan = className;
		$('ul').find('a').removeClass('active');
		$(className).addClass('active');
		this.translate.use(langData);
		$('.language').toggleClass('open');
		this._local.setItem('lang', langData);
		// console.log(this._local.getItem('lang'));
		// $(this.changeLan).addClass('active');
		$('body').removeClass('french english german itallian chinese spanish');
		if (this._local.getItem('lang') === 'fr') {
			$('body').addClass('french');
		} else if (this._local.getItem('lang') === 'en') {
			$('body').addClass('english');
		} else if (this._local.getItem('lang') === 'gr') {
			$('body').addClass('german');
		} else if (this._local.getItem('lang') === 'it') {
			$('body').addClass('itallian');
		} else if (this._local.getItem('lang') === 'md') {
			$('body').addClass('chinese');
		} else if (this._local.getItem('lang') === 'sp') {
			$('body').addClass('spanish');
		}

	}
	addClass() {
		$('.language').toggleClass('open');
		const usedLang = this.translate.getDefaultLang();
		if (this.changeLan) {
			$(this.changeLan).addClass('active');
		} else {
			const lang = '.' + this._local.getItem('lang');
			$(lang).addClass('active');
		}
	}
}
