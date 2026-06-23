import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecordPage } from './create-record-page';

describe('CreateRecordPage', () => {
  let component: CreateRecordPage;
  let fixture: ComponentFixture<CreateRecordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRecordPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRecordPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
