import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators, FormControl, NgForm, FormArray } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';

import { AddBoutiqueComponent } from './add-boutique.component';
@Component({
	moduleId: module.id,
	selector: 'address',
	templateUrl: 'address.component.html',
})
export class AddressComponent {

	// @Output() callmethod = new EventEmitter<boolean>();
	@ViewChild('AddBoutiqueComponent') callMethod: AddBoutiqueComponent;
	@Input('group')
	public adressForm: FormGroup;

	constructor(public addBoutique: AddBoutiqueComponent) {
	}
	// addAddress(1) {
	// 	this.addBoutique.addAddress();
	// }
	deleteAddress() {
		this.addBoutique.removeAddress(1);
	}
}