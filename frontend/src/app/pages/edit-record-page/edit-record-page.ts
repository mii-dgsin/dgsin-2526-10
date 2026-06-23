import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  CarbonEmissionRecord,
  CarbonEmissionRecordRequest
} from '../../models/carbon-emission-record.model';

import { CarbonEmissionRecordService } from '../../services/carbon-emission-record.service';

@Component({
  selector: 'app-edit-record-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-record-page.html',
  styleUrl: './edit-record-page.css'
})
export class EditRecordPage implements OnInit {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();

  recordId = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  recordToEdit: CarbonEmissionRecordRequest = {
    location: '',
    period: this.maxPeriod,
    totalEmissionsMt: 0,
    emissionsIntensity: null,
    emissionsPerCapita: 0,
    annualVariation: null
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly carbonEmissionService: CarbonEmissionRecordService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recordId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.recordId) {
      this.errorMessage = 'Record id is missing';
      this.loading = false;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loadRecord();
  }

  loadRecord(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.carbonEmissionService.getRecordById(this.recordId).subscribe({
      next: (response) => {
        const record = this.extractRecord(response);

        if (!record) {
          this.errorMessage = 'Record not found or invalid API response';
          this.finishLoading();
          return;
        }

        this.recordToEdit = {
          location: record.location,
          period: record.period,
          totalEmissionsMt: record.totalEmissionsMt,
          emissionsIntensity: record.emissionsIntensity,
          emissionsPerCapita: record.emissionsPerCapita,
          annualVariation: record.annualVariation
        };

        this.finishLoading();
      },
      error: (error) => {
        console.error('Load record error:', error);
        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error loading carbon emission record'
        );
        this.finishLoading();
      }
    });
  }

  updateRecord(): void {
    if (!this.recordToEdit.location || this.recordToEdit.location.trim().length === 0) {
      this.errorMessage = 'Location is required';
      this.changeDetectorRef.detectChanges();
      return;
    }

    if (
      this.recordToEdit.period < this.minPeriod ||
      this.recordToEdit.period > this.maxPeriod
    ) {
      this.errorMessage = `Year must be between ${this.minPeriod} and ${this.maxPeriod}`;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const recordToUpdate: CarbonEmissionRecordRequest = {
      location: this.recordToEdit.location.trim(),
      period: Number(this.recordToEdit.period),
      totalEmissionsMt: Number(this.recordToEdit.totalEmissionsMt),
      emissionsIntensity: this.toNullableNumber(this.recordToEdit.emissionsIntensity),
      emissionsPerCapita: Number(this.recordToEdit.emissionsPerCapita),
      annualVariation: this.toNullableNumber(this.recordToEdit.annualVariation)
    };

    this.carbonEmissionService
      .updateRecord(this.recordId, recordToUpdate)
      .subscribe({
        next: () => {
          this.successMessage = 'Record updated successfully';
          this.loading = false;
          this.changeDetectorRef.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 700);
        },
        error: (error) => {
          console.error('Update record error:', error);
          this.errorMessage = this.getApiErrorMessage(
            error,
            'Error updating carbon emission record'
          );
          this.finishLoading();
        }
      });
  }

  private finishLoading(): void {
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  private extractRecord(response: unknown): CarbonEmissionRecord | null {
    const directRecord = response as CarbonEmissionRecord;

    if (directRecord && directRecord._id) {
      return directRecord;
    }

    const wrappedResponse = response as { record?: CarbonEmissionRecord };

    if (wrappedResponse && wrappedResponse.record && wrappedResponse.record._id) {
      return wrappedResponse.record;
    }

    return null;
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