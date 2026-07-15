import { TestBed } from '@angular/core/testing';

import { InvyChat } from './invy-chat';

describe('InvyChat', () => {
  let service: InvyChat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvyChat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
