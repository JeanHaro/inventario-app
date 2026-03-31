import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filtros } from './products-filters';

describe('Filtros', () => {
  let component: Filtros;
  let fixture: ComponentFixture<Filtros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Filtros],
    }).compileComponents();

    fixture = TestBed.createComponent(Filtros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
