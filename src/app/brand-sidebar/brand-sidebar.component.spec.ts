import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSidebarComponent } from './brand-sidebar.component';

describe('BrandSidebarComponent', () => {
  let component: BrandSidebarComponent;
  let fixture: ComponentFixture<BrandSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
