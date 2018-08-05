import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoutiqueComponent } from './add-boutique.component';

describe('AddBoutiqueComponent', () => {
  let component: AddBoutiqueComponent;
  let fixture: ComponentFixture<AddBoutiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBoutiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
