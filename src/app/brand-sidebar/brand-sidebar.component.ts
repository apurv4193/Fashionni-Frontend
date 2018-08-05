import { Component, OnInit } from '@angular/core';
import { ProductService } from './../core/service/product-service/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { UtilService } from './../core/service/util-service/util.service';

@Component({
	selector: 'app-brand-sidebar',
	templateUrl: './brand-sidebar.component.html',
	styleUrls: ['./brand-sidebar.component.css']
})
export class BrandSidebarComponent implements OnInit {
	height = 0;
	brands = [];
	constructor(private _product: ProductService,
		private router: Router,
		private _message: MessageServiceService,
		private _util: UtilService) { }

	ngOnInit() {
		this.getBoutiqueBrands();
	}

	getBoutiqueBrands() {
		this._product.getBoutiqueBrands(this._util.getCompanyId())
			.subscribe(brandRes => {
			console.log(brandRes);
			if (brandRes['status'] === '1') {
				this.brands = brandRes['data'];
			}
		});
	}

	openProductListing() {
		this.router.navigateByUrl('/product/product-list/' + btoa('0'));
	}

	addBrandToFilter(obj, index) {
		for (const i in this.brands) {
			if (i.hasOwnProperty ) {
				this.brands[i]['isSelected'] = false;
			}
		}
		this.brands[index]['isSelected'] = true;

		this._message.setBrandForSideMenu(obj);
	}

}
