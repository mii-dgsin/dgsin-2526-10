import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationPage } from './integration-page';

describe('IntegrationPage', () => {
  let component: IntegrationPage;
  let fixture: ComponentFixture<IntegrationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
