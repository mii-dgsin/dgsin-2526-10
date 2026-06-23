import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecordPage } from './edit-record-page';

describe('EditRecordPage', () => {
  let component: EditRecordPage;
  let fixture: ComponentFixture<EditRecordPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRecordPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecordPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
