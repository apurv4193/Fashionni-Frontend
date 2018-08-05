import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagGermanyComponent } from './flag-germany.component';

describe('FlagGermanyComponent', () => {
  let component: FlagGermanyComponent;
  let fixture: ComponentFixture<FlagGermanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagGermanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagGermanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
