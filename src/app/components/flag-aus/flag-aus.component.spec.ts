import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagAusComponent } from './flag-aus.component';

describe('FlagAusComponent', () => {
  let component: FlagAusComponent;
  let fixture: ComponentFixture<FlagAusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagAusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagAusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
