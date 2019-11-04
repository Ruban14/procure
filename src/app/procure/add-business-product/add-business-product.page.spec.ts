import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessProductPage } from './add-business-product.page';

describe('AddBusinessProductPage', () => {
  let component: AddBusinessProductPage;
  let fixture: ComponentFixture<AddBusinessProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessProductPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
