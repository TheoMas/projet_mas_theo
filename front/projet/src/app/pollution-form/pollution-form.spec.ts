import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionForm } from './pollution-form';

describe('PollutionForm', () => {
  let component: PollutionForm;
  let fixture: ComponentFixture<PollutionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
