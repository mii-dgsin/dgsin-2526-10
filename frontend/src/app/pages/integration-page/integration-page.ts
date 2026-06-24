import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RenewableElectricityIntegrationResponse } from '../../models/renewable-electricity-integration.model';
import { IntegrationService } from '../../services/integration.service';

@Component({
  selector: 'app-integration-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './integration-page.html',
  styleUrl: './integration-page.css'
})
export class IntegrationPage {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();

  location = 'Spain';
  fromPeriod = '2020';
  toPeriod = '2023';

  loading = false;
  errorMessage = '';
  integration?: RenewableElectricityIntegrationResponse;

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  get hasInvalidFilters(): boolean {
    const fromYear = Number(this.fromPeriod);
    const toYear = Number(this.toPeriod);

    if (!this.location || this.location.trim().length === 0) {
      return true;
    }

    if (fromYear < this.minPeriod || fromYear > this.maxPeriod) {
      return true;
    }

    if (toYear < this.minPeriod || toYear > this.maxPeriod) {
      return true;
    }

    return fromYear > toYear;
  }

  loadIntegration(): void {
    if (this.hasInvalidFilters) {
      this.errorMessage =
        `Location is required. Years must be between ${this.minPeriod} and ${this.maxPeriod}, ` +
        'and From year cannot be greater than To year.';
      this.integration = undefined;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.integration = undefined;
    this.changeDetectorRef.detectChanges();

    this.integrationService
      .getRenewableElectricityIntegration({
        location: this.location.trim(),
        fromPeriod: this.fromPeriod,
        toPeriod: this.toPeriod
      })
      .subscribe({
        next: (response) => {
          this.integration = response;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Integration error:', error);
          this.errorMessage = this.getApiErrorMessage(
            error,
            'Error loading renewable electricity integration'
          );
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  private getApiErrorMessage(error: any, defaultMessage: string): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    return defaultMessage;
  }
}