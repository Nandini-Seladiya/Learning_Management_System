import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentEvaluationComponent } from './talent-evaluation.component';

describe('TalentEvaluationComponent', () => {
  let component: TalentEvaluationComponent;
  let fixture: ComponentFixture<TalentEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentEvaluationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
