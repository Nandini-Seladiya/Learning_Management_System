import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionSkeletonComponent } from './accordion-skeleton.component';

describe('AccordionSkeletonComponent', () => {
  let component: AccordionSkeletonComponent;
  let fixture: ComponentFixture<AccordionSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionSkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccordionSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
