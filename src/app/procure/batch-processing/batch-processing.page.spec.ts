import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProcessingPage } from './batch-processing.page';

describe('BatchProcessingPage', () => {
  let component: BatchProcessingPage;
  let fixture: ComponentFixture<BatchProcessingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchProcessingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchProcessingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
