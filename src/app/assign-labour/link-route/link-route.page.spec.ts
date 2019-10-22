import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRoutePage } from './link-route.page';

describe('LinkRoutePage', () => {
  let component: LinkRoutePage;
  let fixture: ComponentFixture<LinkRoutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkRoutePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
