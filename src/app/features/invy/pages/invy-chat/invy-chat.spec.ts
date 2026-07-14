import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvyChat } from './invy-chat';

describe('InvyChat', () => {
  let component: InvyChat;
  let fixture: ComponentFixture<InvyChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvyChat],
    }).compileComponents();

    fixture = TestBed.createComponent(InvyChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
