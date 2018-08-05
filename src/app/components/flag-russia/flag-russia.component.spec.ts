import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagRussiaComponent } from './flag-russia.component';

describe('FlagRussiaComponent', () => {
  let component: FlagRussiaComponent;
  let fixture: ComponentFixture<FlagRussiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagRussiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagRussiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
