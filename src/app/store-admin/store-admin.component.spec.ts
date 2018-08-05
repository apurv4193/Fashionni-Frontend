import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAdminComponent } from './store-admin.component';

describe('StoreAdminComponent', () => {
  let component: StoreAdminComponent;
  let fixture: ComponentFixture<StoreAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
