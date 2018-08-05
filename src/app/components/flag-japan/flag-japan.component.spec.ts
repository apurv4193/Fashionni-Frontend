import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagJapanComponent } from './flag-japan.component';

describe('FlagJapanComponent', () => {
  let component: FlagJapanComponent;
  let fixture: ComponentFixture<FlagJapanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagJapanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagJapanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
