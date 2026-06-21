import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantsPanel } from './product-variants-panel';

describe('ProductVariantsPanel', () => {
  let component: ProductVariantsPanel;
  let fixture: ComponentFixture<ProductVariantsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductVariantsPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductVariantsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
