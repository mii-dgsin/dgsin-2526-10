import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsPage } from './integrations-page';

describe('IntegrationsPage', () => {
  let component: IntegrationsPage;
  let fixture: ComponentFixture<IntegrationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
