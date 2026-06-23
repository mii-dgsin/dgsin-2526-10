import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsPage } from './records-page';

describe('RecordsPage', () => {
  let component: RecordsPage;
  let fixture: ComponentFixture<RecordsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
