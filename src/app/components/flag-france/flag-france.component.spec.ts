import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagFranceComponent } from './flag-france.component';

describe('FlagFranceComponent', () => {
  let component: FlagFranceComponent;
  let fixture: ComponentFixture<FlagFranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagFranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagFranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
