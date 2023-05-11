import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramTableComponent } from './program-table.component';

describe('ProgramTableComponent', () => {
  let component: ProgramTableComponent;
  let fixture: ComponentFixture<ProgramTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
