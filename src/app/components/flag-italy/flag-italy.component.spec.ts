import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagItalyComponent } from './flag-italy.component';

describe('FlagItalyComponent', () => {
  let component: FlagItalyComponent;
  let fixture: ComponentFixture<FlagItalyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagItalyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagItalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
