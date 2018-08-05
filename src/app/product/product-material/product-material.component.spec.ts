import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMaterialComponent } from './product-material.component';

describe('ProductMaterialComponent', () => {
  let component: ProductMaterialComponent;
  let fixture: ComponentFixture<ProductMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
