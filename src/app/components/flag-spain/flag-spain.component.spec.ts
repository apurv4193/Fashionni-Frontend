import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagSpainComponent } from './flag-spain.component';

describe('FlagSpainComponent', () => {
  let component: FlagSpainComponent;
  let fixture: ComponentFixture<FlagSpainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagSpainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagSpainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
