import { Injectable } from '@angular/core';

const APP_PREFIX = 'fsni-';

@Injectable()
export class LocalStorageService {
	constructor() { }

	setItem(key: string, value: any) {
		localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
	}

	getItem(key: string) {
		return JSON.parse(localStorage.getItem(`${APP_PREFIX}${key}`));
	}

	removeItem(key: string) {
		return localStorage.removeItem(`${APP_PREFIX}${key}`);
	}

	static loadInitialState() {
		return Object.keys(localStorage).reduce((state: any, storageKey) => {
			if (storageKey.includes(APP_PREFIX)) {
				state = state || {};
				const stateKey = storageKey
					.replace(APP_PREFIX, '')
					.toLowerCase()
					.split('.');
				let currentStateRef = state;
				stateKey.forEach((key, index) => {
					if (index === stateKey.length - 1) {
						currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
						return;
					}
					currentStateRef[key] = currentStateRef[key] || {};
					currentStateRef = currentStateRef[key];
				});
			}
			return state;
		}, undefined);
	}

	/**
	 * Clear local storage data
	 * @param
	*/
	clearStorage(): void {
		this.removeItem('store-company-id');
		this.removeItem('user');
		this.removeItem('user-token');
		this.removeItem('is-default');
		this.removeItem('user-permission');
		this.removeItem('is-admin');
		this.removeItem('store-obj');
		this.removeItem('company');
		this.removeItem('lang');
	}
}
