import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invy } from './invy';

describe('Invy', () => {
  let component: Invy;
  let fixture: ComponentFixture<Invy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Invy],
    }).compileComponents();

    fixture = TestBed.createComponent(Invy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
