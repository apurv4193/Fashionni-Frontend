import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { StoreAdminComponent } from './store-admin/store-admin.component';
import { AnonymousGuardService } from './core/service/guards-service/anonymous-guard.service';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { ProductColourComponent } from './product/product-colour/product-colour.component';

// routes
const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		canActivate: [AnonymousGuardService],
		canLoad: [AnonymousGuardService],
		canActivateChild: [AnonymousGuardService],
		component: LoginAdminComponent
	},
	{ path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
	{ path: 'store', loadChildren: './store/store.module#StoreModule' },
	{
		path: 'store-admin',
		canActivate: [AnonymousGuardService],
		canLoad: [AnonymousGuardService],
		canActivateChild: [AnonymousGuardService],
		component: StoreAdminComponent
	},
	{
		path: 'product', loadChildren: './product/product.module#ProductModule'
	},
	{ path: 'messages', loadChildren: './messages/messages.module#MessagesModule' },
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
