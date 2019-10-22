import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestPage } from './harvest.page';

describe('HarvestPage', () => {
  let component: HarvestPage;
  let fixture: ComponentFixture<HarvestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
