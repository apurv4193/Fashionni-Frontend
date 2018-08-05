import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { BoutiqueRegistrationComponent } from './boutique-registration/boutique-registration.component'
import { TaxDetailComponent } from './tax-detail/tax-detail.component';
import { CustomsComponent } from './customs/customs.component';
import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreComponent } from './store/store.component';
import { SharedModule } from './../shared/shared.module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AuthGuardService } from './../core/service/guards-service/auth-guard.service';
const routes: Routes = [
	{
		path: 'bank-detail',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: BankDetailComponent
	},
	{
		path: 'boutique-registration',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: BoutiqueRegistrationComponent
	},
	{
		path: 'tax-detail',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: TaxDetailComponent
	},
	{
		path: 'customs',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: CustomsComponent
	},
	{
		path: 'user',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: UserComponent
	},
	{
		path: 'company',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: CompanyComponent
	},
	{
		path: 'userdetail/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: UserDetailComponent
	},
	{
		path: 'storedetail/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: StoreComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SharedModule,
		Ng4GeoautocompleteModule.forRoot()
	],
	declarations: [
		BankDetailComponent,
		BoutiqueRegistrationComponent,
		TaxDetailComponent,
		CustomsComponent,
		UserComponent,
		CompanyComponent,
		UserDetailComponent,
		StoreComponent
	]
})
export class StoreModule { }
