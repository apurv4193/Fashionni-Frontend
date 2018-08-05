import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagChinaComponent } from './flag-china.component';

describe('FlagChinaComponent', () => {
  let component: FlagChinaComponent;
  let fixture: ComponentFixture<FlagChinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlagChinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagChinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
