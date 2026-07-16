import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvyMessageComposer } from './invy-message-composer';

describe('InvyMessageComposer', () => {
  let component: InvyMessageComposer;
  let fixture: ComponentFixture<InvyMessageComposer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvyMessageComposer],
    }).compileComponents();

    fixture = TestBed.createComponent(InvyMessageComposer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
