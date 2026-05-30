import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTools } from './products-tools';

describe('ProductsTools', () => {
  let component: ProductsTools;
  let fixture: ComponentFixture<ProductsTools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsTools],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
