import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CampListPageComponent } from './camp-list-page.component';

describe('CampListPageComponent', () => {
  let component: CampListPageComponent;
  let fixture: ComponentFixture<CampListPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CampListPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
