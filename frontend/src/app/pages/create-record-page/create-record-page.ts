import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CarbonEmissionRecordRequest } from '../../models/carbon-emission-record.model';
import { CarbonEmissionRecordService } from '../../services/carbon-emission-record.service';

@Component({
  selector: 'app-create-record-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-record-page.html',
  styleUrl: './create-record-page.css'
})
export class CreateRecordPage implements OnInit {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();
  locations: string[] = [];
  
  loading = false;
  errorMessage = '';
  successMessage = '';



  newRecord: CarbonEmissionRecordRequest = {
    location: '',
    period: this.maxPeriod,
    totalEmissionsMt: 0,
    emissionsIntensity: null,
    emissionsPerCapita: 0,
    annualVariation: null
  };

  constructor(
    private readonly router: Router,
    private readonly carbonEmissionService: CarbonEmissionRecordService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadLocations();
  }
  loadLocations(): void {
    this.carbonEmissionService.getLocations().subscribe({
      next: (response) => {
        this.locations = response.locations;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Load locations error:', error);
      }
    });
  }
  createRecord(): void {
    if (!this.newRecord.location || this.newRecord.location.trim().length === 0) {
      this.errorMessage = 'Location is required';
      this.successMessage = '';
      this.changeDetectorRef.detectChanges();
      return;
    }

    if (
      this.newRecord.period < this.minPeriod ||
      this.newRecord.period > this.maxPeriod
    ) {
      this.errorMessage = `Year must be between ${this.minPeriod} and ${this.maxPeriod}`;
      this.successMessage = '';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.detectChanges();

    const recordToCreate: CarbonEmissionRecordRequest = {
      location: this.newRecord.location.trim(),
      period: Number(this.newRecord.period),
      totalEmissionsMt: Number(this.newRecord.totalEmissionsMt),
      emissionsIntensity: this.toNullableNumber(this.newRecord.emissionsIntensity),
      emissionsPerCapita: Number(this.newRecord.emissionsPerCapita),
      annualVariation: this.toNullableNumber(this.newRecord.annualVariation)
    };

    this.carbonEmissionService.createRecord(recordToCreate).subscribe({
      next: () => {
        this.successMessage = 'Record created successfully';
        this.errorMessage = '';
        this.finishLoading();

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 700);
      },
      error: (error) => {
        console.error('Create record error:', error);

        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error creating carbon emission record'
        );

        this.successMessage = '';
        this.finishLoading();
      }
    });
  }

  resetForm(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.newRecord = {
      location: '',
      period: this.maxPeriod,
      totalEmissionsMt: 0,
      emissionsIntensity: null,
      emissionsPerCapita: 0,
      annualVariation: null
    };

    this.changeDetectorRef.detectChanges();
  }

  private finishLoading(): void {
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    return Number(value);
  }

  private getApiErrorMessage(error: any, defaultMessage: string): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return defaultMessage;
  }
}