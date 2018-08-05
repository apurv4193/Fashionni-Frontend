import { Component, OnInit } from '@angular/core';
import { CompanyService } from './../core/service/company-service/company.service';
import { UtilService } from './../core/service/util-service/util.service';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-product-sidebar',
	templateUrl: './product-sidebar.component.html',
	styleUrls: ['./product-sidebar.component.css']
})
export class ProductSidebarComponent implements OnInit {
	boutiqueList = [];
	constructor(private _company: CompanyService,
		private _util: UtilService,
		private _message: MessageServiceService,
		private router: Router) { }
	selectedId: number;
	height = ( window.innerHeight - 162 ) + 'px';
	ngOnInit() {
		this.getBoutiqueList();
		console.log(this.height);
		this._message.getProductSideMenuBoutiqueClicked().subscribe(messageData => {
			this.selectedId = messageData;
			if (this.selectedId === 0) {
				let index = 0;
				for (const i of this.boutiqueList) {
					this.boutiqueList[index]['isSelected'] = false;
					index++;
				}
			}
		});
	}

	getBoutiqueList() {
		this._company.getCompany()
			.subscribe(res => {
				if ( res['status'] === '1') {
					this.boutiqueList = res['data'];

					if (this.selectedId > 0) {
						for (const i in this.boutiqueList) {
							if (this.boutiqueList[i].hasOwnProperty('id')) {
								if (this.boutiqueList[i]['id'] === this.selectedId) {
									this.boutiqueList[i]['isSelected'] = true;
								}
							}
						}
					} else {
						for (const i in this.boutiqueList) {
							if (this.boutiqueList[i].hasOwnProperty['id'] ) {
								this.boutiqueList[i]['isSelected'] = false;
							}
						}
					}
				}
			},
			error => {
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
	addBoutiqueIdToFilter(obj, index) {
		for (const i in this.boutiqueList) {
			if (i.hasOwnProperty ) {
				this.boutiqueList[i]['isSelected'] = false;
			}
		}
		this.boutiqueList[index]['isSelected'] = true;
		this.router.navigateByUrl('/product/product-list/' + btoa(obj['id']));
	}

	openProductListing() {
		this.router.navigateByUrl('/product/product-list/' + btoa('0'));
	}
}
