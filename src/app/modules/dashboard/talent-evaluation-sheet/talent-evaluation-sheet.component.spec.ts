import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentEvaluationSheetComponent } from './talent-evaluation-sheet.component';

describe('TalentEvaluationSheetComponent', () => {
  let component: TalentEvaluationSheetComponent;
  let fixture: ComponentFixture<TalentEvaluationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentEvaluationSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentEvaluationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
