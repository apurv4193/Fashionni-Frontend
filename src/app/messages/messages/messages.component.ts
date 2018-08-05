import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ChattingService } from './../../core/service/chatting/chatting.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { CompanyService } from './../../core/service/company-service/company.service';
import { StoreServiceService } from './../../core/service/store-service/store-service.service';
import { UtilService } from './../../core/service/util-service/util.service';
import * as firebase from 'firebase/app';
@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewInit {

	@ViewChild('chatList') chatListRef: ElementRef;
	perPageCount: number;
	firstLoad = true;
	startAt = '';
	msg_object = {};
	loadMore = false;

	coursesObservable: Observable<any[]>;
	otherUserObj: Number = 0;
	userData = [];
	txtMessage: String = '';
	messages = {};
	logged_in_id: Number = 0;
	task: AngularFireUploadTask;
	recentDocuments = [];
	percentage: Observable<number>;
	snapshot: Observable<any>;
	downloadURL: Observable<string>;
	popupFlag: any;
	companiesList: any;
	allUserData: any;
	companyId: any;
	userId: any;
	file_name: String = '';
	day_array = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	month_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	constructor(private _message: MessageServiceService,
		private db: AngularFireDatabase,
		public _chat: ChattingService,
		private _local: LocalStorageService,
		private storage: AngularFireStorage,
		private _company: CompanyService,
		private _store: StoreServiceService,
		public _util: UtilService) {

		this.logged_in_id = this._local.getItem('user')['id'];
		this._message.getChatPopup().subscribe(res => {
			this.popupFlag = res;
		});

		this.perPageCount = 15;

		this._message.getChat().subscribe(res => {
			this.otherUserObj = res;
			this.clear();
			this.getChatMessages();
		});
	}

	clear() {
		this.firstLoad = true;
		this.startAt = '';
		this.messages = {};
		this.recentDocuments = [];
		this.msg_object = {};
	}

	getChatMessages() {
		//const msg = this.db.list('/conversations/' + this.otherUserObj['chatKey'] + '/messages').valueChanges();
		console.log(this.startAt);
		const msg = this.db.list('/conversations/' + this.otherUserObj['chatKey'] + '/messages', ref => {
			if (!this.firstLoad) {
				console.log('aaa');
				const q = ref.orderByKey().endAt(this.startAt).limitToLast(this.perPageCount);
				return q;
			} else {
				const q = ref.orderByKey().limitToLast(this.perPageCount);
				return q;
			}
			//return ref.limitToLast(2).orderByKey().startAt('-LCmX7jmLbSjEFtq0t7g');
		}).valueChanges();

		msg.subscribe(messagesRes => {
			if (this.firstLoad) {
				this.clear();
			}
			if (messagesRes.length === 15) {
				this.loadMore = true;
			} else {
				this.loadMore = false;
			}
			if (messagesRes.length === this.perPageCount) {
				this.startAt = messagesRes[0]['parentKey'];
			}
			if (this.firstLoad) {
				for (const x of messagesRes) {

					if (x['type'] === 'document' || x['type'] === 'image' || x['type'] === 'audio') {
						this.recentDocuments.push(x);
					}

					if (this.msg_object[x['dateDisplay']] === undefined) {
						this.msg_object[x['dateDisplay']] = [{ text: x }];
					} else {
						this.msg_object[x['dateDisplay']].push({ text: x });
					}
				}
			} else {
				let ind = messagesRes.length - 2;
				for (const x of messagesRes) {
					if (ind > -1) {
						if (x['type'] === 'document' || x['type'] === 'image' || x['type'] === 'audio') {
							this.recentDocuments.unshift(messagesRes[ind]);
						}
						if (this.msg_object[x['dateDisplay']] === undefined) {
							this.msg_object[x['dateDisplay']] = [{ text: messagesRes[ind] }];
						} else {
							this.msg_object[x['dateDisplay']].unshift({ text: messagesRes[ind] });
						}
						ind--;
					}
				}
			}
			this.messages = this.msg_object;
			if (this.firstLoad) {
				this.gotoBottom();
			} else {
				this.chatListRef.nativeElement.scrollTop = 100;
			}
		});
	}

	deleteDocument(doc) {
		console.log(doc.url);
		if (doc.url !== undefined) {
			let file_path = doc.url.split('?')[0].split('/');
			file_path = file_path[file_path.length - 1];
			file_path = file_path.replace('%2F', '/');
			console.log(file_path);
			const storageRef = firebase.storage().ref();
			storageRef.child(`${file_path}`).delete();

			const feed_Ref = firebase.database().ref('/conversations/' + this.otherUserObj['chatKey'] + '/messages/');
			feed_Ref.child(doc.parentKey).remove();
		}
	}

	startUpload(event) {
		// The File object
		const srcEle = event.srcElement;
		const file = srcEle.files[0];

		const file_type = srcEle.files[0]['type'].split('/')[1];

		const supported_file_type = ['png', 'jpg', 'gif', 'jpeg', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt'];

		let message_type = '';

		if (supported_file_type.indexOf(file_type) < 0) {
			this._util.showError('Unsupported file type :( ');
			return;
		} else {
			console.log(file_type);
			if ( file_type === 'png' || file_type === 'jpg' || file_type ===  'gif' || file_type ===  'jpeg') {
				message_type = 'image';
			} else if (file_type ===  'doc' || file_type ===  'docx' || file_type ===   'xls' || file_type === 'xlsx' || file_type === 'pdf') {
				message_type = 'document';
			}
		}

		const file_name = new Date().getTime() + '_' + file.name;
		this.file_name = file_name;
		const path = `message-documents/${file_name}`;
		const customMetadata = { app: 'Fashioni Message Documents' };
		this.task = this.storage.upload(path, file, { customMetadata });
		this.percentage = this.task.percentageChanges();
		this.snapshot = this.task.snapshotChanges();
		this.downloadURL = this.task.downloadURL();

		console.log(this.downloadURL);

		this.downloadURL
			.subscribe(res => {
				console.log(res);
				if (res !== null) {
					this.sendFile(message_type, res);
				} else {
					this._util.showError('Error in uploding...');
				}
			});
	}

	gotoBottom() {
		setTimeout(() => {
			const element = document.getElementById('chat-content');
			element.scrollTop = element.scrollHeight - element.clientHeight;
		});
	}

	getDate() {
		const today = new Date();
		const dd = today.getDate();
		const mm = today.getMonth() + 1;

		let dd_str = dd + '';
		let mm_str = mm + '';
		const yyyy = today.getFullYear();
		if (dd < 10) {
			dd_str = '0' + dd;
		}
		if (mm < 10) {
			mm_str = '0' + mm;
		}
		return dd_str + '.' + mm_str + '.' + yyyy;
	}

	getHour() {
		const todayDate = new Date();
		let getCurrentHours = todayDate.getHours();
		let getCurrentMinutes = todayDate.getMinutes() + '';
		const getCurrentAmPm = getCurrentHours >= 12 ? 'PM' : 'AM';
		getCurrentHours = getCurrentHours % 12;
		getCurrentHours = getCurrentHours ? getCurrentHours : 12;
		getCurrentMinutes = getCurrentMinutes.length < 2 ? '0' + getCurrentMinutes : getCurrentMinutes;
		return getCurrentHours + ':' + getCurrentMinutes + ' ' + getCurrentAmPm;
	}

	getFullDate() {
		const todayDate = new Date();
		const day = todayDate.getDay();
		const getTodayDate = todayDate.getDate();
		const getTodayMonth =  todayDate.getMonth();
		const getTodayFullYear = todayDate.getFullYear();
		let getCurrentHours = todayDate.getHours();
		let getCurrentMinutes = todayDate.getMinutes() + '';
		let getCurrentSeconds = todayDate.getSeconds() + '';
		getCurrentHours = getCurrentHours;
		getCurrentHours = getCurrentHours ? getCurrentHours : 12;
		getCurrentMinutes = getCurrentMinutes.length < 2 ? '0' + getCurrentMinutes : getCurrentMinutes;
		getCurrentSeconds = getCurrentSeconds.length < 2 ? '0' + getCurrentSeconds : getCurrentSeconds;

		return this.day_array[day] + ' ' + this.month_array[getTodayMonth] + ' ' + getTodayMonth + ' ' +
		getTodayFullYear + ' ' + getCurrentHours + ':' + getCurrentMinutes + ':' + getCurrentSeconds;
	}

	ngOnInit() {
		this._company.getCompany()
			.subscribe(res => {
				this.companiesList = res['data'];
			});
	}

	categorySelect(event) {
		this.companyId = event.target.value;
		const postObj = {
			company_id: event.target.value
		};
		this._store.getCompanyUserList(postObj)
			.subscribe(res => {
				this.allUserData = res['data'];
			});
	}

	userIdSelect(event) {
		this.userId = event.target.value;
	}

	addChat() {
		let data = {
			'company_id': this.companyId,
			'user_id': this.userId
		};
		this._chat.adChatUser(data).subscribe(res => {
			if (res['status'] === 1) {
				this._util.showSuccess(res['message']);
				this.popupFlag = false;
			}
			if (res['status'] === 0) {
				this._util.showError(res['message']);
				this.popupFlag = false;
			}
		});
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}

	sendFile(mediaType, url) {
		this.clear();
		this.db.list('/conversations/' + this.otherUserObj['chatKey'] + '/messages')
			.push({
				date: this.getFullDate(),
				time: this.getHour(),
				dateDisplay: this.getDate(),
				text: this.file_name,
				sender: this.logged_in_id,
				type: mediaType,
				url: url
			}).then(res => {
				const feed_Ref = firebase.database().ref('/conversations/' + this.otherUserObj['chatKey'] + '/messages/' + res.key);
				feed_Ref.update({parentKey: res.key});
			});
		this.file_name = '';
		this.gotoBottom();
	}

	sendMessage() {
		if (this.txtMessage.trim() !== '') {
			this.clear();
			const obj = {
				date: this.getFullDate(),
				time: this.getHour(),
				dateDisplay: this.getDate(),
				text: this.txtMessage,
				sender: this.logged_in_id,
				type: 'text',
				url: ''
			};

			this.db.list('/conversations/' + this.otherUserObj['chatKey'] + '/messages').push(obj).then(res => {
				const feed_Ref = firebase.database().ref('/conversations/' + this.otherUserObj['chatKey'] + '/messages/' + res.key);
				feed_Ref.update({parentKey: res.key});
			});

			this.txtMessage = '';
			this.gotoBottom();
		}
	}
	enterToSend(event) {
		if (event.key === 13) {
			this.sendMessage();
		}
	}
	closeModel() {
		this.popupFlag = false;
	}

	onWindowScroll(event: any) {
		const pos = this.chatListRef.nativeElement.scrollTop;
		if (pos === 0 && this.startAt !== '' && this.loadMore) {
			console.log(pos);
			this.firstLoad = false;
			this.getChatMessages();
		}
	}
}
