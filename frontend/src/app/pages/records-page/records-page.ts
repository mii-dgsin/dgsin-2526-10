import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CarbonEmissionRecord } from '../../models/carbon-emission-record.model';
import { CarbonEmissionRecordService } from '../../services/carbon-emission-record.service';

@Component({
  selector: 'app-records-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './records-page.html',
  styleUrl: './records-page.css'
})
export class RecordsPage implements OnInit {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();

  records: CarbonEmissionRecord[] = [];
  locations: string[] = [];
  total = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';
  operationMessage = '';

  location = '';
  period = '';
  fromPeriod = '';
  toPeriod = '';

  limit = 10;
  offset = 0;

  private filterTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly carbonEmissionService: CarbonEmissionRecordService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadRecords();
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.total / this.limit), 1);
  }

  get firstVisibleRecord(): number {
    if (this.total === 0) {
      return 0;
    }

    return this.offset + 1;
  }

  get lastVisibleRecord(): number {
    return Math.min(this.offset + this.records.length, this.total);
  }

  get hasPreviousPage(): boolean {
    return this.offset > 0;
  }

  get hasNextPage(): boolean {
    return this.offset + this.limit < this.total;
  }

  get hasInvalidYearFilters(): boolean {
    if (this.isYearOutOfRange(this.period)) {
      return true;
    }

    if (this.isYearOutOfRange(this.fromPeriod)) {
      return true;
    }

    if (this.isYearOutOfRange(this.toPeriod)) {
      return true;
    }

    if (this.fromPeriod && this.toPeriod) {
      return Number(this.fromPeriod) > Number(this.toPeriod);
    }

    return false;
  }

  get activeYearFilterDescription(): string {
    if (this.period) {
      return `Filtering by exact year ${this.period}.`;
    }

    if (this.fromPeriod && this.toPeriod) {
      return `Filtering from ${this.fromPeriod} to ${this.toPeriod}.`;
    }

    if (this.fromPeriod) {
      return `Filtering from ${this.fromPeriod}.`;
    }

    if (this.toPeriod) {
      return `Filtering up to ${this.toPeriod}.`;
    }

    return 'No year filter applied.';
  }

  isYearOutOfRange(value: string): boolean {
    if (!value) {
      return false;
    }

    const year = Number(value);

    return year < this.minPeriod || year > this.maxPeriod;
  }

  loadRecords(options?: { keepSuccessMessage?: boolean; operationMessage?: string }): void {
    if (this.hasInvalidYearFilters) {
      this.loading = false;
      this.successMessage = '';
      this.errorMessage =
        `Years must be between ${this.minPeriod} and ${this.maxPeriod}. ` +
        '"From year" cannot be greater than "To year".';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loading = true;
    this.operationMessage = options?.operationMessage ?? 'Loading records...';
    this.errorMessage = '';

    if (!options?.keepSuccessMessage) {
      this.successMessage = '';
    }

    this.changeDetectorRef.detectChanges();

    this.carbonEmissionService
      .getRecords({
        location: this.location,
        period: this.period,
        fromPeriod: this.period ? '' : this.fromPeriod,
        toPeriod: this.period ? '' : this.toPeriod,
        limit: this.limit.toString(),
        offset: this.offset.toString()
      })
      .subscribe({
        next: (response) => {
          this.records = response.records;
          this.total = response.total;
          this.limit = response.limit;
          this.offset = response.offset;
          this.loading = false;
          this.operationMessage = '';
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error('Load records error:', error);
          this.errorMessage = this.getApiErrorMessage(
            error,
            'Error loading carbon emission records'
          );
          this.loading = false;
          this.operationMessage = '';
          this.changeDetectorRef.detectChanges();
        }
      });
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

  onFiltersChanged(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.offset = 0;
      this.loadRecords();
    }, 400);
  }

  onExactYearChanged(): void {
    if (this.period) {
      this.fromPeriod = '';
      this.toPeriod = '';
    }

    this.onFiltersChanged();
  }

  onRangeYearChanged(): void {
    if (this.fromPeriod || this.toPeriod) {
      this.period = '';
    }

    this.onFiltersChanged();
  }

  applyFilters(): void {
    this.offset = 0;
    this.loadRecords();
  }

  clearFilters(): void {
    this.location = '';
    this.period = '';
    this.fromPeriod = '';
    this.toPeriod = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.offset = 0;
    this.loadRecords();
  }

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }

    this.offset = Math.max(this.offset - this.limit, 0);
    this.loadRecords();
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.offset += this.limit;
    this.loadRecords();
  }

  changePageSize(): void {
    this.offset = 0;
    this.loadRecords();
  }

  deleteRecord(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.operationMessage = 'Deleting record...';
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.detectChanges();

    this.carbonEmissionService.deleteRecord(id).subscribe({
      next: () => {
        if (this.records.length === 1 && this.offset > 0) {
          this.offset = Math.max(this.offset - this.limit, 0);
        }

        this.successMessage = 'Record deleted successfully';
        this.loadRecords({
          keepSuccessMessage: true,
          operationMessage: 'Refreshing records after deleting record...'
        });
      },
      error: (error) => {
        console.error('Delete record error:', error);
        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error deleting carbon emission record'
        );
        this.loading = false;
        this.operationMessage = '';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  deleteAllRecords(): void {
    const confirmed = confirm(
      'Are you sure you want to delete all carbon emission records? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = confirm(
      'Final confirmation: all records will be deleted from the database.'
    );

    if (!secondConfirmation) {
      return;
    }

    this.loading = true;
    this.operationMessage = 'Deleting all records...';
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.detectChanges();

    this.carbonEmissionService.deleteAllRecords().subscribe({
      next: (response) => {
        this.records = [];
        this.total = 0;
        this.offset = 0;
        this.successMessage = `${response.deleted} records deleted successfully.`;
        this.loading = false;
        this.operationMessage = '';
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Delete all records error:', error);
        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error deleting all carbon emission records'
        );
        this.loading = false;
        this.operationMessage = '';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadInitialData(): void {
    const confirmed = confirm(
      'Initial data will only be loaded if the database collection is empty. Do you want to continue?'
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.operationMessage = 'Loading initial data...';
    this.errorMessage = '';
    this.successMessage = '';
    this.changeDetectorRef.detectChanges();

    this.carbonEmissionService.loadInitialData().subscribe({
      next: (response) => {
        this.offset = 0;

        if (response.loaded) {
          this.successMessage = `${response.inserted} initial records loaded successfully.`;
        } else {
          this.successMessage = response.message;
        }

        this.loadRecords({
          keepSuccessMessage: true,
          operationMessage: 'Refreshing records after loading initial data...'
        });
      },
      error: (error) => {
        console.error('Load initial data error:', error);
        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error loading initial carbon emission records'
        );
        this.loading = false;
        this.operationMessage = '';
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

    return defaultMessage;
  }
}