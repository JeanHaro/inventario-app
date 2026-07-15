import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvyHistoryPanel } from './invy-history-panel';

describe('InvyHistoryPanel', () => {
  let component: InvyHistoryPanel;
  let fixture: ComponentFixture<InvyHistoryPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvyHistoryPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(InvyHistoryPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
