import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesSidebarComponent } from './messages-sidebar.component';

describe('MessagesSidebarComponent', () => {
  let component: MessagesSidebarComponent;
  let fixture: ComponentFixture<MessagesSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
