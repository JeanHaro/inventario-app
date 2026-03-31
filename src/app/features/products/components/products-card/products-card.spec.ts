import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCard } from './products-card';

describe('ProductoCard', () => {
  let component: ProductoCard;
  let fixture: ComponentFixture<ProductoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
