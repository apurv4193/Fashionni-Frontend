import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColourComponent } from './product-colour.component';

describe('ProductColourComponent', () => {
  let component: ProductColourComponent;
  let fixture: ComponentFixture<ProductColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductColourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
