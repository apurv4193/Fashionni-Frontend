import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductMaterialComponent } from './product-material/product-material.component';
import { ProductColourComponent } from './product-colour/product-colour.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AuthGuardService } from './../core/service/guards-service/auth-guard.service';
import { ProductBrandComponent } from './product-brand/product-brand.component';
import { FlagAusComponent } from './../components/flag-aus/flag-aus.component';
import { FlagChinaComponent } from './../components/flag-china/flag-china.component';
import { FlagGermanyComponent } from './../components/flag-germany/flag-germany.component';
import { FlagFranceComponent } from './../components/flag-france/flag-france.component';
import { FlagItalyComponent } from './../components/flag-italy/flag-italy.component';
import { FlagSpainComponent } from './../components/flag-spain/flag-spain.component';
import { FlagRussiaComponent } from './../components/flag-russia/flag-russia.component';
import { FlagJapanComponent } from './../components/flag-japan/flag-japan.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { SafeHtmlPipe } from './../safe-html.pipe';

const routes: Routes = [
	{
		path: 'product-list/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: ProductListComponent
	},
	{
		path: 'add-product/:company_id/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: AddProductComponent
	},
	{
		path: 'material',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: ProductMaterialComponent
	},
	{
		path: 'product-brand/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: ProductBrandComponent
	},
	{
		path: 'color',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: ProductColourComponent
	},
	{
		path: 'category',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: ProductCategoryComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule
	],
	declarations: [
		SafeHtmlPipe,
		ProductListComponent,
		AddProductComponent,
		ProductMaterialComponent,
		ProductColourComponent,
		ProductBrandComponent,
		FlagAusComponent,
		FlagChinaComponent,
		FlagGermanyComponent,
		FlagFranceComponent,
		FlagItalyComponent,
		FlagSpainComponent,
		FlagRussiaComponent,
		FlagJapanComponent,
		ProductCategoryComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProductModule { }
