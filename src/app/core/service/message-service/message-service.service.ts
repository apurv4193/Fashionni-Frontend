import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessageServiceService {

	loginSubject = new BehaviorSubject<boolean>(false);
	isAdmin = new BehaviorSubject<boolean>(false);
	companiesList = new Subject<any>();
	userPermissionArray = new Subject<any>();
	productSideMenuClick = new Subject<any>();
	sideMenu = new BehaviorSubject<boolean>(false);
	productForSideMenu = new BehaviorSubject<boolean>(false);
	brandForSidemenuBoutique = new BehaviorSubject<boolean>(false);
	userId = new BehaviorSubject<boolean>(false);
	message = new BehaviorSubject<boolean>(false);
	popupFlag = new BehaviorSubject<boolean>(false);
	vatValue = new BehaviorSubject<boolean>(false);
	constructor() {

	}

	/**
     *
     * @param val For user login or not check
    */
	setLoggedIn(val: boolean) {
		this.loginSubject.next(val);
	}

	getLoggedIn(): Observable<boolean> {
		return this.loginSubject.asObservable();
	}

	setDefaultValue(val: any) {
		this.vatValue.next(val);
	}

	getDefaultValue() {
		return this.vatValue.asObservable();
	}

	userChatId(val: any) {
		this.userId.next(val);
	}

	openChatPopup(val: any) {
		this.popupFlag.next(val);
	}

	getChatPopup(): Observable<any> {
		return this.popupFlag.asObservable();
	}

	getChatId() {
		return this.userId.asObservable();
	}

	/**
     *
     * @param val For user login or not check
    */
	setSuperAdminCompanyList(val: Array<Object>) {
		this.companiesList.next(val);
	}

	getSuperAdminCompanyList(): Observable<Array<Object>> {
		return this.companiesList.asObservable();
	}

	/**
     *
     * @param val For user login type get
    */
	setUserIsAdmin(val: boolean) {
		this.isAdmin.next(val);
	}

	getUserIsAdmin(): Observable<boolean> {
		return this.isAdmin.asObservable();
	}

	setUserPermission(val: Array<Object>) {
		this.userPermissionArray.next(val);
	}

	// getAgent status
	getUserPermission(): Observable<Array<Object>> {
		return this.userPermissionArray.asObservable();
	}

	setSideMenu(data: any) {
		this.sideMenu.next(data);
	}

	getSideMenu(): Observable<any> {
		return this.sideMenu.asObservable();
	}

	setProductSideMenuBoutiqueClicked(data: any) {
		this.productSideMenuClick.next(data);
	}

	getProductSideMenuBoutiqueClicked(): Observable<any> {
		return this.productSideMenuClick.asObservable();
	}

	setProductSelectedInSideMenu(data: any) {
		this.productForSideMenu.next(data);
	}

	getProductSelectedFromSideMenu(): Observable<any> {
		return this.productForSideMenu.asObservable();
	}

	setBrandForSideMenu(data: any) {
		this.brandForSidemenuBoutique.next(data);
	}

	getBrandForSideMenu(): Observable<any> {
		return this.brandForSidemenuBoutique.asObservable();
	}

	setChat(data: any) {
		this.message.next(data);
	}

	getChat(): Observable<any> {
		return this.message.asObservable();
	}
}
