import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CategoryService } from './../../core/service/category-service/category.service';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { UtilService } from './../../core/service/util-service/util.service';
import { MessageServiceService } from './../../core/service/message-service/message-service.service';
import { NotificationServiceService } from './../../core/service/notification-service/notification-service.service';
import { LocalStorageService } from './../../core/service/local-storage/local-storage.service';
import { SlicePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Local } from 'protractor/built/driverProviders';
declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-product-category',
	templateUrl: './product-category.component.html',
	styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit, AfterViewInit {
	categories = {
		category1: [],
		category2: [],
		category3: [],
		category4: []
	};
	saveCategoryForm: FormGroup;
	isFormOpen: Boolean = false;
	categoryFormData = new FormData();
	saveData = new FormData();
	editData = new FormData();
	singleImageData = new FormData();
	deleteFormData = new FormData();
	brandImage: String = '../../../assets/images/category-add.png';
	categoryLevel: any;
	parentId: any;
	addFlag = [];
	falgSetParent: boolean;
	currentId = [];
	readNotificationsList = [];
	unReadNotificationList = [];
	formField = [
		'category_name_en',
		'category_name_ch',
		'category_name_ge',
		'category_name_fr',
		'category_name_it',
		'category_name_sp',
		'category_name_ru',
		'category_name_jp'
	];
	imageArray = [
		{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
		{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
		{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
		{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
	];
	categoryId: any;
	imageFormData: any;
	editFlag = false;
	singleImageIndex: number;
	id: any;
	catFunId: any;
	catIndex: any;
	editId: any;
	hideNotificationFlag: any;
	deleteCategoryData = new FormData();
	flagSet: any;
	dataSaveFlag: any;
	parentArray = { '2': '', '3': '', '4': '', '5': '' };
	plusFlag: any;
	constructor(public _category: CategoryService,
		private _fb: FormBuilder,
		public _util: UtilService,
		public _message: MessageServiceService,
		private _notificationService: NotificationServiceService,
		private _local: LocalStorageService,
		public _location: Location) {
		this.saveCategoryForm = this._fb.group({
			category_name_en: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_ch: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_ge: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_fr: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_it: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_sp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_ru: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])],
			category_name_jp: [{ value: '', disabled: !this.isFormOpen }, Validators.compose([Validators.required])]
		});
		this.imageFormData = [];
	}

	ngOnInit() {
		this.hideNotificationFlag = this._local.getItem('productCategoryIsNotification');
		if (this.hideNotificationFlag === null) {
			this.hideNotificationFlag = true;
		}

		this.getMainCategory();
		this.getAllNotifications();
	}

	getMainCategory() {
		this._category.getMainCategory({})
			.subscribe(res => {
				if (res['status'] === 1) {
					this.categories.category1 = res['data'];
					if (this.categories.category1.length) {
						this.addFlag[0] = false;
					} else {
						this.addFlag[0] = true;
					}
				}
			});
	}

	saveFormData(form: NgForm) {
		if (this.saveCategoryForm.valid) {
			if (this.isFormOpen && this.editFlag === true) {

				console.log(this.saveCategoryForm.value);

				this.saveData.delete('category_name_en');
				this.saveData.delete('category_name_ch');
				this.saveData.delete('category_name_fr');
				this.saveData.delete('category_name_ge');
				this.saveData.delete('category_name_it');
				this.saveData.delete('category_name_jp');
				this.saveData.delete('category_name_ru');
				this.saveData.delete('category_name_sp');
				this.saveData.delete('id');
				this.saveData.delete('action');

				// this.saveCategoryForm.get('category_name_ch').disable();
				// this.saveCategoryForm.get('category_name_en').disable();
				// this.saveCategoryForm.get('category_name_fr').disable();
				// this.saveCategoryForm.get('category_name_ge').disable();
				// this.saveCategoryForm.get('category_name_it').disable();
				// this.saveCategoryForm.get('category_name_jp').disable();
				// this.saveCategoryForm.get('category_name_ru').disable();
				// this.saveCategoryForm.get('category_name_sp').disable();

				// for (const data of this.formField) {
				// 	if (this.saveCategoryForm.value[data] === null) {
				// 		this.saveData.append(data, '');
				// 	} else {
				// 		this.saveData.append(data, this.saveCategoryForm.value[data]);
				// 	}
				// }
				if (this.categoryLevel !== 1) {
					if (this.flagSet) {
						// for level 3 update
						// this.editCategoryData(this.editData.get('id'));
						const level = this.catFunId - 2;
						this.saveData.delete('category_level');
						this.saveData.append('category_level', this.categoryLevel);
						this.saveData.delete('is_parent');
						this.saveData.append('action', '2');
						this.saveData.append('id', this.editData.get('id'));
						this.saveData.append('is_parent', this.parentArray[this.catFunId - 1]);
					} else {
						// for level 2 add
						this.saveData.delete('is_parent');
						// this.saveData.append('action', '1');
						// this.saveData.append('is_parent', this.parentId);
						const level = this.catFunId - 2;
						this.saveData.delete('category_level');
						this.saveData.append('category_level', this.categoryLevel);
						this.saveData.append('action', '1');
						this.saveData.append('is_parent', this.parentArray[this.catFunId - 1]);
					}
				} else {
					// for level 1 add
					if (this.flagSet) {
						const level = this.catFunId - 2;
						this.saveData.delete('category_level');
						this.saveData.append('category_level', this.categoryLevel);
						this.saveData.append('action', '2');
						this.saveData.append('id', this.editData.get('id'));
						this.saveData.append('is_parent', '0');
					} else {
						const level = this.catFunId - 2;
						this.saveData.delete('category_level');
						this.saveData.append('category_level', this.categoryLevel);
						this.saveData.append('action', '1');
						this.saveData.append('id', this.editData.get('id'));
						this.saveData.append('is_parent', '0');
					}

				}
				// this.saveData.delete('category_level');

				this.imageArray = [
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
				];


				for (const data in this.saveCategoryForm.value) {
					if (this.saveCategoryForm.value[data] === null) {
						this.saveData.append(data, '');
						console.log(data);
					} else {
						this.saveData.append(data, this.saveCategoryForm.value[data]);
					}
				}
				this._category.saveCategory(this.saveData)
					.subscribe(res => {
						console.log(res);

						if (res['status'] === 1) {
							// this.getAllNotifications();
							// this.dataSaveFlag = true;
							// console.log(this.id + '.' + this.catFunId + '.' + this.catIndex);

							// if (this.categoryLevel === 1) {
							// 	this.getMainCategory();
							// }
							// if (this.categoryLevel === undefined) {
							// 	this.getMainCategory();
							// }
							// const ss = 'category' + this.catFunId;
							// this.categories[ss] = res['data']['child_categroies'];
							// console.log(this.categories.category1);


							if (this.flagSet) {
								for (let i = 0; i < this.categories.category1.length; i++) {
									if (this.categories.category1[i].id == this.editData.get('id')) {
										this.categories.category1[i].category_name_en = this.saveCategoryForm.value['category_name_en'];
									}
								}
								for (let i = 0; i < this.categories.category2.length; i++) {
									if (this.categories.category2[i].id == this.editData.get('id')) {
										this.categories.category2[i].category_name_en = this.saveCategoryForm.value['category_name_en'];
									}
								}
								for (let i = 0; i < this.categories.category3.length; i++) {
									if (this.categories.category3[i].id == this.editData.get('id')) {
										this.categories.category3[i].category_name_en = this.saveCategoryForm.value['category_name_en'];
									}
								}
								for (let i = 0; i < this.categories.category4.length; i++) {
									if (this.categories.category4[i].id == this.editData.get('id')) {
										this.categories.category4[i].category_name_en = this.saveCategoryForm.value['category_name_en'];
									}
								}
							} else {
								const ss = 'category' + this.categoryLevel;
								this.categories[ss].push(res['data']); //= res['data']['child_categroies'];
							}

							this.imageArray = [
								{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
								{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
								{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
								{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
							];

							// console.log(this.editData.get('id'));
							// if (this.flagSet) {
							// 	this.category(this.parentId, this.catFunId - 1, this.catIndex);
							// 	this.editFlag = false;
							// } else {
							// 	// console.log(this.parentId, this.catFunId, this.catIndex);
							// 	console.log(this.catIndex);
							// 	this.category(this.parentId, this.categoryLevel + 1, this.catIndex);

							// 	this.editFlag = false;
							// }
							this.saveCategoryForm.disable();
							// this.isFormOpen = false;
							for (const data of this.formField) {
								this.saveCategoryForm.controls[data].setValue('');
							}
							this._util.showSuccess(res['message']);
							this.saveData.delete('category_images[]');
							// this.getMainCategory();
						} else {
							this._util.showError(res['message']);
						}
					});
			}
		} else {
			for (const data of this.formField) {
				this.saveCategoryForm.controls[data].markAsTouched();
			}
		}
	}

	category(id, categoryId, j) {
		this.id = id;
		this.catFunId = categoryId;
		this.catIndex = j;
		this.plusFlag = categoryId;
		this.parentArray[categoryId] = id;
		console.log(this.parentArray);

		if (categoryId === 2) {
			this.categories['category3'] = [];
			this.categories['category4'] = [];
			this.categories['category5'] = [];
		}
		if (categoryId === 3) {
			this.categories['category4'] = [];
			this.categories['category5'] = [];
		}
		if (categoryId === 4) {
			this.categories['category5'] = [];
		}
		console.log(this.id + ',' + this.catFunId + ',' + this.catIndex);
		if (this.isFormOpen) {
			this.categoryFormData.append('id', id);
			this._category.getSubcategoryCategory(this.categoryFormData)
				.subscribe(res => {
					console.log(res);
					const ss = 'category' + categoryId;
					this.categories[ss] = res['data']['child_categroies'];
					console.log(this.categories[ss]);

					// for (let i = 0; i < this.categories.category1.length; i++) {
					// 	this.categories.category1[i]['activeFlag'] = false;
					// }
					// this.categories.category1[j]['activeFlag'] = true;

					// for (let i = 0; i < this.categories[ss].length; i++) {
					// 	this.categories[ss][i]['activeFlag'] = false;
					// }
					// this.categories[ss][j]['activeFlag'] = true;

					if (categoryId === 2) {
						// 	//reset section
						// 	console.log(res);
						// 	if (this.categories.category3.length === undefined) {
						// 		this.categories.category3 = [];
						// 	}
						// 	if (this.categories.category4.length === undefined) {
						// 		this.categories.category4 = [];
						// 	}
						// 	this.addFlag[2] = false;
						// 	this.addFlag[3] = false;
						// 	//

						// 	this.categories.category2 = res['data'];
						// 	if (this.categories.category2['child_categroies'].length) {
						// 		this.addFlag[1] = false;
						// 	} else {
						// 		this.addFlag[1] = true;
						// 	}
						// 	this.addFlag[3] = false;
						if (this.categories.category1) {
							for (let i = 0; i < this.categories.category1.length; i++) {
								this.categories.category1[i]['activeFlag'] = false;
							}
							this.categories.category1[j]['activeFlag'] = true;
						}
						this.editCategoryData(this.categories.category1[j].id, this.catFunId);
						// 	this.parentId = res['data'].id;
						// 	this.currentId[1] = 0; // res['data'].id;
						// 	this.currentId[2] = this.categories.category1[j].id;
						// this.categories.category1[j]['activeFlag'] = true;
						this.categoryLevel = 1;
					}
					if (categoryId === 3) {

						// 	//reset
						// 	this.addFlag[3] = false;
						// 	//

						// 	this.categories.category3 = res['data'];
						// 	if (this.categories.category3['child_categroies'].length) {
						// 		this.addFlag[2] = false;
						// 	} else {
						// 		this.addFlag[2] = true;
						// 	}

						// 	if (this.categories.category4.length === undefined) {
						// 		this.categories.category4 = [];
						// 	}
						if (this.categories.category2) {
							for (let i = 0; i < this.categories.category2.length; i++) {
								this.categories.category2[i]['activeFlag'] = false;
							}
							this.categories.category2[j]['activeFlag'] = true;
						}

						// if (this.categories.category2['child_categroies']) {
						// 	for (let i = 0; i < this.categories.category2['child_categroies'].length; i++) {
						// 		this.categories.category2['child_categroies'][i]['activeFlag'] = false;
						// 	}
						// }
						// console.log(this.categories.category2[j]['activeFlag']);

						// this.categories.category2['child_categroies'][j]['activeFlag'] = true;

						this.editCategoryData(this.categories.category2[j].id, this.catFunId);
						// 	this.parentId = res['data'].is_parent;//this.categories.category2['child_categroies'][j].id;//res['data'].id;
						// 	// this.currentId[2] = res['data'].id;
						// 	this.currentId[3] = this.categories.category2['child_categroies'][j].id;
						// this.categories.category2['child_categroies'][j]['activeFlag'] = true;
						this.categoryLevel = 2;
					}
					if (categoryId === 4) {
						// 	this.categories.category4 = res['data'];
						// 	if (this.categories.category4['child_categroies'].length) {
						// 		this.addFlag[3] = false;
						// 	} else {
						// 		this.addFlag[3] = true;
						// 	}

						// 	// if (this.categories.category4.length === undefined) {
						// 	// 	this.categories.category4 = [];
						// 	// }
						if (this.categories.category3) {
							for (let i = 0; i < this.categories.category3.length; i++) {
								this.categories.category3[i]['activeFlag'] = false;
							}
							this.categories.category3[j]['activeFlag'] = true;
						}
						// for (let i = 0; i < this.categories.category3['child_categroies'].length; i++) {
						// this.categories.category3['child_categroies'][i]['activeFlag'] = false;
						// }
						this.editCategoryData(this.categories.category3[j].id, this.catFunId);
						// 	this.parentId = res['data'].is_parent;//id;
						// 	// this.currentId[3] = res['data'].id;
						// this.categories.category3['child_categroies'][j]['activeFlag'] = true;
						// 	this.currentId[4] = this.categories.category3['child_categroies'][j].id;
						// 	// this.currentId[4] = res['data'].id;
						this.categoryLevel = 3;
					}
					if (categoryId === 5) {
						if (this.categories.category4) {
							for (let i = 0; i < this.categories.category4.length; i++) {
								this.categories.category4[i]['activeFlag'] = false;
							}
							this.categories.category4[j]['activeFlag'] = true;
						}
						// for (let i = 0; i < this.categories.category4['child_categroies'].length; i++) {
						// this.categories.category4['child_categroies'][i]['activeFlag'] = false;
						// }

						// this.categories.category4['child_categroies'][j]['activeFlag'] = true;
						this.categoryLevel = 4;
						// 	this.parentId = res['data'].is_parent;
						// 	this.currentId[4] = res['data'].id;
						// 	console.log(this.currentId[4]);
						this.editCategoryData(this.categories.category4[j].id, this.catFunId);
					}
				});
		}
	}

	editCategoryData(id, parentArrayIndex) {
		this.editId = id;
		this.editData.delete('id');
		this.editData.append('id', id);
		this.catFunId = parentArrayIndex;
		this._category.getCategoryDetails(this.editData)
			.subscribe(res => {
				console.log(res);
				this.editFlag = false;
				if (this.dataSaveFlag === true) {
					this.editFlag = false;
					this.flagSet = false;
				} else {
					this.editFlag = true;
					this.flagSet = true;
				}
				this.dataSaveFlag = false;
				this.imageArray = [];
				this.imageArray = [
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
				];
				for (let i = 0; i < res['data'].category_images.length; i++) {
					if (this.imageArray[i].img != null) {
						this.imageArray[i].img = res['data'].category_images[i].file_name;
						this.imageArray[i].id = res['data'].category_images[i].id;
						this.imageArray[i].categoryId = res['data'].category_images[i].category_id;
						this.categoryId = res['data'].category_images[i].category_id;
						console.log(this.categoryId);
					}
				}
				this.categoryId = res['data'].id;
				console.log(this.categoryId);

				this.saveCategoryForm.controls['category_name_ch'].setValue(res['data'].category_name_ch);
				this.saveCategoryForm.controls['category_name_en'].setValue(res['data'].category_name_en);
				this.saveCategoryForm.controls['category_name_fr'].setValue(res['data'].category_name_fr);
				this.saveCategoryForm.controls['category_name_ge'].setValue(res['data'].category_name_ge);
				this.saveCategoryForm.controls['category_name_it'].setValue(res['data'].category_name_it);
				this.saveCategoryForm.controls['category_name_jp'].setValue(res['data'].category_name_jp);
				this.saveCategoryForm.controls['category_name_ru'].setValue(res['data'].category_name_ru);
				this.saveCategoryForm.controls['category_name_sp'].setValue(res['data'].category_name_sp);
				this.enableSaveForm();
			});
	}

	lockFun(isFormOpen) {
		this.editFlag = false;
		this.flagSet = false;
		this.saveCategoryForm.markAsUntouched();
		$('.lock-icon').toggleClass('submit-text');
		if (this.isFormOpen === false) {
			this.isFormOpen = true;
		} else {
			this._location.back();
			this.isFormOpen = false;
		}
		this.enableSaveForm();
	}

	addCategory(id, currentId, columnIndex) {
		if (this.isFormOpen) {
			// if (id === 0) {
			// 	this.categories.category3 = [];
			// 	this.categories.category2 = [];
			// 	this.categories.category4 = [];
			// 	this.addFlag[2] = false;
			// 	this.addFlag[3] = false;
			// }

			// if (id === 1) {
			// 	this.addFlag[3] = false;
			// 	this.addFlag[2] = false;
			// 	this.categories.category3 = [];
			// 	this.categories.category4 = [];
			// }

			// if (id === 2) {
			// 	this.categories.category4 = [];
			// 	this.addFlag[3] = false;
			// }
			this.catFunId = id;
			this.categoryLevel = columnIndex;
			this.imageArray = [
				{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
				{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
				{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
				{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
			];
			// this.parentId = currentId;
			this.editFlag = true;
			this.flagSet = false;
			// console.log(this.parentId);
			this.saveCategoryForm.controls['category_name_ch'].setValue('');
			this.saveCategoryForm.controls['category_name_en'].setValue('');
			this.saveCategoryForm.controls['category_name_fr'].setValue('');
			this.saveCategoryForm.controls['category_name_ge'].setValue('');
			this.saveCategoryForm.controls['category_name_it'].setValue('');
			this.saveCategoryForm.controls['category_name_jp'].setValue('');
			this.saveCategoryForm.controls['category_name_ru'].setValue('');
			this.saveCategoryForm.controls['category_name_sp'].setValue('');
			// this.editData.delete('id');
			// if (id === 0) {
			// 	this.parentId = 0;
			// }
			this.saveCategoryForm.enable();
			// this.enableSaveForm();
		}
	}

	enableSaveForm() {
		if (this.isFormOpen && this.editFlag === true) {
			this.saveCategoryForm.get('category_name_ch').enable();
			this.saveCategoryForm.get('category_name_en').enable();
			this.saveCategoryForm.get('category_name_fr').enable();
			this.saveCategoryForm.get('category_name_ge').enable();
			this.saveCategoryForm.get('category_name_it').enable();
			this.saveCategoryForm.get('category_name_jp').enable();
			this.saveCategoryForm.get('category_name_ru').enable();
			this.saveCategoryForm.get('category_name_sp').enable();
		} else {
			this.saveCategoryForm.get('category_name_ch').disable();
			this.saveCategoryForm.get('category_name_en').disable();
			this.saveCategoryForm.get('category_name_fr').disable();
			this.saveCategoryForm.get('category_name_ge').disable();
			this.saveCategoryForm.get('category_name_it').disable();
			this.saveCategoryForm.get('category_name_jp').disable();
			this.saveCategoryForm.get('category_name_ru').disable();
			this.saveCategoryForm.get('category_name_sp').disable();
		}
	}

	fileChange(event) {
		this.imageArray = [];
		this.saveData.delete('category_images[]');
		this.imageFormData = [];
		if (this.isFormOpen) {
			const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
			if (window.navigator.userAgent.indexOf('Chrome') === -1) {
				var srcEle = event.explicitOriginalTarget;
			} else {
				var srcEle = event.srcElement;
			}
			// const srcEle = event.srcElement;
			console.log(srcEle.files.length);
			if (srcEle.files.length <= 4) {
				for (const i of srcEle.files) {
					if (i.type) {
						if (_validFileExtensions.indexOf(i.type) === -1) {
							this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
						} else {
							this.imageFormData.push(i);
							this.saveData.append('category_images[]', i);
							this._util.readProductURL(i, this.base64ArrayInit.bind(this));
						}
						console.log(this.saveData.get('category_images[]'));
					}
				}
			} else {
				this.imageArray = [
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
					{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
				];
				this._util.showError('Maximum four images are allowed');
			}
		}
	}

	base64ArrayInit(base64) {
		this.imageArray.push({ 'img': base64, 'id': '', 'categoryId': '' });
	}
	singleFileChange(event, id, categoryId, index) {
		this.singleImageData.delete('file_name');
		this.singleImageData.delete('category_id');
		this.singleImageData.delete('id');
		if (this.isFormOpen) {
			const _validFileExtensions = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
			if (window.navigator.userAgent.indexOf('Chrome') === -1) {
				var srcEle = event.explicitOriginalTarget;
			} else {
				var srcEle = event.srcElement;
			}
			// const srcEle = event.srcElement;
			if (srcEle.files && srcEle.files[0]) {
				if (_validFileExtensions.indexOf(srcEle.files[0]['type']) === -1) {
					this._util.showSuccess('Please upload valid format .jpg, .jpeg, .png, .gif');
				} else {
					this.singleImageIndex = index;
					this.singleImageData.append('file_name', srcEle.files[0]);
					this.singleImageData.append('category_id', categoryId);
					if (id) {
						this.singleImageData.append('id', id);
					} else {
						this.saveData.append('category_images[]', srcEle.files[0]);
					}
					this.singleImageUpload();
					this._util.readProductURL(srcEle.files[0], this.base64ArraySingleInit.bind(this));
				}
			}
		}
	}

	base64ArraySingleInit(base64) {

		for (let i = 0; i < this.imageArray.length; i++) {
			if (i === this.singleImageIndex) {
				this.imageArray[i].img = base64;
			}
		}

	}
	ngAfterViewInit() {
		setTimeout(() => {
			this._message.setSideMenu(false);
		});
	}
	singleImageUpload() {
		console.log(this.singleImageData.get('file_name'));
		console.log(this.singleImageData.get('category_id'));
		console.log(this.singleImageData.get('id'));
		if (this.singleImageData.get('id')) {
			this._category.uploadSingleImage(this.singleImageData)
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
					} else {
						this._util.showError(res['message']);
					}
					console.log(res);
				});
		}

		// }
	}

	deleteImage(id, index) {
		this.deleteFormData.append('id', id);
		for (let i = 0; i < this.imageArray.length; i++) {
			if (this.imageArray[i].id === id) {
				this.imageArray[i].img = '../../../assets/images/category-add.png';
			}
		}
		this._category.deleteSingleImage(this.deleteFormData)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._util.showSuccess(res['message']);
				} else {
					this._util.showError(res['message']);
				}
				console.log(res);
			});
	}

	getAllNotifications() {
		const postObj = {
			notification_page: 'category_details'
		};

		this._notificationService.getUnReadNotification(postObj)
			.subscribe(notificationRes => {
				this.unReadNotificationList = notificationRes['data'].map(data => {
					const obj = Object.assign({}, data);
					obj.date_1 = data['created_at'];
					obj.date_2 = data['created_at'];
					return obj;
				});
			});

		this._notificationService.getReadNotification(postObj)
			.subscribe(notificationRes => {
				this.readNotificationsList = notificationRes['data'].map(data => {
					const obj = Object.assign({}, data);
					obj.date_1 = data['created_at'];
					obj.date_2 = data['created_at'];
					return obj;
				});
			});
	}
	readNotification(obj, index) {
		const postObj = {
			notification_id: obj['id']
		};

		this._notificationService.setReadNotification(postObj)
			.subscribe(res => {
				if (res['status'] === 1) {
					this._util.showSuccess(res['message']);
					this.readNotificationsList.push(this.unReadNotificationList[index]);
					this.unReadNotificationList.splice(index, 1);
				} else {
					this._util.showError(res['message']);
				}
			},
				error => {
					switch (error.status) {
						case 400:
							this._util.showError(error.error['message']);
							break;

						default:
							this._util.showError('Something went wrong.!');
							break;
					}
				});
	}

	hideNotification() {
		// this.hideNotificationFlag = true ? false : true;
		if (this.hideNotificationFlag) {
			this.hideNotificationFlag = false;
		} else {
			this.hideNotificationFlag = true;
		}
		console.log(this.hideNotificationFlag);
		this._local.setItem('productCategoryIsNotification', this.hideNotificationFlag);
	}

	deleteCategory(id) {
		if (id) {
			this.deleteCategoryData.append('id', id);
			this._category.deleteCategoryData(this.deleteCategoryData)
				.subscribe(res => {
					if (res['status'] === 1) {
						this._util.showSuccess(res['message']);
						if (this.categoryLevel === 1) {
							this.getMainCategory();
							this.categories['category1'] = [];
							this.categories['category2'] = [];
							this.categories['category3'] = [];
							this.categories['category4'] = [];
						}
						if (this.categoryLevel === 2) {
							this.plusFlag = 2;
							this.categories['category2'] = [];
							this.categories['category3'] = [];
							this.categories['category4'] = [];
						}
						if (this.categoryLevel === 3) {
							this.plusFlag = 3;
							this.categories['category3'] = [];
							this.categories['category4'] = [];
						}
						if (this.categoryLevel === 4) {
							this.plusFlag = 4;
							this.categories['category4'] = [];
						}

						// this.category(this.id, this.catFunId, this.catIndex);

						for (const data of this.formField) {
							this.saveCategoryForm.controls[data].setValue('');
						}
						this.imageArray = [
							{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
							{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
							{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' },
							{ 'img': '../../../assets/images/category-add.png', 'id': '', 'categoryId': '' }
						];
					} else {
						this._util.showError(res['message']);
					}
					console.log(res);
				});
		}
	}
}
