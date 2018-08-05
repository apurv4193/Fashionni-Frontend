import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBoutiqueComponent } from './sidebar-boutique.component';

describe('SidebarBoutiqueComponent', () => {
  let component: SidebarBoutiqueComponent;
  let fixture: ComponentFixture<SidebarBoutiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarBoutiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
