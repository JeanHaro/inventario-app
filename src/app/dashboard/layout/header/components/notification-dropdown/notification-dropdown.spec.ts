import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDropdown } from './notification-dropdown';

describe('NotificationDropwdown', () => {
  let component: NotificationDropdown;
  let fixture: ComponentFixture<NotificationDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
