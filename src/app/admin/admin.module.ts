import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { AddBoutiqueComponent } from './add-boutique/add-boutique.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { AuthGuardService } from './../core/service/guards-service/auth-guard.service';
const routes: Routes = [
	{
		path: 'companies',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: CompanyComponent
	},
	{
		path: 'add-boutique/:id',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: AddBoutiqueComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		Ng4GeoautocompleteModule.forRoot(),
		SharedModule
	],
	declarations: [CompanyComponent, AddBoutiqueComponent]
})
export class AdminModule { }
