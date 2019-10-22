import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreListPage } from './store-list.page';

describe('StoreListPage', () => {
  let component: StoreListPage;
  let fixture: ComponentFixture<StoreListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
