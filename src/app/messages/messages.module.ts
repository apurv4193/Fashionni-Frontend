import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../core/service/guards-service/auth-guard.service';
import { SharedModule } from './../shared/shared.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const routes: Routes = [
	{
		path: 'messages',
		canActivate: [AuthGuardService],
		canLoad: [AuthGuardService],
		canActivateChild: [AuthGuardService],
		component: MessagesComponent
	}
];


@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		PerfectScrollbarModule
	],
	declarations: [
		MessagesComponent
	]
})
export class MessagesModule { }
