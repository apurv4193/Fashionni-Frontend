import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SidebarBoutiqueComponent } from './sidebar-boutique/sidebar-boutique.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Import services
 */
import { HttpService } from './core/service/http-service/http.service';
import { StoreAdminComponent } from './store-admin/store-admin.component';
import { UtilService } from './core/service/util-service/util.service';
import { LocalStorageService } from './core/service/local-storage/local-storage.service';
import { MessageServiceService } from './core/service/message-service/message-service.service';
import { AuthGuardService } from './core/service/guards-service/auth-guard.service';
import { AnonymousGuardService } from './core/service/guards-service/anonymous-guard.service';
import { LoginService } from './core/service/login-service/login.service';
import { UserService } from './core/service/user-service/user.service';
import { CompanyService } from './core/service/company-service/company.service';
import { StoreServiceService } from './core/service/store-service/store-service.service';
import { AuthInterceptor } from './core/service/auth-interceptor-service/auth-interceptor.service';
import { NotificationServiceService } from './core/service/notification-service/notification-service.service';
import { ProductService } from './core/service/product-service/product.service';
import { CategoryService } from './core/service/category-service/category.service';
import { ProductSidebarComponent } from './product-sidebar/product-sidebar.component';
import { BrandSidebarComponent } from './brand-sidebar/brand-sidebar.component';
import { MessagesSidebarComponent } from './messages-sidebar/messages-sidebar.component';
import { ChattingService } from './core/service/chatting/chatting.service';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	wheelPropagation: true
};

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({

	declarations: [
		AppComponent,
		HeaderComponent,
		SidebarComponent,
		FooterComponent,
		SidebarBoutiqueComponent,
		LoginAdminComponent,
		StoreAdminComponent,
		ProductSidebarComponent,
		BrandSidebarComponent,
		MessagesSidebarComponent
	],
	imports: [
		BrowserModule,
		AngularFontAwesomeModule,
		NgbModule.forRoot(),
		AppRoutingModule,
		PerfectScrollbarModule,
		HttpClientModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		SharedModule
	],
	providers: [
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		HttpService,
		UtilService,
		LocalStorageService,
		MessageServiceService,
		AuthGuardService,
		AnonymousGuardService,
		LoginService,
		UserService,
		CompanyService,
		StoreServiceService,
		NotificationServiceService,
		ProductService,
		CategoryService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		ChattingService
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
