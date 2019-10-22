import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchListPage } from './batch-list.page';

describe('BatchListPage', () => {
  let component: BatchListPage;
  let fixture: ComponentFixture<BatchListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
