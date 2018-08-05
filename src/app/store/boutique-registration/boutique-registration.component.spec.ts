import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueRegistrationComponent } from './boutique-registration.component';

describe('BoutiqueRegistrationComponent', () => {
  let component: BoutiqueRegistrationComponent;
  let fixture: ComponentFixture<BoutiqueRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoutiqueRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoutiqueRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
