import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NguiMapModule } from '@ngui/map';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../../environments/environment';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ToArrayPipe } from './../pipe/to-array/to-array.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SlimLoadingBarModule.forRoot(),
		ToastModule.forRoot(),
		NgDatepickerModule,
		TranslateModule,
		NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyCy50vaMSinsYcI97f3DYFaQxdxWecE_cA' }),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFireStorageModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SlimLoadingBarModule,
		ToastModule,
		NgDatepickerModule,
		NguiMapModule,
		TranslateModule,
		AngularFireModule,
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		ToArrayPipe
	],
	declarations: [ToArrayPipe]
})
export class SharedModule { }
