import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageServiceService } from './../core/service/message-service/message-service.service';
import { ChattingService } from './../core/service/chatting/chatting.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { LocalStorageService } from './../core/service/local-storage/local-storage.service';
import { UtilService } from './../core/service/util-service/util.service';

@Component({
	selector: 'app-messages-sidebar',
	templateUrl: './messages-sidebar.component.html',
	styleUrls: ['./messages-sidebar.component.css']
})
export class MessagesSidebarComponent implements OnInit {
	userArray = [];
	coursesObservable: Observable<any[]>;
	isAdmin: any;
	searchUser = '';
	searchObjectForUser = {
		page: 1,
		search_key: ''
	};
	newLenght: any;
	pageId: any;
	lengthAllData: any;
	showPopup = false;
	@ViewChild('userList') userListRef: ElementRef;
	constructor(public _message: MessageServiceService,
		public _chat: ChattingService,
		private db: AngularFireDatabase,
		private _local: LocalStorageService,
		private _util: UtilService) {
		this.getAllUsers();
	}

	search() {
		this.getAllUsers();
	}

	ngOnInit() {
	}

	getAllUsers() {
		this.isAdmin = this._util.isAdmin();

		console.log(this.isAdmin);
		if (this.isAdmin) {
			this._chat.getBoutiqueUsers(this.searchObjectForUser)
				.subscribe(res => {
					console.log(res);
					this.userArray = [];
					if (res['data']['data'].length > 0) {
						for (const x of res['data']['data']) {
							this.userArray.push(x);
						}
						this.pageId = 2;
						this.searchObjectForUser = {
							page: this.pageId,
							search_key: ''
						};
					} else {
						this.userArray = [];
					}
					if (this.userArray.length > 0) {
						this.joinChat(this.userArray[0], 0);
					}
				});
		} else {
			this._chat.getSuperAdminForBoutique(this.searchObjectForUser)
				.subscribe(res => {
					console.log(res['data'].length);

					this.userArray = [];
					if (res['data'].length > 0) {
						for (const x of res['data']) {
							this.userArray.push(x);
						}
						this.pageId = 2;
						this.searchObjectForUser = {
							page: this.pageId,
							search_key: ''
						};
					} else {
						this.userArray = [];
					}
					if (this.userArray.length > 0) {
						this.joinChat(this.userArray[0], 0);
					}
				});
		}
	}

	joinChat(obj, index) {
		if (!this.isAdmin) {
			obj['user_id'] = obj['id'];
		}
		const user_id = obj['user_id'];
		const logged_in_id = this._local.getItem('user')['id'];
		const item = this.db.object('chat/' + logged_in_id + '/' + user_id).valueChanges();

		for (let i = 0; i < this.userArray.length; i++) {
			this.userArray[i]['selected'] = false;
		}
		this.userArray[index]['selected'] = true;

		item.subscribe(res => {
			if (res === null) {
				// create conversion
				const current = new Date();
				const msg_obj = { dateCreated: current, messages: [] };

				this.db.list('conversations').push({
					dateCreated: new Date().toString(),
					messages: []
				}).then((success) => {

					this.db.object('chat/' + logged_in_id + '/' + user_id)
						.set(success.key);

					this.db.object('chat/' + user_id + '/' + logged_in_id)
						.set(success.key);

					obj['chatKey'] = success.key;
					this._message.setChat(obj);
				});
			} else {
				obj['chatKey'] = res;
				this._message.setChat(obj);
			}
		});
	}

	onWindowScroll(data) {
		const pos = (this.userListRef.nativeElement.scrollTop || document.body.scrollTop) + this.userListRef.nativeElement.offsetHeight;
		const max = this.userListRef.nativeElement.scrollHeight;
		// console.log(this.userListRef.nativeElement.offsetHeight);
		// console.log(this.userListRef.nativeElement.scrollHeight);
		if (pos === max) {
			console.log(this.pageId);
			if (this.pageId !== 1) {

				if (this.isAdmin) {
					this._chat.getBoutiqueUsers(this.searchObjectForUser)
						.subscribe(res => {
							// this.userArray = [];
							// if (res['data'].length > 0) {
							// 	for (const x of res['data']) {
							// 		this.userArray.push(x);
							// 	}
							// } else {
							// 	this.userArray = [];
							// }
							console.log(res);
							if (this.userArray.length > 0) {
								this.joinChat(this.userArray[0], 0);
							}
							this.lengthAllData = this.userArray.length;
							console.log(this.lengthAllData);
							console.log(res['data'].length);
							for (let i = 0; i < res['data']['data'].length; i++) {
								console.log(res['data']['data'][i]);
								this.userArray.push(res['data']['data'][i]);
							}
							this.newLenght = this.userArray.length;
							if (this.lengthAllData < this.newLenght) {
								this.pageId = this.pageId + 1;
								this.searchObjectForUser = {
									page: this.pageId,
									search_key: ''
								};
							}
						});
				} else {
					this._chat.getSuperAdminForBoutique(this.searchObjectForUser)
						.subscribe(res => {
							// this.userArray = [];
							// if (res['data'].length > 0) {
							// 	for (const x of res['data']) {
							// 		this.userArray.push(x);
							// 	}
							// } else {
							// 	this.userArray = [];
							// }
							if (this.userArray.length > 0) {
								this.joinChat(this.userArray[0], 0);
							}
							this.lengthAllData = this.userArray.length;
							console.log(this.lengthAllData);
							for (let i = 0; i < res['data']['data'].length; i++) {
								console.log(res['data']['data'][i]);
								this.userArray.push(res['data']['data'][i]);
							}
							this.newLenght = res['data']['data'].length;
							if (this.lengthAllData < this.newLenght) {
								this.pageId = this.pageId + 1;
								this.searchObjectForUser = {
									page: this.pageId,
									search_key: ''
								};
							}
						});
				}

			}
		}
	}

	addChatUser() {
		if (this.showPopup) {
			this.showPopup = false;
		} else {
			this.showPopup = true;
		}
		this._message.openChatPopup(this.showPopup);
	}
}
