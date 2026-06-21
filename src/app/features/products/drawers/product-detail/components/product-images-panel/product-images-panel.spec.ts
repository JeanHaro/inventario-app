import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesPanel } from './product-images-panel';

describe('ProductImagesPanel', () => {
  let component: ProductImagesPanel;
  let fixture: ComponentFixture<ProductImagesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductImagesPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductImagesPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
